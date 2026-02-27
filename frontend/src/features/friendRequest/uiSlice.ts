import { createSlice } from "@reduxjs/toolkit";

interface UiState {
    selectedUserId: string | null;
}

const initialState: UiState = {
    selectedUserId: null,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUserId = action.payload;
        },
    },
});

export const { setSelectedUser } = uiSlice.actions;
export default uiSlice.reducer;
