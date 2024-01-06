import { useState, useEffect, useRef } from "react"
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

    const userRef = useRef()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [userFocus, setUserFocus] = useState(false)

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [pwdFocus, setPwdFocus] = useState(false)

    const [roles, setRoles] = useState(["Employee"])
    const [rolesFocus, setRolesFocus] = useState(false)

    useEffect(() => {
        //focus on username input when this component loads
        userRef.current.focus()
    }, [])

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

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ username, password, roles })
        }
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option key={role} value={role}>
                {role}
            </option>
        )
    })

    const validUsernameClass = username ? validUsername ? 'is-valid' : 'is-invalid' : null
    const validPwdClass = password ? validPassword ? 'is-valid' : 'is-invalid' : null
    const validRolesClass = Boolean(roles.length) ? 'is-valid' : 'is-invalid'

    // define the register content
    const content = (
        <>
            <section className="px-4 py-4 shadow border rounded-4 align-self-center">
                <div
                    className={'alert alert-danger ' + (isError ? null : 'd-none')}
                    role="alert"
                >
                    <div><i className="bi bi-exclamation-circle me-2"></i><strong>{error?.data?.message}</strong></div>
                </div>

                <h1 className="h1 mb-4 mt-2 text-center">User's Registration</h1>

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
                            required
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
                        <label htmlFor="rolesInput" class="form-label lead">Assigned Roles</label>
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
                                        ? ( <p>Password looks good!</p> ) 
                                        : ( <p>Please Select at least 1 role!</p> )
                                    : null
                            }
                        </div>
                    </div>

                    {/* save button */}
                    <div className="d-flex">
                        <button 
                            type="submit"
                            className="btn btn-success flex-grow-1 mt-2"
                            disabled={!canSave}
                        >
                            Submit User
                        </button>
                    </div>
                </form>
            </section>
        </>
    )

    return content
}

export default NewUserForm