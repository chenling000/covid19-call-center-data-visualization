import { css } from "@emotion/react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { FC, useEffect, useState } from "react";

import { maxDate, minDate, yearList } from "../types/date";

const styles = {
  selectArea: css`
    display: flex;
    flex-direction: row;
    > * + * {
      margin-left: 2rem;
    }
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
};

const modeKeys = ["YEAR", "YEAR_MONTH", "YEAR_MONTH_DAY"] as const;
type Mode = (typeof modeKeys)[number];

const mode: Record<Mode, string> = {
  YEAR: "年を指定して月毎",
  YEAR_MONTH: "年月を指定して日毎",
  YEAR_MONTH_DAY: "年月を指定して曜日毎",
} as const;

const DateRangePicker: FC = () => {
  const [selectedMode, setSelectedMode] = useState<Mode>(modeKeys[0]);
  const [startDate, setStartDate] = useState<Date>(minDate);
  const [endDate, setEndDate] = useState<Date>(maxDate);
  const [startYear, setStartYear] = useState<number>(yearList[0]);
  const [endYear, setEndYear] = useState<number>(yearList[2]);

  console.log({
    selectedMode,
    startDate,
    endDate,
  });

  useEffect(() => {
    setStartDate(new Date(startYear, 0, 1));
  }, [startYear]);

  useEffect(() => {
    setEndDate(new Date(endYear, 11, 31));
  }, [endYear]);

  return (
    <Box css={styles.selectArea}>
      <FormControl>
        <InputLabel id="mode-select">表示内容</InputLabel>
        <Select
          labelId="mode-select"
          id="mode-select"
          css={styles.modeSelect}
          value={selectedMode}
          label="表示内容"
          onChange={(e) => setSelectedMode(e.target.value as Mode)}
        >
          {Object.entries(mode).map(([key, value]) => (
            <MenuItem value={key}>{value}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box css={styles.selectRangeBox}>
        {selectedMode === "YEAR" && (
          <>
            <FormControl>
              <InputLabel id="start-year">開始年</InputLabel>
              <Select
                labelId="start-year"
                id="start-year"
                value={startYear}
                label="開始年"
                onChange={(e) => setStartYear(Number(e.target.value))}
              >
                {yearList.map((year) => (
                  <MenuItem value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="end-year">終了年</InputLabel>
              <Select
                labelId="end-year"
                id="end-year"
                value={endYear}
                label="終了年"
                onChange={(e) => setEndYear(Number(e.target.value))}
              >
                {yearList.map((year) => (
                  <MenuItem value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        {(selectedMode === "YEAR_MONTH" || selectedMode === "YEAR_MONTH_DAY") && (
          <>
            <DatePicker
              minDate={minDate}
              maxDate={maxDate}
              label="開始年月"
              views={["year", "month"]}
              format="yyyy/MM"
              css={styles.yearMonthSelect}
              value={startDate}
              onChange={(d) => d && setStartDate(d)}
            />
            <DatePicker
              minDate={minDate}
              maxDate={maxDate}
              label="終了年月"
              views={["year", "month"]}
              format="yyyy/MM"
              css={styles.yearMonthSelect}
              value={endDate}
              onChange={(d) => d && setEndDate(d)}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default DateRangePicker;
