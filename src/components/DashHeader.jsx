import { useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
// rtk query generated custom hook
import { useSendLogoutMutation } from "../features/auth/authApiSlice"

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
    // initialize navigate and define pathname
    const navigate = useNavigate()
    const { pathname } = useLocation()

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

    // if (isLoading) return <p className="text-center">Logging out...</p> 

    if (isError) return <p>Error: {error.data?.message}</p>

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = 'mema'
    }

    const logoutButton = (
        <button
            type="button"
            className="btn btn-warning"
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

    const content = (
        <header>
            <div className={dashClass}>
                <Link to="/dash">
                    <h1 className="">techNotes</h1>
                </Link>
                <nav>
                    {/* add more nav buttons later */}
                    {logoutButton}
                </nav>
            </div>
        </header>
    )

    return content
}

export default DashHeader