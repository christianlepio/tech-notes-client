// fetchBaseQuery handles baseurl for the data
// createApi lets us to create apiSlice that will serve as the backend
// createApi is used to implement RTK query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

// define base query 
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500', // url used by the backend (nodeJS)
    credentials: 'include', // to send back the httpOnly cookie from frontend to backend
    // attach headers to base query
    // receives headers & destructured getState params
    prepareHeaders: (headers, { getState }) => {
        //get token from getState auth token
        const token = getState().auth.token

        if (token) {
            // if there's a token then set the headers
            // backend is expecting to receive 'authorization' string weather it's upper/lower case
            // also send the accessToken string that starts with 'Bearer'
            headers.set("authorization", `Bearer ${token}`)
        }
        // return headers that will be send to the backend
        return headers
    }
})

// wrap baseQuery here so if it fails then we can request new access token again using refresh token (not expired)
// this function will required to receive a standard params args, api, extraOptions
const baseQueryWithReauth = async (args, api, extraOptions) => {
    console.log('args: ', args) // request url, method, body
    console.log('api: ', api) // signal, dispatch, getState()
    console.log('extraOptions: ', extraOptions) // custom like { shout: true }

    // define result 
    let result = await baseQuery(args, api, extraOptions)

    // if result error status is 403 (forbidden)
    if (result?.error?.status === 403) {
        console.log('Sending refresh token!...')

        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        console.log('refreshResult: ', refreshResult)

        //if there is refreshResult data
        if (refreshResult?.data) {
            // get access token from refreshResult and pass it to set credentials
            // refreshResult.data holds accessToken value
            // dispatch allows you to use or call actions
            api.dispatch(setCredentials({ ...refreshResult.data }))

            //retry the original query with the new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            // if refreshResult error status is 403 (forbidden)
            if (refreshResult?.error?.status === 403) {
                // set its error message
                refreshResult.error.data.message = 'Your login has expired!...'
            }
            return refreshResult
        }
    } 
    return result
}

export const apiSlice = createApi({
    // define the base url to be used in fetching data using fetchBaseQuery function above
    baseQuery: baseQueryWithReauth,
    // for cached data
    // you can decide if you want to update these cached data in realtime using provideTags and invalidateTags
    tagTypes: ['Note', 'User'],
    // this will handle all fetch requests (RTK query)
    // other js file will inject enpoints, that's why it is empty object here
    endpoints: builder => ({})
})