import { useSelector } from "react-redux"
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from 'jwt-decode' // to decrypt access token and get the info

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false 
    let isAdmin = false 
    let status = "Employee"

    if (token) {
        const decoded = jwtDecode(token) // decode the access token
        const { username, roles } = decoded.UserInfo // get data from decoded user info

        isManager = roles.includes('Manager')
        isAdmin = roles.includes('Admin')

        if (isManager) status = 'Manager'
        if (isAdmin) status = 'Admin'
        
        return {
            username, 
            roles, 
            status, 
            isManager, 
            isAdmin
        }
    }
    
    // if access token not exist
    return { 
        username: '', 
        roles: [], 
        isManager, 
        isAdmin, 
        status
    }

}

export default useAuth