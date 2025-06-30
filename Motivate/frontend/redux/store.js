import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import taskReducer from "./slice/taskSlices"
import entryReducer from "./slice/entrySlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks:taskReducer,
    entry:entryReducer,
  },
});
