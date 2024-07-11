import { FC } from "react";

import AppBar from "../Components/AppBar";
import Calendar from "../Components/Calendar";
import useMedia from "../Hooks/useMedia";

const HomePage: FC = () => {
  const { isWideScreen } = useMedia();
  const isLoading = false;

  return (
    <AppBar isLoading={isLoading}>
      <Calendar isWideScreen={isWideScreen} />
    </AppBar>
  );
};

export default HomePage;
