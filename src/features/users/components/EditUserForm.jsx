import { useState, useEffect } from "react"
// generated custom hook from rtk query
import { useUpdateUserMutation, useDeleteUserMutation } from "../usersApiSlice"
import { useNavigate } from "react-router-dom"
import { ROLES } from '../../../config/roles'

// standard username character
const USER_REGEX = /^[A-z]{3,20}$/
// standard password character
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditUserForm = ({ user }) => {
    // initialize RTK query custom hooks mutation, and get the method and variables
    const [updateUser, {
        isLoading, 
        isSuccess, 
        isError,
        error
    }] = useUpdateUserMutation()

    // initialize RTK query custom hooks mutation, and get the method and variables and rename it
    const [deleteUser, {
        isSuccess: isDelSuccess, 
        isError: isDelError,
        error: delError
    }] = useDeleteUserMutation()

    // initialize useNavigate hook
    const navigate = useNavigate()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)

    useEffect(() => {
        // validdate password using user regex
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        // validdate password using password regex
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess. isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = e => {
        // this approach is because we're allowing multiple roles to be selected form the mongoDB
        // get the selected roles and pass it to values variable
        const values = Array.from(
            e.target.selectedOptions, 
            (option) => option.value
        )
        setRoles(values)
    }

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ 
                id: user.id,
                username, 
                password, 
                roles, 
                active
             })
        } else {
            await updateUser({ 
                id: user.id,
                username, 
                roles, 
                active
             })
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    let canSave 

    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    return (
        <div>EditUserForm</div>
    )
}

export default EditUserForm