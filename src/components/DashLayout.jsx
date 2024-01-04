import { Outlet } from "react-router-dom"
// components
import DashHeader from "./DashHeader"
import DashFooter from "./DashFooter"

const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <main className="d-flex justify-content-start mt-5">
                {/* these are the children protected routes */}
                <Outlet />
            </main>
            <DashFooter />
        </>
    )
}

export default DashLayout