import { Outlet } from "react-router-dom"
// components
import DashHeader from "./DashHeader"
import DashFooter from "./DashFooter"

const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div className="d-flex justify-content-center">
                {/* these are the children protected routes */}
                <Outlet />
            </div>
            <DashFooter />
        </>
    )
}

export default DashLayout