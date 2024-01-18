import { Link } from "react-router-dom"
import useAuth from "../../../hooks/useAuth" // this contains decoded user info from access token 
import useTitle from "../../../hooks/useTitle"

const WelcomePage = () => {
    // this will change the document title on top, dynamically
    useTitle('Dashboard')

    const { username, isManager, isAdmin } = useAuth()

    const date = new Date()
    // dedine date time today
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: "full", timeStyle: "long" }).format(date)

    const content = (
        <section>
            <p>{today}</p>
            <h1>Welcome {username}!</h1>

            <p><Link to='/dash/notes'>View TechNotes</Link></p>
            <p><Link to='/dash/notes/new'>Add New TechNotes</Link></p>
            {
                (isManager || isAdmin) 
                    ? (
                        <>
                            <p><Link to='/dash/users'>View User Settings</Link></p>
                            <p><Link to='/dash/users/new'>Add New User</Link></p>
                        </>
                    )
                    : null
            }
        </section>
    )

    return content
}

export default WelcomePage