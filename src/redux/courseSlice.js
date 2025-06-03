import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper: Headers with token
const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Normalize course id field
const normalizeCourse = (course) => ({
  ...course,
  _id: course._id || course.id || '',
});

// Thunks inside slice file

export const fetchMyCourses = createAsyncThunk(
  'courses/fetchMyCourses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:3000/api/courses', {
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      const data = await response.json();

      return data.map(normalizeCourse);
    } catch (error) {
      console.error('fetchMyCourses error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (courseId, { getState, rejectWithValue }) => {
    try {
      if (!courseId) throw new Error('Course ID required');
      const token = getState().auth.token;
      if (!token) throw new Error('No auth token');

      const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      const course = await response.json();
      return normalizeCourse(course);
    } catch (error) {
      console.error('fetchCourseById error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ courseId, courseData }, { getState, rejectWithValue }) => {
    try {
      if (!courseId) throw new Error('Course ID required');
      if (!courseData) throw new Error('Course data required');

      const token = getState().auth.token;
      if (!token) throw new Error('No auth token');

      const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      const updatedCourse = await response.json();
      return normalizeCourse(updatedCourse);
    } catch (error) {
      console.error('updateCourse error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (courseId, { getState, rejectWithValue }) => {
    try {
      if (!courseId) throw new Error('Course ID required');

      const token = getState().auth.token;
      if (!token) throw new Error('No auth token');

      const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      return courseId;
    } catch (error) {
      console.error('deleteCourse error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  myCourses: [],
  selectedCourse: null,
  loading: false,
  courseLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
  courseError: null,
  updateError: null,
  deleteError: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearSelectedCourse(state) {
      state.selectedCourse = null;
      state.courseError = null;
    },
    clearErrors(state) {
      state.error = null;
      state.courseError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    clearUpdateStatus(state) {
      state.updateLoading = false;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMyCourses
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
        state.error = action.payload || action.error.message;
      })

      // fetchCourseById
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
        state.courseError = action.payload || action.error.message;
      })

      // updateCourse
      .addCase(updateCourse.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedCourse = action.payload;
        if (!updatedCourse._id) {
          console.error('updateCourse fulfilled: missing _id', updatedCourse);
          return;
        }
        const index = state.myCourses.findIndex((c) => c._id === updatedCourse._id);
        if (index !== -1) {
          state.myCourses[index] = updatedCourse;
        }
        if (state.selectedCourse && state.selectedCourse._id === updatedCourse._id) {
          state.selectedCourse = updatedCourse;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || action.error.message;
      })

      // deleteCourse
      .addCase(deleteCourse.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const deletedCourseId = action.payload;
        state.myCourses = state.myCourses.filter((c) => c._id !== deletedCourseId);
        if (state.selectedCourse && state.selectedCourse._id === deletedCourseId) {
          state.selectedCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || action.error.message;
      });
  },
});

export const { clearSelectedCourse, clearErrors, clearUpdateStatus } = coursesSlice.actions;

export default coursesSlice.reducer;
