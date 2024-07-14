import { configureStore } from "@reduxjs/toolkit";
import FormSlice from "./formSlice/FormSlice";
import UserSlice from "./userSlice/userSlice";

export const store = configureStore({
  reducer: {
    data: FormSlice,
    user: UserSlice,
  },
});
