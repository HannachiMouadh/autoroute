import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Fetch forms action
export const fetchEntData = createAsyncThunk("data/fetchAll", async () => {
  try {
    const response = await axios.get("https://autoroute-api.vercel.app/ent/");
    return response.data.respond;
  } catch (error) {
    console.error("Error fetching entdata:", error);
    throw error;
  }
});

// Add form action
export const addEntData = createAsyncThunk("data/add", async (newData) => {
  try {
    const response = await axios.post("https://autoroute-api.vercel.app/ent/", newData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding form:", error);
    throw error;
  }
});

// Delete form action
export const deleteEntData = createAsyncThunk("data/delete", async (id) => {
  try {
    await axios.delete(`https://autoroute-api.vercel.app/ent/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting form:", error);
    throw error;
  }
});

// Update form action
export const updateEntData = createAsyncThunk(
  "form/update",
  async ({ id, entData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://autoroute-api.vercel.app/ent/${id}`,
        entData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.entData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadPhoto = createAsyncThunk(
  "upload/photo",
  async (formDataUpload) => {
    const response = await axios.post("https://autoroute-api.vercel.app/api/upload", formDataUpload, {
      headers: {
        "Content-Type": "multipart/form-data", // ✅ critical
      },
    });
    return response.data;
  }
);




const initialState = {
  entDatas: [],
  status: "idle",
  error: null,
};
const entretientSlice = createSlice({
  name: "entDatas",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntData.fulfilled, (state, action) => {
        state.entDatas = action.payload;
      })
      .addCase(fetchEntData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEntData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addEntData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addEntData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entDatas.push(action.payload);
      })
      .addCase(addEntData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteEntData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteEntData.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.entDatas = state.entDatas.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteEntData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateEntData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateEntData.fulfilled, (state, action) => {
        state.status = action.payload;
        console.log(action.payload);
        state.status = "succeeded";
      })
      .addCase(updateEntData.rejected, (state, action) => {
        state.status = "failed";
        try {
          const errorMessage = JSON.parse(action.error.message);
          state.error = errorMessage;
        } catch (error) {
          // If not valid JSON, use the error message as is
          state.error = action.error.message;
        }
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(uploadPhoto.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        if (action.payload) {
          state.image = action.payload.image;
        }
      });
  },
});

export default entretientSlice.reducer;
