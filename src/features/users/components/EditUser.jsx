// get userid value parameter from url
import { useParams } from "react-router-dom"
// useSelector: to get global state variable from store
// import { useSelector } from "react-redux"
// memoized selector 
// import { selectUserById } from "../usersApiSlice"
import { useGetUsersQuery } from "../usersApiSlice"
// component
import EditUserForm from "./EditUserForm"

const EditUser = () => {
    // pull userid from url using useParams()
    const { id } = useParams()

    // get specific user details
    // const user = useSelector(state => selectUserById(state, id))

    // get specific user by id by calling query endpoint getUsers
    const { user } = useGetUsersQuery('usersList', {
        // built in function to get/return specific user
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        }),
    })

    const content = user ? <EditUserForm user={user} /> : <p>Loading . . .</p>

    return content
}

export default EditUser