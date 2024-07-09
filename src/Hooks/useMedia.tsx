import { useMediaQuery } from "@mui/material";

const useMedia = () => {
  const isWideScreen = useMediaQuery("(min-width: 768px)");

  return { isWideScreen };
};

export default useMedia;
