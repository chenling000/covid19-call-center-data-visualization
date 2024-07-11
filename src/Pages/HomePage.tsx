import { FC } from "react";

import AppBar from "../Components/AppBar";
import Calendar from "../Components/Calendar";
import { useAppSelector } from "../Hooks/reduxHooks";
import useFetchData from "../Hooks/useFetchData";
import useMedia from "../Hooks/useMedia";

const HomePage: FC = () => {
  const { isWideScreen } = useMedia();
  const { startDate, endDate } = useAppSelector((state) => state.datePicker);
  const { data, isLoading, isError, error } = useFetchData({ from: startDate, till: endDate });

  return (
    <AppBar isLoading={isLoading} isError={isError} error={error}>
      <Calendar isWideScreen={isWideScreen} data={data} />
    </AppBar>
  );
};

export default HomePage;
