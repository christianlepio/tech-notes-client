import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <>
            {/* outlet here are the children routes */}
            <Outlet />
        </>
    )
}

export default Layout