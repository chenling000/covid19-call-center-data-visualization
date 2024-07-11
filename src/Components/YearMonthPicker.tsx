import { css } from "@emotion/react";
import { DatePicker as MUIDatePicker } from "@mui/x-date-pickers";

import { useAppDispatch } from "../Hooks/reduxHooks";
import { maxDate, minDate, setEndDate, setStartDate } from "../redux-modules/datePickerSlice";

const YearMonthPicker = ({ startDate }: { startDate: Date }) => {
  const dispatch = useAppDispatch();

  const setDateValue = (date: Date) => {
    dispatch(setStartDate(new Date(date.getFullYear(), date.getMonth(), 1)));
    dispatch(setEndDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)));
  };

  return (
    <MUIDatePicker
      minDate={minDate}
      maxDate={maxDate}
      label="年/月"
      views={["year", "month"]}
      format="yyyy/MM"
      css={css`
        width: 8rem;
      `}
      value={startDate}
      onAccept={(d) => d && setDateValue(d)}
    />
  );
};

export default YearMonthPicker;
