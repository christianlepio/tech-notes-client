import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectNoteById } from "../notesApiSlice"
import { selectAllUsers } from "../../users/usersApiSlice"
// component
import EditNoteForm from "./EditNoteForm"

const EditNote = () => {
    // get id parameter from the url
    const { id } = useParams()

    // get specific note using selector selectNoteById
    const note = useSelector(state => selectNoteById(state, id))
    // get all users using selector selectAllUsers
    const users = useSelector(selectAllUsers)

    const content = note && users 
        ? <EditNoteForm note={note} users={users} /> 
        : <p>Loading . . .</p>

    return content
}

export default EditNote