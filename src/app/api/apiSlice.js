// fetchBaseQuery handles baseurl for the data
// createApi lets us to create apiSlice that will serve as the backend
// createApi is used to implement RTK query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    // define the base url to be used in fetching data using fetchBaseQuery function
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
    // for cached data
    // you can decide if you want to update these cached data in realtime using provideTags and invalidateTags
    tagTypes: ['Note', 'User'],
    // this will handle all fetch requests (RTK query)
    // other js file will inject enpoints, that's why it is empty object here
    endpoints: builder => ({})
})