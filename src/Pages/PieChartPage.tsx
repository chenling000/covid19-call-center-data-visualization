import { css } from "@emotion/react";
import { Box } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from "recharts";

import AppBar from "../Components/AppBar";
import DatePicker from "../Components/DatePicker";
import { useAppSelector } from "../Hooks/reduxHooks";
import useFetchData from "../Hooks/useFetchData";
import useMedia from "../Hooks/useMedia";
import { defaultTheme } from "../theme/default";
import pieChartColors from "../theme/pie-chart-color";
import { getModeData, ModeDataItem, modeDataItemKey } from "../utils/getModeData";

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

type ActiveShapeProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: ModeDataItem;
  percent: number;
  value: number;
};

const isPropertyAccessible = (value: unknown): value is { [key: string]: unknown } => value != null;

const isActiveShapeProps = (props: unknown): props is ActiveShapeProps => {
  if (!isPropertyAccessible(props)) return false;
  if (!isPropertyAccessible(props.payload)) return false;
  return (
    typeof props.cx === "number" &&
    typeof props.cy === "number" &&
    typeof props.midAngle === "number" &&
    typeof props.innerRadius === "number" &&
    typeof props.outerRadius === "number" &&
    typeof props.startAngle === "number" &&
    typeof props.endAngle === "number" &&
    typeof props.fill === "string" &&
    // typeof props.payload.name === "string" &&
    // typeof props.payload.value === "number" &&
    typeof props.percent === "number" &&
    typeof props.value === "number"
  );
};

const RADIAN = Math.PI / 180;

const renderActiveShape = (props: unknown) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isActiveShapeProps(props)) return <></>;
  const {
    cx,
    cy,
    startAngle,
    midAngle,
    endAngle,
    innerRadius,
    outerRadius,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333">
        {payload.displayDate}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value}件`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const PieChartPage: FC = () => {
  const { isWideScreen } = useMedia();
  const mode = useAppSelector((state) => state.displayMode.mode);
  const { startDate, endDate } = useAppSelector((state) => state.datePicker);
  const { data, isLoading } = useFetchData({ from: startDate, till: endDate });
  const modeData = useMemo(() => (data.length > 0 ? getModeData(data, mode) : []), [data, mode]);
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = useCallback(
    (_: string, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <AppBar isLoading={isLoading}>
      <DatePicker />
      <Box css={styles.graphBox}>
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
