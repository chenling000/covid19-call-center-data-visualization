import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { datePickerReducer, datePickerSlice } from "./redux-modules/datePickerSlice";
import { displayModeReducer, displayModeSlice } from "./redux-modules/displayModeSlice";

const rootReducer = combineReducers({
  [displayModeSlice.name]: displayModeReducer,
  [datePickerSlice.name]: datePickerReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["datePicker.startDate", "datePicker.endDate"],
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
