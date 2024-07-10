/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { maxDate, minDate } from "../types/date";

import type { RootState } from "../store";

interface DatePickerState {
  startDate: Date;
  endDate: Date;
}

const initialState: DatePickerState = {
  startDate: minDate,
  endDate: maxDate,
};

export const datePickerSlice = createSlice({
  name: "datePicker",
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

export const { setStartDate, setEndDate } = datePickerSlice.actions;

export const selectDatePicker = (state: RootState) => state.datePicker;

export const datePickerReducer = datePickerSlice.reducer;
