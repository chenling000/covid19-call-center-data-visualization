import { css } from "@emotion/react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { FC, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../Hooks/reduxHooks";
import useMedia from "../Hooks/useMedia";
import { setEndDate, setStartDate } from "../redux-modules/datePickerSlice";
import { setMode } from "../redux-modules/displayModeSlice";
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
  modeSelect: css`
    width: 13rem;
  `,
  yearMonthSelect: css`
    width: 8rem;
  `,
};

interface YearPickerProps {
  startDate: Date;
}
const YearPicker: FC<YearPickerProps> = ({ startDate }) => {
  const [yearValue, setYearValue] = useState<number>(startDate.getFullYear());
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setStartDate(new Date(yearValue, 0, 1)));
    dispatch(setEndDate(new Date(yearValue, 11, 31)));
  }, [dispatch, yearValue]);

  return (
    <FormControl>
      <InputLabel id="year-select">年</InputLabel>
      <Select
        labelId="year-select"
        id="year-select"
        value={yearValue}
        label="年"
        onChange={(e) => setYearValue(Number(e.target.value))}
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
  startDate: Date;
}
const YearMonthPicker: FC<YearMonthPickerProps> = ({ startDate }) => {
  const [dateValue, setDateValue] = useState<Date>(startDate);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setStartDate(new Date(dateValue.getFullYear(), dateValue.getMonth(), 1)));
    dispatch(setEndDate(new Date(dateValue.getFullYear(), dateValue.getMonth() + 1, 0)));
  }, [dateValue, dispatch]);

  return (
    <DatePicker
      minDate={minDate}
      maxDate={maxDate}
      label="年/月"
      views={["year", "month"]}
      format="yyyy/MM"
      css={styles.yearMonthSelect}
      value={dateValue}
      onAccept={(d) => d && setDateValue(d)}
    />
  );
};

const DateRangePicker: FC = () => {
  const { isWideScreen } = useMedia();
  const mode = useAppSelector((state) => state.displayMode.mode);
  const { startDate } = useAppSelector((state) => state.datePicker);
  const dispatch = useAppDispatch();

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
      <Box>
        {mode === "YEAR" && <YearPicker startDate={startDate} />}
        {(mode === "YEAR_MONTH" || mode === "YEAR_MONTH_DAY") && (
          <YearMonthPicker startDate={startDate} />
        )}
      </Box>
    </Box>
  );
};

export default DateRangePicker;
