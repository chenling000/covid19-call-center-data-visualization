import { useCallback, useEffect, useState } from "react";

import { RawDataItem, isResponseBody, isErrorResponse, DataItem } from "../types/api";

const baseUrl = "https://api.data.metro.tokyo.lg.jp/v1/Covid19CallCenter";

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

const useFetchData = ({ from, till }: { from: Date; till: Date }) => {
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
        // eslint-disable-next-line no-console
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
