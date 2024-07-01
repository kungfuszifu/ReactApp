import {Link} from "react-router-dom";
import {useAuth} from "./AuthProvider.tsx";
import "../css/Nav.css"

// Belka do nawigacji, chowa przyciski do logowania/rejstracji dla zalogowanego użytkownika
function Nav() {
    const auth = useAuth();

    return (
        <nav className="nav">
            <Link to="/" className="site-title">ReactApp</Link>
            <ul>
                <Link to="/users">Users</Link>
                {
                    auth.user ? <button onClick={auth.logout} className="btn">Logout</button> :
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                }
            </ul>
        </nav>
    )
}

export default Nav;