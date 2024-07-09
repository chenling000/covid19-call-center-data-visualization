import { css } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { FC } from "react";
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
import DateRangePicker from "../Components/DateRangePicker";
import useMedia from "../Hooks/useMedia";
import { defaultTheme } from "../theme/default";

const dummyData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

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

interface LineChartPageProps {
  isWideScreen: boolean;
}

const LineChartPage: FC<LineChartPageProps> = () => {
  const { isWideScreen } = useMedia();

  return (
    <AppBar>
      <DateRangePicker />
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
            data={dummyData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </AppBar>
  );
};

export default LineChartPage;
