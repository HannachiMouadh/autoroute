import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const registerUser = createAsyncThunk("register", async (user) => {
  try {
    let result = await axios.post("http://localhost:5000/api/user/register",user);
    console.log(result.data);
    console.log("hello result");
    return result.data;
  } catch (error) {
    console.log("hello error:",error)
  }
});

export const updateUser = createAsyncThunk("update", async ({_id,user}) => {
  const token = localStorage.getItem('token');
  try {
    console.log(user);
    let result = await axios.put(`http://localhost:5000/api/user/${_id}`,
      user,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return result.data;
  } catch (error) {
    console.log(error)
  }
});



export const loginUser = createAsyncThunk("login", async (user) => {
  try {
    const result = await axios.post("http://localhost:5000/api/user/login",user);
    console.log(result);
    return result.data;
  } catch (error) {
    console.log(error)
  }
});

export const currentUser = createAsyncThunk("current", async () => {
  let opts ={
    headers:{
      Authorization:localStorage.getItem("token"),
    },
  };
  try {
    const result = await axios.get("http://localhost:5000/api/user/current",opts);
    return result.data;
    console.log(result.data)
  } catch (error) {
    console.log(error)
  }
});


export const getAllUsers = createAsyncThunk("getAllUsers", async () => {
  try {
    const result = await axios.get("http://localhost:5000/api/user/");
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }
});

export const deleteUser = createAsyncThunk("user/dalete", async (id) => {
  try {
    const result = await axios.delete(`http://localhost:5000/api/user/${id}`);
    return result.data;
  } catch (error) {
    console.log(error)
  }
});

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
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.user = action.payload.user;
        console.log(action.payload.user);
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
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;