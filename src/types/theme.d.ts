// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import { Theme, ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    appBar: {
      background: string;
      text: string;
    };
    drawer: {
      activeColor: string;
    };
    basePaper: string;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    appBar?: {
      background?: string;
      text?: string;
    };
    drawer?: {
      activeColor?: string;
    };
    basePaper?: string;
  }
}
