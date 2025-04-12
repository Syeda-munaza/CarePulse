import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPatient: {},
  loading: false,
  error: false,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    basicDataStart: (state) => {
      state.loading = true;
    },
    basicDataSuccess: (state, action) => {
      state.currentPatient = action.payload;
      state.loading = false;
      state.error = false;
    },
    basicDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    basicDataRemove: (state) => {
      state.loading = false;
      state.currentPatient = null;
    },
  },
});
export const {
  basicDataStart,
  basicDataSuccess,
  basicDataFailure,
  basicDataRemove,
} = patientSlice.actions;
export default patientSlice.reducer;
