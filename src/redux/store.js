import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';        // your auth slice
import coursesReducer from './courseSlice';  // matches courseSlice.js filename

export const store = configureStore({
    reducer: {
        auth: authReducer,
        courses: coursesReducer,  // this should match "state.courses"
    },
});