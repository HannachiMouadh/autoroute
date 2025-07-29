// src/redux/patrouilleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get all patrols
export const fetchPatrouilles = createAsyncThunk(
  "patrouille/fetchPatrouilles",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("https://autoroute-api.vercel.app/pat/");
      return response.data.respond;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Add form action
export const addPatData = createAsyncThunk("data/add", async (newData) => {
  try {
    const response = await axios.post("https://autoroute-api.vercel.app/pat/", newData, {
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
export const deletePatData = createAsyncThunk('data/delete', async (id) => {
  try {
    await axios.delete(`https://autoroute-api.vercel.app/pat/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting form:', error);
    throw error;
  }
});

// Update form action
export const updatePatData = createAsyncThunk(
  'form/update',
  async ({ id, patData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`https://autoroute-api.vercel.app/pat/${id}`, patData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.patData;
    } catch (error) {
      return rejectWithValue(error.message);
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
  name: "patrouille",
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
        state.error = action.payload || "Error fetching patrouille data";
      })
      .addCase(addPatData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPatData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patrouilles.push(action.payload);
      })
      .addCase(addPatData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deletePatData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePatData.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.patrouilles = state.patrouilles.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deletePatData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updatePatData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePatData.fulfilled, (state, action) => {
        state.status = action.payload;
        console.log(action.payload);
        state.status = "succeeded";
      })
      .addCase(updatePatData.rejected, (state, action) => {
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

export default patrouilleSlice.reducer;
