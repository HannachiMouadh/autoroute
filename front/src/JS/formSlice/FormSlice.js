import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fetch forms action
export const fetchForms = createAsyncThunk('data/fetchAll', async () => {
  try {
    const response = await axios.get('https://autoroute-api.vercel.app/auto/');
    return response.data.respond;
  } catch (error) {
    console.error('Error fetching forms:', error);
    throw error;
  }
});


// Add form action
export const addForm = createAsyncThunk('data/add', async (newData) => {
  try {
    const response = await axios.post('https://autoroute-api.vercel.app/auto/', newData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding form:', error);
    throw error;
  }
});

// Delete form action
export const deleteForm = createAsyncThunk('data/delete', async (id) => {
  try {
    await axios.delete(`https://autoroute-api.vercel.app/auto/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting form:', error);
    throw error;
  }
});

// Update form action
export const updateForm = createAsyncThunk(
  'form/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`https://autoroute-api.vercel.app/auto/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
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
    console.error("uploaded action: ", response.data);
    return response.data;
  }
);





const initialState = {
  data: [],
  status: 'idle',
  error: null
};
const formSlice = createSlice({
  name: 'data',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.data = action.payload; 
      })
      .addCase(fetchForms.pending, (state) => {

        state.status = 'loading';
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; 
      })
      .addCase(addForm.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addForm.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.push(action.payload); 
      })
      .addCase(addForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; 
      })
      .addCase(deleteForm.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateForm.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.status = action.payload;
        console.log(action.payload);
        state.status = 'succeeded';
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.status = 'failed';
        try {
          const errorMessage = JSON.parse(action.error.message);
          state.error = errorMessage;
        } catch (error) {
          // If not valid JSON, use the error message as is
          state.error = action.error.message;
        }
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(uploadPhoto.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        if (action.payload) {
          state.image = action.payload.image;
        }
      })
  },
});

export default formSlice.reducer;

