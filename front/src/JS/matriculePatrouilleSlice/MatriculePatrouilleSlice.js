// src/redux/patrouilleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get all patrols
export const fetchMatricule = createAsyncThunk(
  "patrouille/fetchMatricule",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:5000/matPat/");
      return response.data.respond;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Add form action
export const addMatriculeData = createAsyncThunk("data/add", async (newData) => {
  try {
    const response = await axios.post("http://localhost:5000/matPat/", newData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding form pat:", error);
    throw error;
  }
});


// Delete form action
export const deleteMatriculeData = createAsyncThunk('data/delete', async (id) => {
  try {
    await axios.delete(`http://localhost:5000/matPat/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting form:', error);
    throw error;
  }
});

// Update form action
export const updateMatriculeData = createAsyncThunk(
  'form/update',
  async ({ id, matriculeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/matPat/${id}`, matriculeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.matriculeData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Initial state
const initialState = {
  matricules: [],
  loading: false,
  error: null,
};

const MatriculePatrouilleSlice = createSlice({
  name: "matricule",
  initialState,
  reducers: {
    // Add if you want local mutations later
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatricule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatricule.fulfilled, (state, action) => {
        state.loading = false;
        state.matricules = action.payload;
      })
      .addCase(fetchMatricule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching patrouille data";
      })
      .addCase(addMatriculeData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addMatriculeData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.matricules.push(action.payload);
      })
      .addCase(addMatriculeData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteMatriculeData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMatriculeData.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.matricules = state.matricules.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteMatriculeData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateMatriculeData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMatriculeData.fulfilled, (state, action) => {
        state.status = action.payload;
        console.log(action.payload);
        state.status = "succeeded";
      })
      .addCase(updateMatriculeData.rejected, (state, action) => {
        state.status = "failed";
        try {
          const errorMessage = JSON.parse(action.error.message);
          state.error = errorMessage;
        } catch (error) {
          // If not valid JSON, use the error message as is
          state.error = action.error.message;
        }
      });
  },
});

export default MatriculePatrouilleSlice.reducer;
