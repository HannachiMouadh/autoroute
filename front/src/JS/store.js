import { configureStore } from "@reduxjs/toolkit";
import FormSlice from "./formSlice/FormSlice";
import UserSlice from "./userSlice/userSlice";
import EntretientSlice from "./entretientSlice/EntretientSlice";
import patrouilleReducer from './patrouilleSlice/PatrouilleSlice';

export const store = configureStore({
  reducer: {
    data: FormSlice,
    user: UserSlice,
    entData : EntretientSlice,
    patrouille: patrouilleReducer,
  },
});
