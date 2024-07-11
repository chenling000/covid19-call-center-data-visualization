import { css } from "@emotion/react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { FC, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../Hooks/reduxHooks";
import useMedia from "../Hooks/useMedia";
import { setEndDate, setStartDate } from "../redux-modules/datePickerSlice";
import { setMode } from "../redux-modules/displayModeSlice";
import { yearList } from "../types/date";
import { Mode, displayMode } from "../types/display-mode";

import YearMonthPicker from "./YearMonthPicker";

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
};

const YearPicker = ({ startDate }: { startDate: Date }) => {
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

export const DatePicker: FC = () => {
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

export default DatePicker;
