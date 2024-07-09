/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";

export const modeKeys = ["YEAR", "YEAR_MONTH", "YEAR_MONTH_DAY"] as const;

export type Mode = (typeof modeKeys)[number];

export const displayMode: Record<Mode, string> = {
  YEAR: "年を指定して月毎",
  YEAR_MONTH: "年月を指定して日毎",
  YEAR_MONTH_DAY: "年月を指定して曜日毎",
} as const;

interface DisplayModeSlice {
  mode: Mode;
}

const initialState: DisplayModeSlice = {
  mode: modeKeys[0],
};

export const displayModeSlice = createSlice({
  name: "displayMode",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = displayModeSlice.actions;

export const selectDisplayMode = (state: RootState) => state.displayMode.mode;

export const displayModeReducer = displayModeSlice.reducer;
