import { useCallback, useEffect, useState } from "react";

const baseUrl = "https://api.data.metro.tokyo.lg.jp/v1/Covid19CallCenter";

type QueryParameters = {
  from: string;
  till: string;
  cursor?: string;
};

type RawDataItem = {
  全国地方公共団体コード: string;
  都道府県名: string;
  曜日: "月" | "火" | "水" | "木" | "金" | "土" | "日";
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

type DataItem = {
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

const useFetchData = ({ from, till, cursor }: QueryParameters) => {
  const [rawData, setRawData] = useState<RawDataItem[]>([]);
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(
    async (currentCursor?: string) => {
      try {
        const res = await fetch(
          `${baseUrl}?from=${from}&till=${till}&limit=1000${currentCursor ? `&cursor=${currentCursor}` : ""}`
        );
        const resData: ResponseBody = await res.json();

        setRawData((prev) => [...prev, ...resData[0]]);

        if (resData[1].moreResults === "MORE_RESULTS_AFTER_LIMIT") {
          fetchData(resData[1].endCursor);
        }
      } catch (err) {
        console.error(err);
        setIsError(true);
      } finally {
        setData(rawData.map((d) => transformData(d)));
        setIsLoading(false);
      }
    },
    [from, till, rawData]
  );

  useEffect(() => {
    fetchData(cursor);
  }, [fetchData, cursor, from, till]);

  return { data, isLoading, isError };
};

export default useFetchData;
