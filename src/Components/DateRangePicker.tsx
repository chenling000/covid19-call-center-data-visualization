import { css, Theme } from "@emotion/react";
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { FC, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../Hooks/reduxHooks";
import useMedia from "../Hooks/useMedia";
import { setEndDate, setStartDate } from "../redux-modules/dateRangePickerSlice";
import { setMode } from "../redux-modules/displayModeSlice";
import { defaultTheme } from "../theme/default";
import { yearList } from "../types/date";
import { Mode, displayMode } from "../types/display-mode";

const styles = {
  selectArea: (isWideScreen: boolean) => css`
    display: flex;
    flex-direction: ${isWideScreen ? "row" : "column"};
    > * + * {
      margin-left: ${isWideScreen ? "1rem" : 0};
      margin-top: ${isWideScreen ? 0 : "1rem"};
    }
  `,
  selectRangeArea: css`
    height: 4rem;
  `,
  selectRangeBox: css`
    display: flex;
    flex-direction: row;
  `,
  modeSelect: css`
    width: 13rem;
  `,
  yearSelect: css`
    width: 6.5rem;
  `,
  yearMonthSelect: css`
    width: 8rem;
  `,
  rangeErrorHelpText: (theme: Theme) => css`
    color: ${theme.palette.error.main};
  `,
};

interface YearPickerProps {
  id: string;
  label: string;
  dateValue: Date;
  setDateValue: ActionCreatorWithPayload<
    Date,
    "dateRangePicker/setStartDate" | "dateRangePicker/setEndDate"
  >;
  isError: boolean;
}
const YearPicker: FC<YearPickerProps> = ({ id, label, dateValue, setDateValue, isError }) => {
  const dispatch = useAppDispatch();
  const [yearValue, setYearValue] = useState<number>(dateValue.getFullYear());

  useEffect(() => {
    dispatch(setDateValue(new Date(yearValue, 0, 1)));
  }, [dispatch, setDateValue, yearValue]);

  return (
    <FormControl>
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        labelId={id}
        id={id}
        value={yearValue}
        label={label}
        onChange={(e) => setYearValue(Number(e.target.value))}
        error={isError}
      >
        {yearList.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

interface YearMonthPickerProps {
  label: string;
  dateValue: Date;
  setDateValue: ActionCreatorWithPayload<
    Date,
    "dateRangePicker/setStartDate" | "dateRangePicker/setEndDate"
  >;
  isError: boolean;
}
const YearMonthPicker: FC<YearMonthPickerProps> = ({ label, dateValue, setDateValue, isError }) => {
  const { startDate, endDate } = useAppSelector((state) => state.dateRangePicker);
  const dispatch = useAppDispatch();

  return (
    <DatePicker
      minDate={startDate}
      maxDate={endDate}
      label={label}
      views={["year", "month"]}
      format="yyyy/MM"
      css={styles.yearMonthSelect}
      value={dateValue}
      onChange={(d) => d && dispatch(setDateValue(d))}
      sx={{
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
          border: `1px solid ${isError ? defaultTheme.palette.error.main : defaultTheme.palette.grey[400]}`,
        }, // at page load
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          border: `1px solid ${isError ? defaultTheme.palette.error.main : defaultTheme.palette.grey[900]}`,
        }, // at hover state
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: `2px solid ${isError ? defaultTheme.palette.error.main : defaultTheme.palette.primary.main}`,
        }, // at focused state
      }}
    />
  );
};

const DateRangePicker: FC = () => {
  const { isWideScreen } = useMedia();
  const mode = useAppSelector((state) => state.displayMode.mode);
  const { startDate, endDate } = useAppSelector((state) => state.dateRangePicker);
  const dispatch = useAppDispatch();
  const [isRangeError, setIsRangeError] = useState<boolean>(false);

  console.log({
    mode,
    startDate,
    endDate,
  });

  useEffect(() => {
    if (startDate > endDate) {
      setIsRangeError(true);
    } else {
      setIsRangeError(false);
    }
  }, [startDate, endDate]);

  return (
    <Box css={() => styles.selectArea(isWideScreen)}>
      <Box>
        <FormControl>
          <InputLabel id="mode-select">表示内容</InputLabel>
          <Select
            labelId="mode-select"
            id="mode-select"
            css={styles.modeSelect}
            value={mode}
            label="表示内容"
            onChange={(e) => dispatch(setMode(e.target.value as Mode))}
          >
            {Object.entries(displayMode).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box css={styles.selectRangeArea}>
        <Box css={styles.selectRangeBox}>
          {mode === "YEAR" && (
            <>
              <YearPicker
                id="start-year"
                label="開始年"
                dateValue={startDate}
                setDateValue={setStartDate}
                isError={isRangeError}
              />
              <YearPicker
                id="end-year"
                label="終了年"
                dateValue={endDate}
                setDateValue={setEndDate}
                isError={isRangeError}
              />
            </>
          )}
          {(mode === "YEAR_MONTH" || mode === "YEAR_MONTH_DAY") && (
            <>
              <YearMonthPicker
                label="開始年月"
                dateValue={startDate}
                setDateValue={setStartDate}
                isError={isRangeError}
              />
              <YearMonthPicker
                label="終了年月"
                dateValue={endDate}
                setDateValue={setEndDate}
                isError={isRangeError}
              />
            </>
          )}
        </Box>
        {isRangeError && (
          <Typography variant="caption" css={styles.rangeErrorHelpText}>
            開始年月は終了年月より前の日を入力してください
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DateRangePicker;
