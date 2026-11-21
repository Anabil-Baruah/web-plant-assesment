import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
  project: string;
}

interface TaskState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = { items: [], loading: false, error: null };

export const fetchTasks = createAsyncThunk('tasks/fetch', async ({ projectId, filters }: { projectId: string; filters?: Record<string, string> }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/tasks/${projectId}/tasks`, { params: filters });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const createTask = createAsyncThunk('tasks/create', async ({ projectId, data }: { projectId: string; data: Partial<Task> }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/tasks/${projectId}/tasks`, data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ projectId, taskId, data }: { projectId: string; taskId: string; data: Partial<Task> }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tasks/${projectId}/tasks/${taskId}`, data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async ({ projectId, taskId }: { projectId: string; taskId: string }, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${projectId}/tasks/${taskId}`);
    return taskId;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: { clearTasks(s) { s.items = []; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (s) => { s.loading = true; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchTasks.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(createTask.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateTask.fulfilled, (s, a) => {
        const idx = s.items.findIndex(t => t._id === a.payload._id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteTask.fulfilled, (s, a) => {
        s.items = s.items.filter(t => t._id !== a.payload);
      });
  },
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
