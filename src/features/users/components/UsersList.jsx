// import generated rtk query custom hook
import { useGetUsersQuery } from "../usersApiSlice"
// components
import User from "./User"
import useTitle from "../../../hooks/useTitle"

const UsersList = () => {
    // this will change the document title on top, dynamically
    useTitle('Users List')

    // get variables from generated custom hooks (rtk query)
    const {
        data: users, // rename data to users, this returns an users array
        isLoading, // boolean
        isSuccess, // boolean
        isError, // boolean
        error // error message
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000, // means, it will refetch user data every after 60 seconds
        refetchOnFocus: true, // will refetch user data if you go to another window and comeback to previous window
        refetchOnMountOrArgChange: true // will refetch user data if component reloads
    })

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
                <table className="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th scope="col"> # </th>
                            <th scope="col">Status</th>
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