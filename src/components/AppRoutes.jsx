import { Routes, Route } from "react-router-dom"
// layout component
import Layout from "./Layout"
import PublicPage from "./PublicPage"
import Login from "../features/auth/components/Login"
import DashLayout from "./DashLayout"
import WelcomePage from "../features/auth/components/WelcomePage"
import NotesList from "../features/notes/components/NotesList"
import UsersList from "../features/users/components/UsersList"
import EditUser from "../features/users/components/EditUser"
import NewUserForm from "../features/users/components/NewUserForm"
import EditNote from "../features/notes/components/EditNote"
import NewNote from "../features/notes/components/NewNote"
import Prefetch from "../features/auth/components/Prefetch"
import PersistLogin from "../features/auth/components/PersistLogin"

const AppRoutes = () => {
    return (
        <Routes>
            {/* parent route */}
            <Route path="/" element={<Layout />}>
                {/* children routes here */}
                {/* public routes here */}
                {/* index keyword means this is the default page of the react app */}
                <Route index element={<PublicPage />}/>
                <Route path="login" element={<Login />} />

                <Route element={<PersistLogin />} >
                    <Route element={<Prefetch />} >
                        {/* protected routes below */}
                        <Route path="dash" element={<DashLayout />} >
                            {/* this is the index page for the protected routes */}
                            <Route index element={<WelcomePage />} />

                            <Route path="users">
                                <Route index element={<UsersList />} />
                                <Route path=":id" element={<EditUser />} />
                                <Route path="new" element={<NewUserForm />} />
                            </Route>

                            <Route path="notes">
                                <Route index element={<NotesList />} />
                                <Route path=":id" element={<EditNote />} />
                                <Route path="new" element={<NewNote />} />
                            </Route>

                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes