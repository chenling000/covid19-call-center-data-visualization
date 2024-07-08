import { useCallback, useEffect, useState } from "react";

import { JaDayOfWeek } from "../types/date";

const baseUrl = "https://api.data.metro.tokyo.lg.jp/v1/Covid19CallCenter";

type QueryParameters = {
  from: Date;
  till: Date;
};

type RawDataItem = {
  全国地方公共団体コード: string;
  都道府県名: string;
  曜日: JaDayOfWeek;
  受付_年月日: string;
  相談件数: number;
};

type ResponseBody = [
  RawDataItem[],
  {
    moreResults: "NO_MORE_RESULTS" | "MORE_RESULTS_AFTER_LIMIT";
    endCursor: string;
    revision: number;
    updated: string;
  },
];

export type DataItem = {
  organizationCode: RawDataItem["全国地方公共団体コード"];
  prefecture: RawDataItem["都道府県名"];
  day: number;
  year: number;
  month: number; // January gives 0
  date: number; // Sunday - Saturday : 0 - 6
};

const transformData = (rawData: RawDataItem): DataItem => {
  const date = new Date(rawData["受付_年月日"]);
  return {
    organizationCode: rawData["全国地方公共団体コード"],
    prefecture: rawData["都道府県名"],
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    day: date.getDay(),
  };
};

const useFetchData = ({ from, till }: QueryParameters) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(
    async (cursor = "") => {
      try {
        const res = await fetch(
          `${baseUrl}?from=${from}&till=${till}&limit=1000${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`
        );
        const resData: ResponseBody = await res.json();
        const transformedData = resData[0].map((d) => transformData(d));
        setData((prev) => [...prev, ...transformedData]);

        if (resData[1].moreResults === "MORE_RESULTS_AFTER_LIMIT") {
          fetchData(resData[1].endCursor);
        }
      } catch (err) {
        console.error(err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [from, till]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError };
};

export default useFetchData;
