import {Navigate, Outlet} from 'react-router-dom'
import {useAuth} from "./AuthProvider.tsx";

// Component do przekierowania zalogowanych użytkowników
const Anonymous = () => {
    const auth = useAuth();

    return (
        auth.user ? <Navigate to="/" replace/> : <Outlet/>
    )
}

export default Anonymous
