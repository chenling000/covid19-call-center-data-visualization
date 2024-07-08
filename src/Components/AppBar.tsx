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
} from "@mui/material";
import { FC, ReactElement, ReactNode, useState } from "react";
import { Link, useLocation, Location } from "react-router-dom";

import { ROUTE_PATH } from "../RoutePath";

const drawerWidth = 200;

const styles = {
  appBar: (theme: Theme) => css`
    background: ${theme.appBar.background};
    color: ${theme.appBar.text};
    z-index: ${theme.zIndex.drawer + 1};
  `,
  menuIcon: (theme: Theme) => css`
    color: ${theme.appBar.text};
    margin-right: 1rem;
  `,
  appBox: css`
    display: flex;
  `,
  // drawer: css`
  //   width: ${drawerWidth};
  //   flex-shrink: 0;
  //   & .MuiDrawer-paper {
  //     width: ${drawerWidth};
  //     box-sizing: "border-box";
  //   }
  // `,
  drawerIcon: css`
    min-width: 0;
    margin-right: 1rem;
    color: "#ffffff";
  `,
  drawerBox: css`
    overflow: auto;
    padding: 0 0.5rem;
  `,
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
    padding: 1rem;
    display: flex;
    flex-direction: column;
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
  children: ReactNode;
}

const AppBar: FC<AppBarProps> = ({ children }) => {
  const [isDrawerExpand, setIsDrawerExpand] = useState<boolean>(true);
  const location = useLocation();

  return (
    <Box css={styles.appBox}>
      <CssBaseline />
      <MUIAppBar position="fixed" css={styles.appBar}>
        <Toolbar>
          <IconButton onClick={() => setIsDrawerExpand(!isDrawerExpand)} css={styles.menuIcon}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            新型コロナコールセンター相談件数
          </Typography>
        </Toolbar>
      </MUIAppBar>
      <Drawer
        variant={isDrawerExpand ? "permanent" : "temporary"}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
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
                    <ListItemText primary={text} />
                  </Link>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" css={styles.mainBox}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AppBar;
