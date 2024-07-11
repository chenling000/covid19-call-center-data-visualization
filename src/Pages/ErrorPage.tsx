import { css } from "@emotion/react";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { Box, Typography } from "@mui/material";

const ErrorPage: React.FC = () => (
  <Box>
    <Typography variant="h2">Oops!</Typography>
    <Box
      css={css`
        display: flex;
        flex-direction: row;
        align-items: center;
      `}
    >
      <Typography variant="h6">Sorry, we don&apos;t have this page.</Typography>
      <SentimentVeryDissatisfiedIcon />
    </Box>
    <Typography variant="h6">Please check your URL!</Typography>
  </Box>
);

export default ErrorPage;
