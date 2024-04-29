import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute({ isAllowed, redirectTo = "/", children }: any) {
    if (!isAllowed) {
        return <Navigate to={redirectTo} />
    }
    return children ? children : <Outlet />
}