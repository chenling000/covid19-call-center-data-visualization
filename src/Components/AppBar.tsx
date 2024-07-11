import { css, Theme } from "@emotion/react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuIcon from "@mui/icons-material/Menu";
import PieChartIcon from "@mui/icons-material/PieChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import {
  Box,
  CssBaseline,
  Toolbar,
  AppBar as MUIAppBar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  ListItemButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { FC, ReactElement, ReactNode, useEffect, useState } from "react";
import { Link, useLocation, Location } from "react-router-dom";

import useMedia from "../Hooks/useMedia";
import { ROUTE_PATH } from "../RoutePath";

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
    margin-right: 1rem;
  `,
  drawerIcon: css`
    min-width: 0;
    margin-right: 1rem;
    color: "#ffffff";
  `,
  drawerBox: css`
    overflow: auto;
    padding: 0 0.5rem;
  `,
  drawerWidth: {
    wide: 200,
    narrow: 70,
  },
  drawerListItem: (theme: Theme, path: string, location: Location) => css`
    background-color: ${path === location.pathname ? theme.drawer.activeColor : "Background"};
    border-radius: 0.5rem;
  `,
  drawerLink: (theme: Theme) => css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    color: ${theme.palette.text.primary};
    text-decoration-line: none;
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

type DrawerListItem<K extends keyof typeof ROUTE_PATH> = {
  text: string;
  icon: ReactElement;
  path: (typeof ROUTE_PATH)[K];
};

const drawerListItems: { [K in keyof typeof ROUTE_PATH]: DrawerListItem<K> } = {
  home: {
    text: "カレンダー",
    icon: <CalendarMonthIcon />,
    path: ROUTE_PATH.home,
  },
  lineChart: {
    text: "折れ線グラフ",
    icon: <TimelineIcon />,
    path: ROUTE_PATH.lineChart,
  },
  pieChart: {
    text: "円グラフ",
    icon: <PieChartIcon />,
    path: ROUTE_PATH.pieChart,
  },
};

interface AppBarProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  children: ReactNode;
}

const AppBar: FC<AppBarProps> = ({ children, isLoading, isError, error }) => {
  const location = useLocation();
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
          <Typography variant="h6" noWrap component="div" onClick={() => setIsAlertOpen(true)}>
            新型コロナコールセンター相談件数
          </Typography>
        </Toolbar>
      </MUIAppBar>
      <Drawer
        variant={isDrawerOpen ? "permanent" : "temporary"}
        open={isDrawerOpen}
        sx={{
          width: isWideScreen ? styles.drawerWidth.wide : styles.drawerWidth.narrow,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isWideScreen ? styles.drawerWidth.wide : styles.drawerWidth.narrow,
            boxSizing: "border-box",
          },
        }}
        PaperProps={{ elevation: 1 }}
      >
        <Toolbar />
        <Box css={styles.drawerBox}>
          <List>
            {Object.values(drawerListItems).map(({ text, icon, path }) => (
              <ListItem
                key={text}
                disablePadding
                css={(theme) => styles.drawerListItem(theme, path, location)}
              >
                <ListItemButton>
                  <Link to={path} css={styles.drawerLink}>
                    <ListItemIcon css={styles.drawerIcon}>{icon}</ListItemIcon>
                    {isWideScreen && <ListItemText primary={text} />}
                  </Link>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
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
