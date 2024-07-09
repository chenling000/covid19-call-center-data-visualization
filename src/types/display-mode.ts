export const modeKeys = ["YEAR", "YEAR_MONTH", "YEAR_MONTH_DAY"] as const;

export type Mode = (typeof modeKeys)[number];

export const displayMode: Record<Mode, string> = {
  YEAR: "年を指定して月毎",
  YEAR_MONTH: "年月を指定して日毎",
  YEAR_MONTH_DAY: "年月を指定して曜日毎",
} as const;
