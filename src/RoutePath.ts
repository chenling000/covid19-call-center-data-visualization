export const ROUTE_PATH = {
  home: "/home",
  lineChart: "/lineChart",
  pieChart: "/pieChart",
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare, @typescript-eslint/naming-convention
export type ROUTE_PATH = (typeof ROUTE_PATH)[keyof typeof ROUTE_PATH];
