import { isPropertyAccessible, isArray } from "../utils/type-guards";

import { JaDayOfWeek } from "./date";

export type RawDataItem = {
  都道府県名: string;
  曜日: JaDayOfWeek;
  受付_年月日: string;
  相談件数: number;
};

export const isRawDataItem = (value: unknown): value is RawDataItem => {
  if (!isPropertyAccessible(value)) return false;
  return (
    typeof value.都道府県名 === "string" &&
    typeof value.曜日 === "string" &&
    typeof value.受付_年月日 === "string" &&
    typeof value.相談件数 === "number"
  );
};

export type ResponseBody = [
  RawDataItem[],
  {
    moreResults: "NO_MORE_RESULTS" | "MORE_RESULTS_AFTER_LIMIT";
    endCursor: string;
    revision: number;
    updated: string;
  },
];

export const isResponseBody = (value: unknown): value is ResponseBody => {
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

export type ErrorResponse = {
  error: string;
};

export const isErrorResponse = (value: unknown): value is ErrorResponse =>
  isPropertyAccessible(value) && typeof value.error === "string";

export type DataItem = {
  prefecture: RawDataItem["都道府県名"];
  count: number;
  year: number;
  month: number; // January gives 0
  date: number; // 1 - 31
  day: number; // Sunday - Saturday : 0 - 6
};
