import { ThemeProvider } from "@emotion/react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ja as jaLocal } from "date-fns/locale";
import React from "react";
import ReactDOM from "react-dom/client";

import AppRouter from "./AppRouter";
import { defaultTheme } from "./theme/default";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MUIThemeProvider theme={defaultTheme}>
      <ThemeProvider theme={defaultTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={jaLocal}>
          <AppRouter />
        </LocalizationProvider>
      </ThemeProvider>
    </MUIThemeProvider>
  </React.StrictMode>
);
