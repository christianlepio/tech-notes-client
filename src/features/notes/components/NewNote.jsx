import { useSelector } from "react-redux"
// memoized users data 
import { selectAllUsers } from "../../users/usersApiSlice"
// component 
import NewNoteForm from "./NewNoteForm"

const NewNote = () => {
    // get users data from selectors
    const users = useSelector(selectAllUsers)

    const content = users ? <NewNoteForm users={users} /> : <p>Loading . . .</p>
    
    return content
}

export default NewNote