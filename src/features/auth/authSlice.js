// this slice is for login authentication features
// slice is a collection of reducer logic/actions for a single feature in the app
// createSlice to create a slice
import { createSlice } from '@reduxjs/toolkit'

// create auth slice using createSlice
const authSlice = createSlice({
    // objects
    name: 'auth', // this is required
    initialState: { token: null }, // state variable that holds value for access token
    // reducers contains all actions/functions for posts
    reducers: {
        // action to set value for access token 
        // will going to receive state & action params
        setCredentials: (state, action) => {
            // get access token from action payload
            const { accessToken } = action.payload
            // set value for state token
            state.token = accessToken
        }, 
        // action to logout and set the state token to null
        logout: (state, action) => {
            state.token = null
        }
    }
})

// export actions / functions to be used in other programs
export const { setCredentials, logout } = authSlice.actions

// export reducer and wil going to add this to the store
export default authSlice.reducer

// export value of access token                 // auth here is the name field in authSlice above
export const selectCurrentToken = (state) => state.auth.token