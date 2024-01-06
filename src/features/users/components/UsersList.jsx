// import generated rtk query custom hook
import { useGetUsersQuery } from "../usersApiSlice"
// components
import User from "./User"

const UsersList = () => {
    // get variables from generated custom hooks (rtk query)
    const {
        data: users, // rename data to users, this returns an users array
        isLoading, // boolean
        isSuccess, // boolean
        isError, // boolean
        error // error message
    } = useGetUsersQuery()

    // define content
    let content

    if (isLoading) content = <p>Loading . . . </p>

    if (isError) content = <p className="text-danger">{error?.data?.message}</p> 

    if (isSuccess) {
        // get ids array from normalized state obj of users
        const { ids } = users

        const tableContent = ids?.length 
            ? ids.map((userId, i) => <User key={userId} userId={userId} index={i} />)
            : null

        content = (
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col"> # </th>
                            <th scope="col">Username</th>
                            <th scope="col">Roles</th>
                            <th scope="col">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </div>
        )
    }

    return content
}

export default UsersList