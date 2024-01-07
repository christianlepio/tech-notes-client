import { useState, useEffect, useRef } from "react"
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

    const userRef = useRef()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [userFocus, setUserFocus] = useState(false)

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [pwdFocus, setPwdFocus] = useState(false)

    const [roles, setRoles] = useState(user.roles)
    const [rolesFocus, setRolesFocus] = useState(false)

    const [active, setActive] = useState(user.active)

    useEffect(() => {
        //focus on username input when this component loads
        userRef.current.focus()
    }, [])

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
        e.preventDefault()

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

    const options = Object.values(ROLES).map(role => {
        return (
            <option key={role} value={role}>
                {role}
            </option>
        )
    })

    let canSave 

    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    const validUsernameClass = username ? validUsername ? 'is-valid' : 'is-invalid' : null
    const validPwdClass = password ? validPassword ? 'is-valid' : 'is-invalid' : null
    const validRolesClass = Boolean(roles.length) ? 'is-valid' : 'is-invalid'

    // define error either from update error or delete error
    // using Nullish coalescing, this will returns blank errContent if update/delete error is undefined
    const errContent = (error?.data?.message || delError?.data?.message) ?? ''

    const content = (
        <>
            <section className="px-4 py-4 shadow border rounded-4 align-self-center">
                <div
                    className={'alert alert-danger ' + ((isError || isDelError) ? null : 'd-none')}
                    role="alert"
                >
                    <div><i className="bi bi-exclamation-circle me-2"></i><strong>{errContent}</strong></div>
                </div>

                <h1 className="h1 mb-4 mt-2 text-center">Update User Details</h1>

                <form onSubmit={onSaveUserClicked}>

                    {/* username input */}
                    <div className="mb-3">
                        <label htmlFor="usernameInput" className="form-label lead">Username</label>
                        <input 
                            type="text" 
                            id="usernameInput"
                            placeholder="Enter username here:"
                            className={`form-control mb-1 ${validUsernameClass}`}
                            ref={userRef}
                            autoComplete="off" //to avoid auto suggestion of values from the input
                            value={username}
                            onChange={onUsernameChanged}
                            onFocus={() => setUserFocus(true)} //this will be the indicator if the screen is focused on username input
                            onBlur={() => setUserFocus(false)} //this will be the indicator if the screen is not focused on username input
                            required
                        />

                        <div className={userFocus ? validUsernameClass === 'is-valid' ? 'valid-feedback' : 'invalid-feedback' : null}>
                            {userFocus 
                                ? validUsernameClass === 'is-valid'
                                    ? ( <p>Username looks good!</p> )
                                    : ( <p>
                                            Username should be at least 3 to 20 letters long.
                                        </p> )
                                : null
                            }
                        </div>
                    </div>

                    {/* passwod input */}
                    <div className="mb-3">
                        <label htmlFor="pwdInput" className="form-label lead">Password</label>
                        <input 
                            type="password" 
                            id="pwdInput"
                            placeholder="Enter password here:" 
                            className={`form-control mb-1 ${validPwdClass}`}
                            value={password}
                            onChange={onPasswordChanged}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />

                        <div className={pwdFocus ? validPwdClass === 'is-valid' ? 'valid-feedback' : 'invalid-feedback' : null}>
                            {pwdFocus 
                                ? validPwdClass === 'is-valid'
                                    ? ( <p>Password looks good!</p> )
                                    : ( <p>
                                            Password should be at least 4 to 12 characters long. <br/> 
                                            Allowed special characters: ! @ # $ %  
                                        </p> )
                                : null
                            }
                        </div>
                    </div>

                    {/* select roles option */}
                    <div className="mb-3">
                        <label htmlFor="rolesInput" className="form-label lead">Assigned Roles</label>
                        <select 
                            className={`form-select ${validRolesClass}`} 
                            id="rolesInput"
                            name="rolesInput" 
                            aria-describedby="rolesInputFeedback" 
                            multiple={true} // this allows us to select multiple options
                            size='3' // this will diplay maximum of 3 values in the input
                            value={roles}
                            onChange={onRolesChanged}
                            onFocus={() => setRolesFocus(true)}
                            onBlur={() => setRolesFocus(false)}
                        >
                            {options}
                        </select>

                        <div 
                            id="rolesInputFeedback" 
                            className={rolesFocus ? validRolesClass === 'is-valid' ? 'valid-feedback' : 'invalid-feedback' : null}
                        >
                            {
                                rolesFocus 
                                    ? validRolesClass === 'is-valid'
                                        ? ( <p>User role/s looks good!</p> ) 
                                        : ( <p>Please Select at least 1 role!</p> )
                                    : null
                            }
                        </div>
                    </div>
                    
                    {/* checkbox for active */}
                    <div className="mb-3">
                        <div className="form-check form-switch">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                role="switch" 
                                id="flexSwitchCheckDefault" 
                                checked={active}
                                onChange={onActiveChanged}
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"> Active</label>
                        </div>
                    </div>

                    {/* save button */}
                    <div className="d-flex">
                        <button 
                            type="submit"
                            className="btn btn-success flex-grow-1 mt-2"
                            disabled={!canSave}
                        >
                            Save User
                        </button>
                    </div>

                    {/* delete button */}
                    <div className="d-flex">
                        <button 
                            type="button"
                            className="btn btn-warning flex-grow-1 mt-2"
                            onClick={onDeleteUserClicked}
                        >
                            Delete User
                        </button>
                    </div>
                </form>
            </section>
        </>
    )

    return content
}

export default EditUserForm