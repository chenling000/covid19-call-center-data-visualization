import { useCallback, useEffect, useState } from "react";

import { JaDayOfWeek } from "../types/date";

const baseUrl = "https://api.data.metro.tokyo.lg.jp/v1/Covid19CallCenter";

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
  prefecture: RawDataItem["都道府県名"];
  count: number;
  year: number;
  month: number; // January gives 0
  date: number; // 1 - 31
  day: number; // Sunday - Saturday : 0 - 6
};

const transformDataItem = (rawData: RawDataItem): DataItem => {
  const receptionDate = new Date(rawData["受付_年月日"]);
  return {
    prefecture: rawData["都道府県名"],
    count: rawData["相談件数"],
    year: receptionDate.getFullYear(),
    month: receptionDate.getMonth(),
    date: receptionDate.getDate(),
    day: receptionDate.getDay(),
  };
};

type FetchDataParameters = {
  from: Date;
  till: Date;
};

const useFetchData = ({ from, till }: FetchDataParameters) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const rawData: RawDataItem[] = [];
  const fetchData = useCallback(
    async (cursor = "") => {
      try {
        const res = await fetch(
          `${baseUrl}?from=${from}&till=${till}&limit=1000${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
          { cache: "force-cache" }
        );
        const resData: ResponseBody = await res.json();
        rawData.push(...resData[0]);

        if (resData[1].moreResults === "MORE_RESULTS_AFTER_LIMIT") {
          fetchData(resData[1].endCursor);
        }
      } catch (err) {
        console.error(err);
        setIsError(true);
      } finally {
        setData(rawData.map((d) => transformDataItem(d)));
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [from, till]
  );

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError };
};

export default useFetchData;
