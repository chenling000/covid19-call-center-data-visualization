import { createTheme } from "@mui/material/styles";

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#ff6d14",
    },
    secondary: {
      main: "#bdbdbd",
    },
  },
  zIndex: {
    drawer: 100,
  },
  appBar: {
    background: "#ff6d14",
    text: "#ffffff",
  },
  drawer: {
    activeColor: "#ffdcc7",
  },
});

export default defaultTheme;
