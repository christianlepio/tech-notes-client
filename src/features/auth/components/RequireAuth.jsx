// this component will allow/disallow end-users to access protected routes
import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../../hooks/useAuth" // this contains decoded user info from access token

const RequireAuth = ({ allowedRoles }) => {
    // get current location
    const location = useLocation()
    // get roles state
    const { roles } = useAuth()

    const content = (
        // will return true / false 
        roles.some(role => allowedRoles.includes(role))
            // if roles exist in the allowed roles then return child routes
            ? <Outlet />
            // if roles does not exist from allowed roles then navigate to the login page.
            // will allow to click back button and navigate to the previous route
            : <Navigate to='/login' state={{ from: location }} replace />
    )

    return content
}

export default RequireAuth