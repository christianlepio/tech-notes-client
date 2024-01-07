import { Link } from "react-router-dom"

const WelcomePage = () => {
    const date = new Date()
    // dedine date time today
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: "full", timeStyle: "long" }).format(date)

    const content = (
        <section>
            <p>{today}</p>
            <h1>Welcome!</h1>

            <p><Link to='/dash/notes'>View TechNotes</Link></p>
            <p><Link to='/dash/notes/new'>Add New TechNotes</Link></p>

            <p><Link to='/dash/users'>View User Settings</Link></p>
            <p><Link to='/dash/users/new'>Add New User</Link></p>
        </section>
    )

    return content
}

export default WelcomePage