import { css } from "@emotion/react";
import { Box } from "@mui/material";
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
import GraphTitle from "../Components/GraphTitle";
import { useAppSelector } from "../Hooks/reduxHooks";
import useFetchData from "../Hooks/useFetchData";
import useMedia from "../Hooks/useMedia";
import { defaultTheme } from "../theme/default";
import { getModeData, modeDataItemKey } from "../utils/mode-data";

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
  tickFontSize: {
    big: 15,
    small: 12,
  },
};

const LineChartPage: FC = () => {
  const { isWideScreen } = useMedia();
  const mode = useAppSelector((state) => state.displayMode.mode);
  const { startDate, endDate } = useAppSelector((state) => state.datePicker);
  const { data, isLoading, isError, error } = useFetchData({ from: startDate, till: endDate });
  const modeData = useMemo(() => (data.length > 0 ? getModeData(data, mode) : []), [data, mode]);

  return (
    <AppBar isLoading={isLoading} isError={isError} error={error}>
      <DatePicker />
      <Box css={styles.graphBox}>
        <GraphTitle isWideScreen={isWideScreen} />
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
                fontSize: isWideScreen ? styles.tickFontSize.big : styles.tickFontSize.small,
              }}
            />
            <YAxis
              dataKey={modeDataItemKey.相談件数}
              tick={{
                fontSize: isWideScreen ? styles.tickFontSize.big : styles.tickFontSize.small,
              }}
            />
            <Tooltip />
            <Legend wrapperStyle={{ paddingTop: "1rem" }} />
            <Line
              type="monotone"
              dataKey={modeDataItemKey.相談件数}
              stroke={defaultTheme.palette.primary.main}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </AppBar>
  );
};

export default LineChartPage;
