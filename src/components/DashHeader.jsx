import { useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
// rtk query generated custom hook
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import useAuth from "../hooks/useAuth" // contains decoded user info

const DASH_REGEX = /^\/dash(\/)?$/ // dash welcome page path
const NOTES_REGEX = /^\/dash\/notes(\/)?$/ // notes list path
const USERS_REGEX = /^\/dash\/users(\/)?$/ // users list path

const DashHeader = () => {
    // get state from useAuth
    const { isManager, isAdmin } = useAuth()

    // initialize navigate and define pathname
    const navigate = useNavigate()
    const { pathname } = useLocation()

    console.log('pathname: ', pathname)

    const [sendLogout, { 
        isLoading, 
        isSuccess, 
        isError, 
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) {
            console.log('success logout')
            navigate('/')
        }
    }, [isSuccess, navigate])

    const onNewNoteCliked = () => navigate('/dash/notes/new')
    const onNewUserCliked = () => navigate('/dash/users/new')
    const onNotesCliked = () => navigate('/dash/notes')
    const onUsersCliked = () => navigate('/dash/users')

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = 'mema'
    }

    let newNoteButton = null
    if (NOTES_REGEX.test(pathname)) { // if pathname is in the notes list then display create new note button
        newNoteButton = (
            <button 
                className="btn btn-primary mx-2"
                title="New note"
                onClick={onNewNoteCliked}
            >
                Add new note
            </button>
        )
    }

    let newUserButton = null
    if (USERS_REGEX.test(pathname)) { // if pathname is in the users list then display create new user button
        newUserButton = (
            <button 
                className="btn btn-primary mx-2"
                title="New user"
                onClick={onNewUserCliked}
            >
                Add new user
            </button>
        )
    }

    let usersButton = null 
    if (isManager || isAdmin) { // if current user is a manager or admin
        // if pathname not equal to user regex or not in the users list page and path name does includes '/dash'
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) { 
            usersButton = (
                <button 
                    className="btn btn-primary mx-2"
                    title="Users list"
                    onClick={onUsersCliked}
                >
                    Users list
                </button>
            )
        }
    }

    let notesButton = null
    // if pathname not equal to user regex or not in the notes list page and path name does includes '/dash'
    if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
        notesButton = (
            <button 
                className="btn btn-primary mx-2"
                title="Notes list"
                onClick={onNotesCliked}
            >
                Notes list
            </button>
        )
    }

    const logoutButton = (
        <button
            type="button"
            className="btn btn-warning mx-2"
            onClick={sendLogout}
            disabled={isLoading ? true : false}
        >
            {isLoading 
                ? ( 
                    <>  
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span role="status"> Loading...</span> 
                    </> 
                )
                : ( <>Logout</> )
            }
        </button>
    )

    if (isError) return <p>Error: {error?.data?.message}</p>

    const buttonContent = (
        <>
            {newNoteButton}
            {newUserButton}
            {notesButton}
            {usersButton}
            {logoutButton}
        </>
    )

    const content = (
        <header>
            <div className={dashClass}>
                <Link to="/dash">
                    <h1 className="">techNotes</h1>
                </Link>
                <nav>
                    {buttonContent}
                </nav>
            </div>
        </header>
    )

    return content
}

export default DashHeader