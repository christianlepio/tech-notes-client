// import { useSelector } from "react-redux"
// memoized users data 
// import { selectAllUsers } from "../../users/usersApiSlice"
import { useGetUsersQuery } from "../../users/usersApiSlice"
// component 
import NewNoteForm from "./NewNoteForm"

const NewNote = () => {
    // get users data from selectors
    // const users = useSelector(selectAllUsers)

    // get all users by mapping ids and getting data from entities by calling query endpoint getUsers
    const { users } = useGetUsersQuery('usersList', {
        // built in function to get/return all users
        selectFromResult: ({ data }) => ({
            user: data?.ids.map(id => data?.entities[id])
        }),
    })

    const content = users ? <NewNoteForm users={users} /> : <p>Loading . . .</p>
    
    return content
}

export default NewNote