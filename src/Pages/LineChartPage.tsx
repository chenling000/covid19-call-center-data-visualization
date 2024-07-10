import { css } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AppBar from "../Components/AppBar";
import DatePicker from "../Components/DatePicker";
import { useAppSelector } from "../Hooks/reduxHooks";
import useFetchData, { DataItem } from "../Hooks/useFetchData";
import useMedia from "../Hooks/useMedia";
import { defaultTheme } from "../theme/default";
import { jaDayOfWeekList, monthList, weekOfDayList } from "../types/date";
import { Mode } from "../types/display-mode";

const tickFontSize = {
  big: 15,
  small: 12,
};

const styles = {
  graphBox: css`
    height: 100%;
    width: 100%;
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
    > * + * {
      margin-top: 0.5rem;
    }
  `,
};

const modeDataItemKey = {
  displayDate: "displayDate",
  相談件数: "相談件数",
} as const;

interface ModeDataItem extends Record<keyof typeof modeDataItemKey, unknown> {
  displayDate: string;
  相談件数: number;
}

const assertUnreachable = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`);
};

const getModeData = (data: DataItem[], mode: Mode): ModeDataItem[] => {
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

const LineChartPage: FC = () => {
  const { isWideScreen } = useMedia();
  const mode = useAppSelector((state) => state.displayMode.mode);
  const { startDate, endDate } = useAppSelector((state) => state.datePicker);
  const { data, isLoading } = useFetchData({ from: startDate, till: endDate });
  const modeData = useMemo(() => getModeData(data, mode), [data, mode]);

  console.log(data);

  return (
    <AppBar isLoading={isLoading}>
      <DatePicker />
      <Box css={styles.graphBox}>
        <Typography
          alignSelf="center"
          color={defaultTheme.palette.text.secondary}
          variant={isWideScreen ? "body1" : "body2"}
        >
          東京都新型コロナコールセンター相談件数
        </Typography>
        <ResponsiveContainer
          width={isWideScreen ? "95%" : "100%"}
          height={isWideScreen ? "80%" : "50%"}
        >
          <LineChart
            width={1000}
            height={500}
            data={modeData}
            margin={{
              left: 10,
              right: 10,
            }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis
              dataKey={modeDataItemKey.displayDate}
              interval={0}
              angle={-30}
              dx={-15}
              dy={10}
              tick={{
                fontSize: isWideScreen ? tickFontSize.big : tickFontSize.small,
              }}
            />
            <YAxis
              dataKey={modeDataItemKey.相談件数}
              tick={{
                fontSize: isWideScreen ? tickFontSize.big : tickFontSize.small,
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={modeDataItemKey.相談件数}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </AppBar>
  );
};

export default LineChartPage;
