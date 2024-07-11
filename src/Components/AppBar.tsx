import { css, Theme } from "@emotion/react";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  CssBaseline,
  Toolbar,
  AppBar as MUIAppBar,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { FC, ReactNode, useEffect, useState } from "react";

import useMedia from "../Hooks/useMedia";

import AppDrawer from "./AppDrawer";

const styles = {
  appBox: css`
    display: flex;
    height: 100vh;
    width: 100vw;
  `,
  appBar: (theme: Theme) => css`
    background: ${theme.appBar.background};
    color: ${theme.appBar.text};
    z-index: ${theme.zIndex.drawer + 1};
  `,
  menuIcon: (theme: Theme) => css`
    color: ${theme.appBar.text};
  `,
  mainBox: css`
    flex-grow: 1;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
  `,
  loadingBox: (theme: Theme) => css`
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: ${theme.zIndex.drawer - 1};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: rgba(0, 0, 0, 0.1);
    > * {
      padding-top: 7rem;
    }
  `,
};

interface AppBarProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  children: ReactNode;
}

const AppBar: FC<AppBarProps> = ({ children, isLoading, isError, error }) => {
  const { isWideScreen } = useMedia();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(isWideScreen);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setIsAlertOpen(false);
  };

  useEffect(() => {
    setIsDrawerOpen(isWideScreen);
  }, [isWideScreen]);

  useEffect(() => {
    if (isError) {
      setIsAlertOpen(true);
    }
  }, [isError]);

  return (
    <Box css={styles.appBox}>
      <CssBaseline />
      <MUIAppBar position="fixed" css={styles.appBar}>
        <Toolbar>
          {!isWideScreen && (
            <IconButton onClick={() => setIsDrawerOpen(!isDrawerOpen)} css={styles.menuIcon}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant={isWideScreen ? "h6" : "body1"} noWrap component="div">
            新型コロナコールセンター相談件数
          </Typography>
        </Toolbar>
      </MUIAppBar>
      <AppDrawer isDrawerOpen={isDrawerOpen} />
      {isLoading && (
        <Box css={styles.loadingBox}>
          <Box>
            <CircularProgress />
          </Box>
        </Box>
      )}
      <Box component="main" css={styles.mainBox}>
        <Toolbar />
        {children}
      </Box>
      <Snackbar open={isAlertOpen} autoHideDuration={10000} onClose={handleCloseAlert}>
        <Alert severity="error" variant="filled" onClose={handleCloseAlert}>
          {`${error}`}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppBar;
