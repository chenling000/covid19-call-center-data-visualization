import { css } from "@emotion/react";
import { Box } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import AppBar from "../Components/AppBar";
import DatePicker from "../Components/DatePicker";
import GraphTitle from "../Components/GraphTitle";
import renderActiveShape from "../Components/PieChartActiveShape";
import { useAppSelector } from "../Hooks/reduxHooks";
import useFetchData from "../Hooks/useFetchData";
import useMedia from "../Hooks/useMedia";
import { defaultTheme } from "../theme/default";
import pieChartColors from "../theme/pie-chart-color";
import { getModeData, modeDataItemKey } from "../utils/mode-data";

const styles = {
  graphBox: css`
    height: 100%;
    width: 100%;
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
  `,
};

const PieChartPage: FC = () => {
  const { isWideScreen } = useMedia();
  const mode = useAppSelector((state) => state.displayMode.mode);
  const { startDate, endDate } = useAppSelector((state) => state.datePicker);
  const { data, isLoading, isError, error } = useFetchData({ from: startDate, till: endDate });
  const modeData = useMemo(() => (data.length > 0 ? getModeData(data, mode) : []), [data, mode]);
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = useCallback(
    (_: string, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <AppBar isLoading={isLoading} isError={isError} error={error}>
      <DatePicker />
      <Box css={styles.graphBox}>
        <GraphTitle isWideScreen={isWideScreen} />
        {data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={1000} height={1000}>
              <Pie
                data={modeData}
                cx="50%"
                cy={isWideScreen ? "50%" : "40%"}
                innerRadius={isWideScreen ? "20%" : "15%"}
                outerRadius={isWideScreen ? "80%" : "60%"}
                fill={defaultTheme.palette.primary.main}
                dataKey={modeDataItemKey.相談件数}
                onMouseEnter={onPieEnter}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
              >
                {modeData.map(({ displayDate }, index) => (
                  <Cell
                    key={`cell-${displayDate}`}
                    fill={
                      pieChartColors[Math.floor(pieChartColors.length / modeData.length) * index]
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </Box>
    </AppBar>
  );
};

export default PieChartPage;
