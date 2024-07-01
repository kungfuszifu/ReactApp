import './App.css';

import Login from "./components/Login.tsx"
import Register from "./components/Register.tsx";
import Home from "./components/Home.tsx"
import UserList from "./components/UserList.tsx";
import Anonymous from "./components/Anonymous.tsx";
import Nav from "./components/Nav.tsx";
import {UserProvider} from "./components/AuthProvider.tsx";
import {Route, Routes} from "react-router-dom"

// Aplikacja jest owinieta w UserProvider który udostępnia wszystkim komponentom contex,
// który zawiera funkcje i zmienne do autentykacji

// Wszystkie elementy dziedziczące znajdują się w Route w celu ustalenia ich ścieżki URL

// Login i Register znajdują się wewnątrz elementu Anonymous, który blokuje dostęp do 
// tych stron jeżeli użytkownik jest zalogowany
function App() {
    return (
        <><UserProvider>
            <Nav />
            <div className="center">  
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<UserList />} />
                <Route element={<Anonymous />}> 
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
            </Routes>
            </div>
        </UserProvider>
        </>
    );
}

export default App;