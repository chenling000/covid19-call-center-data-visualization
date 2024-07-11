import { Sector } from "recharts";

import { ModeDataItem } from "../utils/mode-data";
import { isPropertyAccessible } from "../utils/type-guards";

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
    typeof props.payload.displayDate === "string" &&
    typeof props.payload.相談件数 === "number" &&
    typeof props.percent === "number" &&
    typeof props.value === "number"
  );
};

const renderActiveShape = (props: unknown) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isActiveShapeProps(props)) return <></>;
  const RADIAN = Math.PI / 180;
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

export default renderActiveShape;
