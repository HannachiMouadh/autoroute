import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://autoroute-c4tf.vercel.app";

const saveAccessToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isAuth");
  localStorage.removeItem("role");
};

const requestWithAutoRefresh = async (requestConfig) => {
  try {
    return await axios(requestConfig);
  } catch (error) {
    const isUnauthorized = error.response?.status === 401;
    const alreadyRetried = requestConfig._retry;

    if (!isUnauthorized || alreadyRetried) {
      throw error;
    }

    const refreshResponse = await axios.post(
      `${API_BASE}/api/user/refresh-token`,
      {},
      { withCredentials: true }
    );

    const newToken = refreshResponse.data?.token;
    if (!newToken) {
      throw error;
    }

    saveAccessToken(newToken);

    const retryConfig = {
      ...requestConfig,
      _retry: true,
      headers: {
        ...(requestConfig.headers || {}),
        Authorization: newToken,
      },
    };

    return axios(retryConfig);
  }
};


export const registerUser = createAsyncThunk("register", async (user, { rejectWithValue }) => {
  try {
    const result = await axios.post(`${API_BASE}/api/user/register`, user);
    return result.data;
  } catch (error) {
    console.error("Erreur Axios :", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || { msg: "Erreur inconnue" });
  }
});

export const updateUser = createAsyncThunk("update", async ({ _id, formData }, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  try {
    const result = await requestWithAutoRefresh({
      method: 'put',
      url: `${API_BASE}/api/user/${_id}`,
      data: formData,
      headers: {
        Authorization: token,
      },
    });
    return result.data;
  } catch (error) {
    console.error("updateUser failed:", error);
    return rejectWithValue(error.response?.data || { msg: "Erreur lors de la mise à jour" });
  }
});

export const loginUser = createAsyncThunk("login", async (user, { rejectWithValue }) => {
  try {
    const result = await axios.post(`${API_BASE}/api/user/login`,user,
      {
        withCredentials: true,
        headers: {
          'app-type': 'web', // or 'web'
        },
      }
    );
    console.log(result);
    return result.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data || { msg: "Erreur de connexion" });
  }
});

export const currentUser = createAsyncThunk('user/current', async (thunkAPI) => {
  try {
      const response = await requestWithAutoRefresh({
        method: 'get',
        url: `${API_BASE}/api/user/current`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
  } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { msg: 'Session expirée' });
  }
});

export const logoutUser = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${API_BASE}/api/user/logout`, {}, { withCredentials: true });
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data || { msg: 'Logout failed' });
  }
});



export const getAllUsers = createAsyncThunk("getAllUsers", async () => {
  try {
    const result = await axios.get(`${API_BASE}/api/user/`);
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
});

export const deleteUser = createAsyncThunk("user/dalete", async (id) => {
  try {
    const result = await axios.delete(`${API_BASE}/api/user/${id}`);
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
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append("file", file);

      const response = await requestWithAutoRefresh({
        method: 'post',
        url: `${API_BASE}/api/updatePhoto/${userId}`,
        data: formData,
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
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
    const response = await axios.post(`${API_BASE}/api/uploadSingle`, formDataUpload, {
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
    logout: (state) => {
      clearAuthStorage();
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
        saveAccessToken(action.payload.token);
        localStorage.setItem('isAuth', true);
        localStorage.setItem('role', action.payload?.user?.role || '');
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
      .addCase(logoutUser.fulfilled, (state) => {
        clearAuthStorage();
        state.status = 'idle';
        state.user = null;
        state.isAuth = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Clear local session even if backend logout fails.
        clearAuthStorage();
        state.status = 'idle';
        state.user = null;
        state.isAuth = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'success';
        // Update user if response contains user data
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
        }
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
        state.status = 'success';
        if (action.payload && action.payload.url) {
          state.image = action.payload.url;
        }
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.status = 'success';
        if (action.payload) {
          // If backend returns full user object
          if (action.payload.user) {
            state.user = action.payload.user;
          }
          // If backend returns imageUrl separately
          if (action.payload.imageUrl && state.user) {
            state.user.image = action.payload.imageUrl;
          }
        }
      })
      .addCase(uploadSingle.rejected, (state) => {
        state.status = 'fail';
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;