import { useRef, useState, useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom'

import { useDispatch } from "react-redux" // this enables to perform the setCredentials action
import { setCredentials } from "../authSlice" // this will set the access token
// RTK query custom hook
// will return the refresh token in the cookie and access token
import { useLoginMutation } from "../authApiSlice" 

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')

    // initialize navigate & dispatch function
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // get login rtk query and isLoading state
    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [username, password])

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePasswordInput = (e) => setPassword(e.target.value)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // perform login method and pass required params
            // use unwrap which throws an error and lets you catch the error
            // this lets the promise either reject/creates an error and allow to use try catch logic
            const { accessToken } = await login({ username, password }).unwrap()

            // setCredentials reducer needs to be called inside the dispath function to perform it
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            navigate('/dash')
        } catch (err) {
            console.log('Login error: ', err)
            if (!err.status) {
                console.log('No server response!')
                setErrMsg('No server response!')
            } else if (err.status === 400) {
                setErrMsg('Missing username or password')
            } else if (err.status === 401) {
                setErrMsg('Unauthorized!')
            } else {
                setErrMsg(err.data?.message)
            }

            errRef.current.focus()
        }
    }

    const content = (
        <main className="d-flex justify-content-center">
            <section className="px-4 py-4 shadow border rounded-4 align-self-center">
                <div
                    className={'alert alert-danger ' + (errMsg ? null : 'd-none')}
                    role="alert"
                    ref={errRef}
                >
                    <div><i className="bi bi-exclamation-circle me-2"></i><strong>{errMsg}</strong></div>
                </div>

                <h1 className="h1 mb-4 mt-2 text-center">User Login</h1>

                <form onSubmit={handleSubmit}>

                    {/* username input */}
                    <div className="mb-3">
                        <label htmlFor="usernameInput" className="form-label lead">Username</label>
                        <input 
                            type="text" 
                            id="usernameInput"
                            placeholder="Enter username here:"
                            className='form-control mb-1'
                            ref={userRef}
                            autoComplete="off" //to avoid auto suggestion of values from the input
                            value={username}
                            onChange={handleUserInput}
                            required
                        />
                    </div>

                    {/* username input */}
                    <div className="mb-3">
                        <label htmlFor="pwdInput" className="form-label lead">Password</label>
                        <input 
                            type="password" 
                            id="pwdInput"
                            placeholder="Enter password here:" 
                            className='form-control mb-1'
                            value={password}
                            onChange={handlePasswordInput}
                            required
                        />
                    </div>

                    {/* login button */}
                    <div className="d-flex mb-3">
                        <button 
                            type="submit"
                            className="btn btn-success flex-grow-1 mt-2"
                            disabled={isLoading ? true : false}
                        >
                            {isLoading ? 'Loading...' : 'Login'}
                        </button>
                    </div>

                    <div className="mb-3 text-center">
                        <Link to='/'>Back to Home</Link>
                    </div>
                </form>
            </section>
        </main>
    )

    return content
}

export default Login