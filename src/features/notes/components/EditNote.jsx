import { useParams } from "react-router-dom"

import { useGetUsersQuery } from "../../users/usersApiSlice"
import { useGetNotesQuery } from "../notesApiSlice"
import useAuth from "../../../hooks/useAuth"

// component
import EditNoteForm from "./EditNoteForm"

const EditNote = () => {
    // get id parameter from the url
    const { id } = useParams()

    // get specific note using selector selectNoteById
    // const note = useSelector(state => selectNoteById(state, id))
    // get all users using selector selectAllUsers
    // const users = useSelector(selectAllUsers)

    // get state from use auth custom hook
    // to prevent an employee to edit notes that is not permitted
    const { username, isManager, isAdmin } = useAuth()

    // get specific note by id by calling query endpoint getNotes
    const { note } = useGetNotesQuery('notesList', {
        // built in function to get/return specific note
        selectFromResult: ({ data }) => ({
            note: data?.entities[id]
        }),
    })

    // get all users by mapping ids and getting data from entities by calling query endpoint getUsers
    const { users } = useGetUsersQuery('usersList', {
        // built in function to get/return all users
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    // dont allow other user to edit note that is not their note
    if (!isManager || !isAdmin) {
        if (note?.username !== username) {
            return <p className="text-center">You have no permision to edit this note</p>
        }
    }

    const content = note && users 
        ? <EditNoteForm note={note} users={users} /> 
        : <p>Loading . . .</p>

    return content
}

export default EditNote