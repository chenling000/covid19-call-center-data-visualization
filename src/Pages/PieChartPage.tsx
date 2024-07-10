import { FC } from "react";

import AppBar from "../Components/AppBar";
import DatePicker from "../Components/DatePicker";
import { useAppSelector } from "../Hooks/reduxHooks";
import useFetchData from "../Hooks/useFetchData";

const PieChartPage: FC = () => {
  // const { isWideScreen } = useMedia();
  // const mode = useAppSelector((state) => state.displayMode.mode);
  const { startDate, endDate } = useAppSelector((state) => state.datePicker);
  const { isLoading } = useFetchData({ from: startDate, till: endDate });

  return (
    <AppBar isLoading={isLoading}>
      <DatePicker />
    </AppBar>
  );
};

export default PieChartPage;
