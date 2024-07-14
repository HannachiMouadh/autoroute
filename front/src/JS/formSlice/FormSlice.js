import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';



export const fetchForms = createAsyncThunk('data/fetchAll', async () => {
  try {
    const response = await fetch('http://localhost:5000/auto/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    const data = await response.json();
    return data.respond;
  } catch (error) {
    console.error('Error fetching forms:', error);
    throw error;
  }
});


export const addForm = createAsyncThunk('data/add', async (newData) => {

    const response = await fetch('http://localhost:5000/auto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
    const data = await response.json();
    console.log(data);
    return data;

});


export const deleteForm = createAsyncThunk('data/delete', async (dataId) => {

    await fetch(`${'http://localhost:5000/auto/'}${dataId}`, {
      method: 'DELETE',
    });
    return dataId;
});



export const updateForm = createAsyncThunk(
  'form/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/auto/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update form');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
      });
  },
});

export default formSlice.reducer;

