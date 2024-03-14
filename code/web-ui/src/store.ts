import {configureStore} from "@reduxjs/toolkit";
import { createSlice} from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    token: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: ""
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.token = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = "";
        }
    }
});

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;