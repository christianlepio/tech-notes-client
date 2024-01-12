// use navigate to navigate to the next page
// use location to record the previous page before navigating to another page
import { useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth" // this contains decoded user info from access token 

const DashFooter = () => {
    const { username, status } = useAuth()
    // initialize useNavigate hook
    const navigate = useNavigate()
    // get the path name from use location hook
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/dash')

    // define content for home button
    // go home button will only appear if we are not in the root route '/dash'
    let goHomeButton = null 
    if (pathname !== '/dash') {
        goHomeButton = (
            <button
                className="btn btn-sm btn-primary rounded-3 px-3 mx-2"
                onClick={onGoHomeClicked}
            >
                <i className="bi bi-house-door"></i> Home
            </button>
        )
    }

    const content = (
        <footer className="py-5">
            <div className="d-flex justify-content-start">
                {goHomeButton}
                <p className="mx-4">Current User: {username}</p>
                <p className="mx-4">Status: {status}</p>
            </div>
        </footer>
    )

    return content
}

export default DashFooter