// src/redux/patrouilleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get all patrols
export const fetchPatrouilles = createAsyncThunk(
  'patrouille/fetchPatrouilles',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('http://localhost:5000/pat/');
      return response.data.respond;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Initial state
const initialState = {
  patrouilles: [],
  loading: false,
  error: null,
};

const patrouilleSlice = createSlice({
  name: 'patrouille',
  initialState,
  reducers: {
    // Add if you want local mutations later
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatrouilles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatrouilles.fulfilled, (state, action) => {
        state.loading = false;
        state.patrouilles = action.payload;
      })
      .addCase(fetchPatrouilles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching patrouille data';
      });
  },
});

export default patrouilleSlice.reducer;
