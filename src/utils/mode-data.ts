import { DataItem } from "../types/api";
import { monthList, weekOfDayList, jaDayOfWeekList } from "../types/date";
import { Mode } from "../types/display-mode";

export const modeDataItemKey = {
  displayDate: "displayDate",
  相談件数: "相談件数",
} as const;

export interface ModeDataItem extends Record<keyof typeof modeDataItemKey, unknown> {
  displayDate: string;
  相談件数: number;
}

const assertUnreachable = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`);
};

export const getModeData = (data: DataItem[], mode: Mode): ModeDataItem[] => {
  switch (mode) {
    case "YEAR": {
      const monthSum = monthList.fill(0);
      data.forEach(({ month, count }) => {
        monthSum[month] += count;
      });
      return monthSum.map((count, index) => ({ displayDate: `${index + 1}月`, 相談件数: count }));
    }
    case "YEAR_MONTH": {
      const { year, month } = data[1];
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const dateSum = Array(daysInMonth).fill(0);
      data.forEach(({ date, count }) => {
        dateSum[date - 1] += count;
      });
      return dateSum.map((count, index) => ({
        displayDate: `${month + 1}/${index + 1}`,
        相談件数: count,
      }));
    }
    case "YEAR_MONTH_DAY": {
      const weekOfDaySum = weekOfDayList.fill(0);
      data.forEach(({ day, count }) => {
        weekOfDaySum[day] += count;
      });
      return weekOfDaySum.map((count, index) => ({
        displayDate: `${jaDayOfWeekList[index]}曜日`,
        相談件数: count,
      }));
    }
    default:
      return assertUnreachable(mode);
  }
};
