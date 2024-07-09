import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { dateRangePickerReducer, dateRangePickerSlice } from "./redux-modules/dateRangePickerSlice";
import { displayModeReducer, displayModeSlice } from "./redux-modules/displayModeSlice";

const rootReducer = combineReducers({
  [displayModeSlice.name]: displayModeReducer,
  [dateRangePickerSlice.name]: dateRangePickerReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["dateRangePicker.startDate", "dateRangePicker.endDate"],
        ignoredActionPaths: ["payload"],
      },
    }),
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
