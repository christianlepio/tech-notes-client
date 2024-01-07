import { useNavigate } from 'react-router-dom'
// useSelector: to get global state variable from store
import { useSelector } from 'react-redux'
// memoized selector 
import { selectUserById } from '../usersApiSlice'

const User = ({ userId, index }) => {
    // get specific user by id from state
    const user = useSelector(state => selectUserById(state, userId))

    // initialize useNavigate hook
    const navigate = useNavigate()

    if (user) {
        // navigate to edit form of user
        const handleEdit = () => navigate(`/dash/users/${userId}`)
        // set roles array to a string & replace comma to comma space
        const userRolesString = user.roles.toString().replaceAll(',', ', ')
        // if user is active then set cell status to table-active
        const statusClass = user.active ? 'text-success' : 'text-danger'

        return (
            <tr>
                <th scope='row'>{index + 1}</th>
                <td><i className={`bi bi-circle-fill ${statusClass}`}></i></td>
                <td>{user.username}</td>
                <td>{userRolesString}</td>
                <td>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleEdit}
                    >
                        <i className="bi bi-pen"></i>
                    </button>
                </td>
            </tr>
        )

    } else return null
}

export default User