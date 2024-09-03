import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl = process.env.REACT_APP_API_URL;


export const authenticateUser = createAsyncThunk(
  "global/authenticateUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/login.php`, {
        email: email,
        password: password,
      });

      return response.data; 
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({
          message: "Network error or server not responding",
        });
      }
    }
  }
);

const initialState = {
  mode: "dark",
  adminId: null, // Updated to match the user data's structure
  role: null,
  nom: null,
  prenom: null,
  email: null,
  isAuthenticated: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    logout: (state) => {
      state.adminId = null; // Updated to match the user data's structure
      state.role = null;
      state.nom = null;
      state.prenom = null;
      state.email = null;
      state.isAuthenticated = false;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(authenticateUser.fulfilled, (state, { payload }) => {
        const userData = payload.userData; // Extract the user data from the response
        const role = userData.email.split('@')[1].split('.')[0]; // Extract role from email
        state.adminId = userData.id_comptable; // Store the user data in the state
        state.nom = userData.nom;
        state.prenom = userData.prenom;
        state.email = userData.email;
        state.role = role;
        state.isAuthenticated = true;
        state.status = "succeeded";
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export const { setMode, logout } = globalSlice.actions;
export default globalSlice.reducer;
