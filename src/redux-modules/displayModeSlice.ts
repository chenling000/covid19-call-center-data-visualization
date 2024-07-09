/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Mode, modeKeys } from "../types/display-mode";

import type { RootState } from "../store";

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
