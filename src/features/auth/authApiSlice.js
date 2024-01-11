import { apiSlice } from "../../app/api/apiSlice"
import { logout } from "./authSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth', 
                method: 'POST', 
                body: { ...credentials }
            })
        }), 

        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout', 
                method: 'POST',
            }), 
            // function when this sendLogout query started
            // it accpets arguments, and other methods dispatch & queryFulfilled
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled // wait for the query to be fulfilled
                    console.log(data)
                    dispatch(logout()) // if query fulfilled then call logout function using dispatch
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState()) // after logout clear all cached data.
                    }, 1000);
                } catch (err) {
                    console.log('Logout Error: ', err)
                }
            }
        }), 

        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh', 
                method: 'GET',
            })
        })
    })
})

// RTK query automatically creates custom hooks for methods in usersApiSlice (extended endpoint) above
// these custom hooks can be used by the components
export const { 
    useLoginMutation, 
    useSendLogoutMutation,
    useRefreshMutation
} = authApiSlice