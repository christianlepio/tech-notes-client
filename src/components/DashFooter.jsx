// use navigate to navigate to the next page
// use location to record the previous page before navigating to another page
import { useNavigate, useLocation } from "react-router-dom"

const DashFooter = () => {
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
                className="btn btn-primary rounded-3 px-3"
                onClick={onGoHomeClicked}
            >
                <i className="bi bi-house-door"></i> Home
            </button>
        )
    }

    const content = (
        <footer className="py-5">
            {goHomeButton}
            <p>Current User: </p>
            <p>Status: </p>
        </footer>
    )

    return content
}

export default DashFooter