import { createSlice } from '@reduxjs/toolkit';

let token = null;
if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: token || null,
        user: null,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', action.payload.token);
            }
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
