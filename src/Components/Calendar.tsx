import { Theme } from "@emotion/react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  css,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  getDate,
  getDay,
  getMonth,
  startOfMonth,
} from "date-fns";
import { FC, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "../Hooks/reduxHooks";
import { maxDate, minDate, setEndDate, setStartDate } from "../redux-modules/datePickerSlice";
import { defaultTheme } from "../theme/default";
import { DataItem } from "../types/api";
import { jaDayOfWeekList } from "../types/date";

import { YearMonthPicker } from "./DatePicker";
import TooltipIconButton from "./TooltipIconButton";

const styles = {
  calendarBox: (isWideScreen: boolean) => css`
    height: 100%;
    width: 100%;
    padding: ${isWideScreen ? "0 5rem" : "0"};
    display: flex;
    flex-direction: column;
    > * + * {
      margin-top: 1rem;
    },
    `,
  calendarButtonBox: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `,
  cellBase: css`
    padding: 0.5rem;
    margin: 2px;
  `,
  headBox: (theme: Theme) => css`
    background-color: ${theme.palette.grey[200]};
  `,
  dateBox: (theme: Theme) => css`
    height: 4.5rem;
    border: 1px solid ${theme.palette.grey[500]};
  `,
};

const getDateColor = (date: Date, displayedMonth: number) => {
  if (getMonth(date) !== displayedMonth) return defaultTheme.palette.grey[200];
  if (getDay(date) === 0) return defaultTheme.palette.primary.main;
  return defaultTheme.palette.text.secondary;
};

const getCalendarArray = (date: Date, data: DataItem[]) => {
  const sundays = eachWeekOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });

  const calendarArray: { date: Date; count?: number }[][] = sundays.map((sunday) =>
    eachDayOfInterval({ start: sunday, end: endOfWeek(sunday) }).map((d) => ({ date: d }))
  );
  if (data.length < 1) return calendarArray;

  const targetMonth = getMonth(date);
  let index = 0;
  for (let i = 0; i < calendarArray.length; i += 1) {
    for (let j = 0; j < calendarArray[i].length; j += 1) {
      const d = calendarArray[i][j].date;
      if (getMonth(d) === targetMonth) {
        if (data[index]) {
          calendarArray[i][j] = { date: d, count: data[index].count };
          index += 1;
        }
      }
    }
  }
  return calendarArray;
};

interface CalendarProps {
  isWideScreen: boolean;
  data: DataItem[];
}

const Calendar: FC<CalendarProps> = ({ isWideScreen, data }) => {
  const targetDate = useAppSelector((state) => state.datePicker.startDate);
  const calendar = getCalendarArray(targetDate, data);
  const displayedMonth = useMemo(() => getMonth(targetDate), [targetDate]);
  const dispatch = useAppDispatch();

  const setDisplayedMonth = (action: "BACK" | "NEXT") => {
    switch (action) {
      case "BACK": {
        dispatch(setStartDate(new Date(targetDate.getFullYear(), targetDate.getMonth() - 1, 1)));
        dispatch(setEndDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 0)));
        break;
      }
      case "NEXT": {
        dispatch(setStartDate(new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1)));
        dispatch(setEndDate(new Date(targetDate.getFullYear(), targetDate.getMonth() + 2, 0)));
        break;
      }
      default:
        break;
    }
  };

  return (
    <Box css={() => styles.calendarBox(isWideScreen)}>
      <Box css={styles.calendarButtonBox}>
        <YearMonthPicker startDate={targetDate} />
        <Box>
          <TooltipIconButton
            tooltipText="前の月へ"
            onClick={() => setDisplayedMonth("BACK")}
            disabled={targetDate < minDate}
            icon={<NavigateBeforeIcon />}
          />
          <TooltipIconButton
            tooltipText="次の月へ"
            onClick={() => setDisplayedMonth("NEXT")}
            disabled={targetDate > new Date(maxDate.getFullYear(), maxDate.getMonth() - 1)}
            icon={<NavigateNextIcon />}
          />
        </Box>
      </Box>
      <Box>
        <Typography
          align="center"
          color={defaultTheme.palette.text.secondary}
          variant={isWideScreen ? "body1" : "body2"}
        >
          東京都新型コロナコールセンター相談件数
        </Typography>
      </Box>
      <TableContainer>
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none",
            },
          }}
        >
          <TableHead>
            <TableRow>
              {jaDayOfWeekList.map((day, index) => (
                <TableCell key={day} align="center" padding="none">
                  <Box css={[styles.cellBase, styles.headBox]}>
                    <Typography
                      color={
                        index === 0
                          ? defaultTheme.palette.primary.main
                          : defaultTheme.palette.text.secondary
                      }
                    >
                      {day}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {calendar.map((weekRow) => (
              <TableRow key={weekRow[0].date.toISOString()}>
                {weekRow.map(({ date, count }) => (
                  <TableCell key={date.toISOString()} padding="none">
                    <Box css={[styles.cellBase, styles.dateBox]}>
                      <Typography color={getDateColor(date, displayedMonth)} variant="subtitle2">
                        {getDate(date)}
                      </Typography>
                      <Typography align="center" minWidth="3rem">
                        {count ? `${count}件` : ""}
                      </Typography>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Calendar;
