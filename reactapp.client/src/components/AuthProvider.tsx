import React, {createContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

// Typ definiujący context udostępniany innym komponentom
type UserContext = {
    user: string;
    login: (email: string,
            password: string) => void;
    register: (email: string,
               password: string,
               username: string,
               birthdate: string,
               category: string,
               lastname: string,
               firstname: string) => void,
    logout: () => void;
}

const UserContext = createContext<UserContext>({} as UserContext);

export const UserProvider = ({children}: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<string>("");
    const [ready, setReady] = useState(false);

    // Po załadowaniu elementu sprawdza czy ma zapisane cookie
    useEffect(() => {
        fetch("/Api/pingauth", {
            method: "GET",
            credentials: "include"
        }).then(response => response.json()).then(data => {
            setUser(data.userEmail)
        }).catch(() => {
            setUser("");
        })
        setReady(true);
    }, []);

    // Funkcja wykonująca call do logwania w api
    const login = async (
        email: string,
        password: string
    ) => {
        await fetch("/Api/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(response => {
            if (response.ok) {
                sessionStorage.setItem("user", email)
                setUser(email);
                navigate('/')
            }
        }).catch(error => console.log(error))
    }

    // Funkcja wywołująca call do rejestracji w api
    const register = async (
        email: string,
        password: string,
        username: string,
        birthdate: string,
        category: string,
        lastname: string,
        firstname: string
    ) => {
        await fetch("/Api/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
                username: username,
                birthdate: birthdate + "Z",
                category: category,
                lastname: lastname,
                firstname: firstname
            })
        }).then(response => {
            if (response.ok) {
                navigate('/login')
            }
        }).catch(error => console.log(error))
    }

    // Funkcja wywołująca call do wylogwania w api
    const logout = () => {
        fetch("/Api/logout", {
            method: "POST",
            credentials: "include"
        }).then(response => {
            if (response) {
                sessionStorage.removeItem("user");
                setUser("");
                navigate("/");
            }
        }).catch(error => console.log(error))
    }

    return (
        <UserContext.Provider value={{user, login, register, logout}}>
            {ready ? children : null}
        </UserContext.Provider>
    )
}

export const useAuth = () => React.useContext(UserContext);
