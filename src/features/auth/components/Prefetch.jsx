// this prefetch component will solve the issue when the user edits a note/user and 
// it suddenly expires the cached data then instead of going to edit form page it will only 
// display 'loading ...'. Also, when you refresh the page it will still remain on edit form page.

import { store } from '../../../app/store'
import { notesApiSlice } from '../../notes/notesApiSlice'
import { usersApiSlice } from '../../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    useEffect(() => {
        console.log('Prefetch subscribing!...')
        const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            console.log('Prefetch unsubscribing!...')
            notes.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}

export default Prefetch