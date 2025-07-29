import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const registerUser = createAsyncThunk("register", async (user, { rejectWithValue }) => {
  try {
    const result = await axios.post("https://autoroute.onrender.com/api/user/register", user);
    return result.data;
  } catch (error) {
    console.error("Erreur Axios :", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || { msg: "Erreur inconnue" });
  }
});

export const updateUser = createAsyncThunk("update", async ({ _id, formData }) => {
  const token = localStorage.getItem('token');
  try {
    let result = await axios.put(
      `https://autoroute.onrender.com/api/user/${_id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return result.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const loginUser = createAsyncThunk("login", async (user) => {
  try {
    const result = await axios.post("https://autoroute.onrender.com/api/user/login",user,
      {
        headers: {
          'app-type': 'web', // or 'web'
        },
      }
    );
    console.log(result);
    return result.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
  }
});

export const currentUser = createAsyncThunk('user/current', async (thunkAPI) => {
  try {
      const response = await axios.get("https://autoroute.onrender.com/api/user/current", {
          headers: {
              Authorization: localStorage.getItem("token"),
          },
      });
      return response.data;
  } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
  }
});



export const getAllUsers = createAsyncThunk("getAllUsers", async () => {
  try {
    const result = await axios.get("https://autoroute.onrender.com/api/user/");
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
});

export const deleteUser = createAsyncThunk("user/dalete", async (id) => {
  try {
    const result = await axios.delete(`https://autoroute.onrender.com/api/user/${id}`);
    return result.data;
  } catch (error) {
    console.log(error)
  }
});

// Upload image and update user's photo URL
export const updatePhoto = createAsyncThunk(
  "user/updatePhoto",
  async ({ userId, file }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`https://autoroute.onrender.com/api/updatePhoto/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      console.error("updatePhoto failed:", error);
      return thunkAPI.rejectWithValue(error.response?.data || "Upload error");
    }
  }
);


export const uploadSingle = createAsyncThunk(
  "upload/photo",
  async (formDataUpload) => {
    const response = await axios.post("https://autoroute.onrender.com/api/uploadSingle", formDataUpload, {
      headers: {
        "Content-Type": "multipart/form-data", // ✅ critical
      },
    });
    console.error("uploaded action: ", response.data);
    return response.data;
  }
);

const initialState = {
  user: [],
  status: 'idle',
  users: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state, action) => {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuth');
      state.status = 'idle';
      state.user = null;
      state.isAuth = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.registerSuccess = true;
      })
      .addCase(registerUser.rejected, (state,action) => {
        state.status = 'fail';
        state.error = action.payload ? action.payload.msg : action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.user = action.payload.user;
        state.isAuth = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('isAuth', true);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? action.payload.msg : action.error.message;
      })
      .addCase(currentUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(currentUser.fulfilled, (state, action) => {
        console.log('Fulfilled action triggered Current User');
        state.status = 'success';
        state.user = action.payload.user;
      })
      .addCase(currentUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'success';
      })
      .addCase(updateUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getAllUsers.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = 'success';
        state.users = action.payload.response;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(deleteUser.rejected, (state) => {
        state.status = 'fail';
      })
      .addCase(uploadSingle.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(uploadSingle.fulfilled, (state,action) => {
        if (action.payload) {
          state.image = action.payload.image;
        }
      })
      .addCase(uploadSingle.rejected, (state) => {
        state.status = 'fail';
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
