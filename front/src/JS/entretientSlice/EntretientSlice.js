import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fetch forms action
export const fetchEntData = createAsyncThunk('data/fetchAll', async () => {
  try {
    const response = await axios.get('http://localhost:5000/ent/');
    return response.data.respond;
  } catch (error) {
    console.error('Error fetching entdata:', error);
    throw error;
  }
});

// Add form action
export const addEntData = createAsyncThunk('data/add', async (newData) => {
  try {
    const response = await axios.post('http://localhost:5000/ent/', newData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding form:', error);
    throw error;
  }
});

// Delete form action
export const deleteEntData = createAsyncThunk('data/delete', async (id) => {
  try {
    await axios.delete(`http://localhost:5000/ent/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting form:', error);
    throw error;
  }
});

// Update form action
export const updateEntData = createAsyncThunk(
  'form/update',
  async ({ id, respond }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/ent/${id}`, respond, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.respond;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);








const initialState = {
  entDatas: [],
  status: 'idle',
  error: null
};
const entretientSlice = createSlice({
  name: 'entDatas',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntData.fulfilled, (state, action) => {
        state.entDatas = action.payload; 
      })
      .addCase(fetchEntData.pending, (state) => {

        state.status = 'loading';
      })
      .addCase(fetchEntData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; 
      })
      .addCase(addEntData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addEntData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entDatas.push(action.payload);
      })
      .addCase(addEntData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; 
      })
      .addCase(deleteEntData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEntData.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.entDatas  = state.entDatas.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteEntData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateEntData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEntData.fulfilled, (state, action) => {
        state.status = action.payload;
        console.log(action.payload);
        state.status = 'succeeded';
      })
      .addCase(updateEntData.rejected, (state, action) => {
        state.status = 'failed';
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

export default entretientSlice.reducer;

