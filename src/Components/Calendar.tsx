import { Theme } from "@emotion/react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  css,
  IconButton,
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
import { jaDayOfWeekList } from "../types/date";

import { YearMonthPicker } from "./DatePicker";

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
    height: 5rem;
    border: 1px solid ${theme.palette.grey[500]};
  `,
};

const getDateColor = (date: Date, displayedMonth: number) => {
  if (getMonth(date) !== displayedMonth) return defaultTheme.palette.grey[200];
  if (getDay(date) === 0) return defaultTheme.palette.primary.main;
  return undefined;
};

const getCalendarArray = (date: Date) => {
  const sundays = eachWeekOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
  return sundays.map((sunday) => eachDayOfInterval({ start: sunday, end: endOfWeek(sunday) }));
};

interface CalendarProps {
  isWideScreen: boolean;
}

const Calendar: FC<CalendarProps> = ({ isWideScreen }) => {
  const targetDate = useAppSelector((state) => state.datePicker.startDate);
  const calendar = getCalendarArray(targetDate);
  const displayedMonth = useMemo(() => getMonth(targetDate), [targetDate]);
  const dispatch = useAppDispatch();

  const cos = () => {
    console.log("min:", minDate);
    console.log("target:", targetDate);
    console.log("max:", maxDate);
  };

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

    cos();
  };

  return (
    <Box css={() => styles.calendarBox(isWideScreen)}>
      <Box css={styles.calendarButtonBox}>
        <YearMonthPicker startDate={targetDate} />
        <Box>
          <IconButton
            size="large"
            onClick={() => setDisplayedMonth("BACK")}
            disabled={targetDate < minDate}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton
            size="large"
            onClick={() => setDisplayedMonth("NEXT")}
            disabled={targetDate > new Date(maxDate.getFullYear(), maxDate.getMonth() - 1)}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
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
                <TableCell align="center" padding="none">
                  <Box css={[styles.cellBase, styles.headBox]}>
                    <Typography color={index === 0 ? "tomato" : undefined}>{day}</Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {calendar.map((weekRow) => (
              <TableRow key={`${weekRow[0]}`}>
                {weekRow.map((date) => (
                  <TableCell padding="none">
                    <Box css={[styles.cellBase, styles.dateBox]}>
                      <Typography color={getDateColor(date, displayedMonth)}>
                        {getDate(date)}
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
