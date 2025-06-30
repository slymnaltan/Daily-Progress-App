import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.1.104:5000";

// Token'ı ayarla
const setAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return token;
};

// Günlük girişi getir
export const fetchDailyEntry = createAsyncThunk(
  "entry/fetchDailyEntry", 
  async (date, { rejectWithValue }) => {
    try {
      await setAuthHeader();
      const res = await axios.get(`${API_BASE_URL}/api/entries/${date}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Günlük veri alınamadı");
    }
  }
);

// Günlük girişi güncelle
export const updateDailyEntry = createAsyncThunk(
  "entry/updateDailyEntry", 
  async ({ date, note, hoursWorked }, { rejectWithValue }) => {
    try {
      await setAuthHeader();
      const res = await axios.post(`${API_BASE_URL}/api/entries`, { date, note, hoursWorked });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Günlük veri kaydedilemedi");
    }
  }
);

// Haftalık girişleri getir
export const fetchWeeklyEntries = createAsyncThunk(
  "entry/fetchWeeklyEntries",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      await setAuthHeader();
      const res = await axios.get(`${API_BASE_URL}/api/entries?startDate=${startDate}&endDate=${endDate}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Haftalık veriler alınamadı");
    }
  }
);

const entrySlice = createSlice({
  name: "entry",
  initialState: { 
    data: null,
    weeklyData: [],
    status: "idle", // loading, succeeded, failed
    error: null
  },
  reducers: {
    clearEntryError: (state) => {
      state.error = null;
      state.status = "idle";
    },
    resetEntryData: (state) => {
      state.data = null;
      state.weeklyData = [];
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchDailyEntry
      .addCase(fetchDailyEntry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDailyEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDailyEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // updateDailyEntry
      .addCase(updateDailyEntry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateDailyEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateDailyEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // fetchWeeklyEntries
      .addCase(fetchWeeklyEntries.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWeeklyEntries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.weeklyData = action.payload;
      })
      .addCase(fetchWeeklyEntries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { clearEntryError, resetEntryData } = entrySlice.actions;
export default entrySlice.reducer;