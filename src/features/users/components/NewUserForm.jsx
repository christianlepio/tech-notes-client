import { useState, useEffect } from "react"
// generated custom hook from rtk query
import { useAddNewUserMutation } from "../usersApiSlice"
import { useNavigate } from "react-router-dom"
import { ROLES } from '../../../config/roles'

// standard username character
const USER_REGEX = /^[A-z]{3,20}$/
// standard password character
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {

    // initialize RTK query custom hooks mutation, and get the method and variables
    const [addNewUser, {
        isLoading, 
        isSuccess, 
        isError, 
        error
    }] = useAddNewUserMutation()

    // initialize useNavigate hook
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(["Employee"])

    // validdate username using user regex
    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    // validdate password using user regex
    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    // if success then navigate back to the users page
    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUserNameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = e => {
        // this approach is because we're allowing multiple roles to be selected form the mongoDB
        const values = Array.from(
            e.target.selectedOptions, 
            (option) => option.value
        )
        setRoles(values)
    }

    return (
        <div>NewUserForm</div>
    )
}

export default NewUserForm