export const minDate = new Date("2020-01-01T00:00:00.000Z");
export const maxDate = new Date("2022-12-31T00:00:00.000Z");

export const yearList = [2020, 2021, 2022];

export const monthList = Array(12)
  .fill(0)
  .map((_, index) => index);

export const weekOfDayList = Array(7)
  .fill(0)
  .map((_, index) => index);

export const jaDayOfWeekList = ["日", "月", "火", "水", "木", "金", "土"] as const;
export type JaDayOfWeek = (typeof jaDayOfWeekList)[number];
