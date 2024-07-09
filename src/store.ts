import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { displayModeReducer, displayModeSlice } from "./redux-modules/displayModeSlice";

const rootReducer = combineReducers({ [displayModeSlice.name]: displayModeReducer });

export const store = configureStore({
  reducer: rootReducer,
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];