import type { Theme as MUITheme } from "@mui/material/styles";

// make emotion to inherent mui-theme instance
declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends MUITheme {}
}
