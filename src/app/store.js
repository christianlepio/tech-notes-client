import { configureStore } from "@reduxjs/toolkit"
// this contains RTK query (endpoints) for managing notes and users
import { apiSlice } from "./api/apiSlice"
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from '../features/auth/authSlice'

// config
export const store = configureStore({
    // list of reducers
    // components can call/use all reducers here from store
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer, // default property name of this is 'api'
        auth: authReducer // reducer for login auth
    },
    // this is required when implementing RTK query with store
    middleware: getDefaultMiddleware => 
        // add apiSlice middleware to default middleware
        // apiSlice middleware manages cache lifetimes and expirations and 
        // is required to use it when we're using RTK query in an apiSlice
        getDefaultMiddleware().concat(apiSlice.middleware),
    // allow debugging with react devtools 
    devTools: true
})

// this will enabled some options that we can use now with rtk query
setupListeners(store.dispatch)