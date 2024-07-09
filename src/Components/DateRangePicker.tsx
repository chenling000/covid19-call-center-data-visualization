import { css, Theme } from "@emotion/react";
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { FC, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../Hooks/reduxHooks";
import useMedia from "../Hooks/useMedia";
import { setMode } from "../redux-modules/displayModeSlice";
import { defaultTheme } from "../theme/default";
import { maxDate, minDate, yearList } from "../types/date";
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
  yearValue: number;
  setYearValue: (value: React.SetStateAction<number>) => void;
  isError: boolean;
}
const YearPicker: FC<YearPickerProps> = ({ id, label, yearValue, setYearValue, isError }) => (
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

interface YearMonthPickerProps {
  label: string;
  dateValue: Date;
  setDateValue: (value: React.SetStateAction<Date>) => void;
  isError: boolean;
}
const YearMonthPicker: FC<YearMonthPickerProps> = ({ label, dateValue, setDateValue, isError }) => (
  <DatePicker
    minDate={minDate}
    maxDate={maxDate}
    label={label}
    views={["year", "month"]}
    format="yyyy/MM"
    css={styles.yearMonthSelect}
    value={dateValue}
    onChange={(d) => d && setDateValue(d)}
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

const DateRangePicker: FC = () => {
  const { isWideScreen } = useMedia();
  const mode = useAppSelector((state) => state.displayMode.mode);
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState<Date>(minDate);
  const [endDate, setEndDate] = useState<Date>(maxDate);
  const [startYear, setStartYear] = useState<number>(yearList[0]);
  const [endYear, setEndYear] = useState<number>(yearList[2]);
  const [isRangeError, setIsRangeError] = useState<boolean>(false);

  console.log({
    mode,
    startDate,
    endDate,
  });

  useEffect(() => {
    setStartDate(new Date(startYear, 0, 1));
  }, [startYear]);

  useEffect(() => {
    setEndDate(new Date(endYear, 11, 31));
  }, [endYear]);

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
                yearValue={startYear}
                setYearValue={setStartYear}
                isError={isRangeError}
              />
              <YearPicker
                id="end-year"
                label="終了年"
                yearValue={endYear}
                setYearValue={setEndYear}
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
