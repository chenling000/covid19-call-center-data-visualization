import { css, Theme } from "@emotion/react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PieChartIcon from "@mui/icons-material/PieChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { FC, ReactElement } from "react";
import { useLocation, Location, Link } from "react-router-dom";

import useMedia from "../Hooks/useMedia";
import { ROUTE_PATH } from "../RoutePath";

const styles = {
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
  drawerIcon: css`
    min-width: 0;
    margin-right: 1rem;
    color: "#ffffff";
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

interface AppDrawerProps {
  isDrawerOpen: boolean;
}

const AppDrawer: FC<AppDrawerProps> = ({ isDrawerOpen }) => {
  const location = useLocation();
  const { isWideScreen } = useMedia();

  return (
    <Drawer
      variant={isWideScreen ? "permanent" : "temporary"}
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
  );
};

export default AppDrawer;
