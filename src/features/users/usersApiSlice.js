// this slice is for users features
// slice is a collection of reducers logic/actions for a single feature in tha app

// createSelector to create a memoized selector to avoid re-rendering of useSelector
// createEntityAdapter is used for Normalization to avoid duplicated data
import {
    createSelector,
    createEntityAdapter
} from '@reduxjs/toolkit'

import { apiSlice } from '../../app/api/apiSlice'

// create entity adapter
const usersAdapter = createEntityAdapter({})

// assign initialized state for usersAdapter
// even if u don't have a users[] array here, usersAdapter will automatically 
// creates an object with id and entity that contains all users array (data)
const initialState = usersAdapter.getInitialState()

// this will be injected to the endpoints in apiSlice file
export const usersApiSlice = apiSlice.injectEndpoints({
    // define endpoints
    endpoints: builder => ({
        // method to get all users from url+query
        // builder.query is for requesting data
        getUsers: builder.query({
            // query value that will combined to the baseUrl
            query: () => '/users',
            // make sure that the result is not an error if the response status is 200
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            // default is 60 seconds 
            // this will save user's data for at least 5 seconds in cache
            // remove this when deployment in the production
            keepUnusedDataFor: 5,
            // add or modify new fields or obj to the users data using transformResponse
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                })

                // usersAdapter has its own CRUD methods 
                // set loadedUsers to initialState
                return usersAdapter.setAll(initialState, loadedUsers)
            }, 

            providesTags: (result, error, arg) => {
                // check if the result has an ids property
                if (result?.ids) {
                    return [
                        // define id as a LIST 
                        { type: 'User', id: 'LIST' }, 
                        // map ids of every result 
                        // if any one of these ids were invalidated, it will trigger 
                        // getUsers endpoint method again and refetch data automatically
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),

        // method to add new user
        // builder.mutation is for applying changes to cached data 
        addNewUser: builder.mutation({
            query: initUserData => ({
                url: '/users',
                method: 'POST', // post method to submit or save new user
                body: {
                    ...initUserData, 
                }
            }), 
            // this will force the cached data User to update
            invalidatesTags: [
                { type: 'User', id: 'LIST' }
            ]
        }), 

        // method to update user
        updateUser: builder.mutation({
            query: initUserData => ({
                url: '/users',
                method: 'PATCH', 
                body: {
                    ...initUserData, 
                }
            }), 
            // this will force the specific user that has an id equals to arg.id to update details 
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }), 

        // method to delete user
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users', 
                method: 'DELETE',
                body: { id }
            }), 
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        })
    })
})

// RTK query automatically creates custom hooks for methods in usersApiSlice (extended endpoint) above
// these custom hooks can be used by the components
export const {
    useGetUsersQuery, // custom hook generated from getUsers query method 
    useAddNewUserMutation, // generated from addNewUser mutation method 
    useUpdateUserMutation, // generated from updateUser mutation method
    useDeleteUserMutation // generated from deleteUser mutation method
} = usersApiSlice

// start of selectors

// get the result from endpoint getUsers using select() method
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
    // this is an input function
    selectUsersResult, 
    // this is an output function
    usersResult => usersResult.data // data property here holds normalized state obj with ids and entities
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers, // this will return an array of users entities
    selectById: selectUserById, // returns specific post from entities with defined id
    selectIds: selectUserIds // returns the state.ids array
    // ?? symbol is a nullish operator, if normalized state is null then return the initial state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)

// end of selectors