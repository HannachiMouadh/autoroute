import { configureStore } from "@reduxjs/toolkit";
import FormSlice from "./formSlice/FormSlice";
import UserSlice from "./userSlice/userSlice";
import EntretientSlice from "./entretientSlice/EntretientSlice";
import patrouilleReducer from './patrouilleSlice/PatrouilleSlice';
import matriculeReducer from './matriculePatrouilleSlice/MatriculePatrouilleSlice';

export const store = configureStore({
  reducer: {
    data: FormSlice,
    user: UserSlice,
    entData : EntretientSlice,
    patrouille: patrouilleReducer,
    matricule: matriculeReducer
  },
});
