import { ThemeProvider } from "@emotion/react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";

import AppRouter from "./AppRouter";
import { defaultTheme } from "./theme/default";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MUIThemeProvider theme={defaultTheme}>
      <ThemeProvider theme={defaultTheme}>
        <AppRouter />
      </ThemeProvider>
    </MUIThemeProvider>
  </React.StrictMode>
);
