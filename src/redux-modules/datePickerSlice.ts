/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";

export const minDate = new Date("2020-01-01T00:00:00.000Z");
export const maxDate = new Date("2022-12-31T00:00:00.000Z");

interface DatePickerState {
  startDate: Date;
  endDate: Date;
}

const initialState: DatePickerState = {
  startDate: new Date(maxDate.getFullYear(), 0, 1),
  endDate: new Date(maxDate.getFullYear(), 11, 31),
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
