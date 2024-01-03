import { Routes, Route } from "react-router-dom"
// layout component
import Layout from "./Layout"
import PublicPage from "./PublicPage"
import Login from "../features/auth/components/Login"
import DashLayout from "./DashLayout"
import WelcomePage from "../features/auth/components/WelcomePage"

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

                {/* protected routes below */}
                <Route path="dash" element={<DashLayout />} >
                    {/* this is the index page for the protected routes */}
                    <Route index element={<WelcomePage />} />

                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes