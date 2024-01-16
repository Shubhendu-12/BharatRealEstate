import { createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

 const userSlice = createSlice ({
  name:"user",
  initialState,
  reducers :{
    logInStart: (state) => { 
    state.loading = true;
    },
    logInSuccess: (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
    },
    logInFailure: (state, action) => {
        state.error = action.payload;
        state.loading = false;
    },
    updateUserStart :(state)=>{
    state.loading= true;
    },
    updateUserSuccess : (state,action)=> {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
    },
    updateUserFailure:(state,action)=>{
        state.error = action.payload;
        state.loading = false;
    },
    deleteUserStart :(state)=>{
        state.loading=true;
    },
    deleteUserSuccess :(state)=>{
        state.currentUser = null;
        state.loading = false;
        state.error = null;
    },
    deleteUserFailure : (state,action)=>{
     state.error = action.payload;
     state.loading = false;
    },
    signOutUserStart: (state) => {
        state.loading = true;
      },
      signOutUserSuccess: (state) => {
        state.currentUser = null;
        state.loading = false;
        state.error = null;
      },
      signOutUserFailure: (state, action) => {
        state.error = action.payload;
        state.loading = false;
      },
  }
});

export const {logInStart,logInSuccess,logInFailure,updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signOutUserStart,signOutUserSuccess,signOutUserFailure} = userSlice.actions;

export default userSlice.reducer;
