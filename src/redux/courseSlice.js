// src/redux/courseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all courses
export const fetchMyCourses = createAsyncThunk(
  'courses/fetchMyCourses', 
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await fetch('http://localhost:3000/api/courses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return await response.json();
  }
);

// Fetch single course by ID
export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (courseId, { getState }) => {
    const token = getState().auth.token;
    const response = await fetch(`http://localhost:3000/api/courses/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch course details');
    return await response.json();
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    myCourses: [],
    selectedCourse: null,
    loading: false,
    courseLoading: false,
    error: null,
    courseError: null,
  },
  reducers: {
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
      state.courseError = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.courseError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchMyCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.myCourses = action.payload;
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch single course
      .addCase(fetchCourseById.pending, (state) => {
        state.courseLoading = true;
        state.courseError = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.courseLoading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.courseLoading = false;
        state.courseError = action.error.message;
      });
  },
});

export const { clearSelectedCourse, clearErrors } = coursesSlice.actions;
export default coursesSlice.reducer;