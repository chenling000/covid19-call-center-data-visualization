import { useCallback, useEffect, useState } from "react";

import { JaDayOfWeek } from "../types/date";
import { isArray, isPropertyAccessible } from "../utils/type-guards";

const baseUrl = "https://api.data.metro.tokyo.lg.jp/v1/Covid19CallCenter";

type RawDataItem = {
  都道府県名: string;
  曜日: JaDayOfWeek;
  受付_年月日: string;
  相談件数: number;
};

const isRawDataItem = (value: unknown): value is RawDataItem => {
  if (!isPropertyAccessible(value)) return false;
  return (
    typeof value.都道府県名 === "string" &&
    typeof value.曜日 === "string" &&
    typeof value.受付_年月日 === "string" &&
    typeof value.相談件数 === "number"
  );
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

const isResponseBody = (value: unknown): value is ResponseBody => {
  if (!isArray(value)) return false;
  const data = value[0];
  const meta = value[1];
  return (
    isArray(data) &&
    isRawDataItem(data[0]) &&
    isPropertyAccessible(meta) &&
    typeof meta.moreResults === "string" &&
    (meta.moreResults === "NO_MORE_RESULTS" || meta.moreResults === "MORE_RESULTS_AFTER_LIMIT") &&
    typeof meta.endCursor === "string" &&
    typeof meta.revision === "number" &&
    typeof meta.updated === "string"
  );
};

type ErrorResponse = {
  error: string;
};

const isErrorResponse = (value: unknown): value is ErrorResponse =>
  isPropertyAccessible(value) && typeof value.error === "string";

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
  const [error, setError] = useState<unknown>(undefined);

  const rawData: RawDataItem[] = [];
  const fetchData = useCallback(
    async (cursor = "") => {
      try {
        const res = await fetch(
          `${baseUrl}?from=${from}&till=${till}&limit=1000${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
          { cache: "force-cache" }
        );

        const response = await res.json();
        if (!isResponseBody(response)) {
          if (isErrorResponse(response)) throw new Error(response.error);
          throw new Error("Unexpected Error");
        }

        rawData.push(...response[0]);

        if (response[1].moreResults === "MORE_RESULTS_AFTER_LIMIT") {
          fetchData(response[1].endCursor);
        }
      } catch (err) {
        console.error("error", err);
        setError(err);
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
    setIsError(false);
    setError(undefined);
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError, error };
};

export default useFetchData;
