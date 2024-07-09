/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { maxDate, minDate } from "../types/date";

import type { RootState } from "../store";

interface DateRangePickerState {
  startDate: Date;
  endDate: Date;
}

const initialState: DateRangePickerState = {
  startDate: minDate,
  endDate: maxDate,
};

export const dateRangePickerSlice = createSlice({
  name: "dateRangePicker",
  initialState,
  reducers: {
    setStartDate: (state, action: PayloadAction<Date>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<Date>) => {
      state.endDate = action.payload;
    },
  },
});

export const { setStartDate, setEndDate } = dateRangePickerSlice.actions;

export const selectDateRangePicker = (state: RootState) => state.dateRangePicker;

export const dateRangePickerReducer = dateRangePickerSlice.reducer;
