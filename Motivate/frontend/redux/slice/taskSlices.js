import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// BASE URL ayarı
const BASE_URL = "http://192.168.1.104:5000/api/tasks";

// GET TASKS
export const fetchTasks = createAsyncThunk("tasks/fetch", async (_, { getState }) => {
  const token = getState().auth.token;
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

// ADD TASK
export const addTask = createAsyncThunk("tasks/add", async (title, { getState }) => {
  const token = getState().auth.token;
  const res = await axios.post(BASE_URL, { title }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

// COMPLETE TASK
export const completeTask = createAsyncThunk("tasks/complete", async (id, { getState }) => {
  const token = getState().auth.token;
  const res = await axios.patch(`${BASE_URL}/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

// DELETE TASK
export const deleteTask = createAsyncThunk("tasks/delete", async (id, { getState }) => {
  const token = getState().auth.token;
  await axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // ADD
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })

      // COMPLETE
      .addCase(completeTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })

      // DELETE
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
