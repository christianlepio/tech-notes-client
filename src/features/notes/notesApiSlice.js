// this slice is for notes features
// slice is a collection of reducers logic/actions for a single feature in tha app

// createSelector to create a memoized selector to avoid re-rendering of useSelector
// createEntityAdapter is used for Normalization to avoid duplicated data
import {
    createSelector,
    createEntityAdapter
} from '@reduxjs/toolkit'

import { apiSlice } from '../../app/api/apiSlice'

// create entity adapter
const notesAdapter = createEntityAdapter({})

// assign initialized state for notesAdapter
// even if u don't have a notes[] array here, notesAdapter will automatically 
// creates an object with id and entity that contains all notes array (data)
const initialState = notesAdapter.getInitialState()

// this will be injected to the endpoints in apiSlice file
export const notesApiSlice = apiSlice.injectEndpoints({
    // define endpoints
    endpoints: builder => ({
        // method to get all notes from url+query
        // builder.query is for requesting data
        getNotes: builder.query({
            // query value that will combined to the baseUrl
            query: () => '/notes',
            // make sure that the result is not an error if the response status is 200
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            // default is 60 seconds 
            // this will save note's data for at least 5 seconds in cache
            // remove this when deployment in the production
            keepUnusedDataFor: 5,
            // add or modify new fields or obj to the notes data using transformResponse
            transformResponse: responseData => {
                const loadedNotes = responseData.map(note => {
                    note.id = note._id
                    return note
                })

                // notesAdapter has its own CRUD methods 
                // set loadedNotes to initialState
                return notesAdapter.setAll(initialState, loadedNotes)
            }, 

            providesTags: (result, error, arg) => {
                // check if the result has an ids property
                if (result?.ids) {
                    return [
                        // define id as a LIST 
                        { type: 'Note', id: 'LIST' }, 
                        // map ids of every result 
                        // if any one of these ids were invalidated, it will trigger 
                        // getNotes endpoint method again and refetch data automatically
                        ...result.ids.map(id => ({ type: 'Note', id }))
                    ]
                } else return [{ type: 'Note', id: 'LIST' }]
            }
        }),

        
    })
})

// RTK query automatically creates custom hooks for methods in notesApiSlice (extended endpoint) above
// these custom hooks can be used by the components
export const {
    useGetNotesQuery, // custom hook generated from getNotes query method 
} = notesApiSlice

// start of selectors

// get the result from endpoint getNotes using select() method
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

// creates memoized selector
const selectNotesData = createSelector(
    // this is an input function
    selectNotesResult, 
    // this is an output function
    notesResult => notesResult.data // data property here holds normalized state obj with ids and entities
)

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllNotes, // this will return an array of notes entities
    selectById: selectNoteById, // returns specific post from entities with defined id
    selectIds: selectNoteIds // returns the state.ids array
    // ?? symbol is a nullish operator, if normalized state is null then return the initial state
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)

// end of selectors