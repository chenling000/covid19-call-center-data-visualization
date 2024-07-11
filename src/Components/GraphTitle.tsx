import { Typography } from "@mui/material";

import { defaultTheme } from "../theme/default";

const GraphTitle = ({ isWideScreen }: { isWideScreen: boolean }) => (
  <Typography
    alignSelf="center"
    color={defaultTheme.palette.text.secondary}
    variant={isWideScreen ? "body1" : "body2"}
  >
    東京都新型コロナコールセンター相談件数
  </Typography>
);

export default GraphTitle;
