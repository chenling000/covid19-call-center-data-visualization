import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "./Pages/ErrorPage";
import HomePage from "./Pages/HomePage";
import LineChartPage from "./Pages/LineChartPage";
import PieChartPage from "./Pages/PieChartPage";
import { ROUTE_PATH } from "./RoutePath";

interface Page<K extends keyof typeof ROUTE_PATH> {
  path: (typeof ROUTE_PATH)[K];
  element: React.ReactElement;
  errorElement?: React.ReactElement;
}

const pages: { [K in keyof typeof ROUTE_PATH]: Page<K> } = {
  home: {
    path: ROUTE_PATH.home,
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  lineChart: {
    path: ROUTE_PATH.lineChart,
    element: <LineChartPage />,
  },
  pieChart: {
    path: ROUTE_PATH.pieChart,
    element: <PieChartPage />,
  },
};

const router = createBrowserRouter(Object.values(pages).map((page) => page));

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
