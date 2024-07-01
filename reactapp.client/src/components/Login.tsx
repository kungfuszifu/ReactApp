import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "./AuthProvider.tsx";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        if (auth.user) {
            navigate("/");
        }
    }, []);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
    }

    return (
        <div className="form-page">
            <h1>Login Page</h1>

            <form onSubmit={loginHandler}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" onChange={handleChange} required/>
                <br/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" onChange={handleChange} required/>
                <br/>
                <button type="submit">Login</button>
            </form>
        </div>
    );

    async function loginHandler(e) {
        e.preventDefault();

        auth.login(email, password);
    }
}

export default Login;