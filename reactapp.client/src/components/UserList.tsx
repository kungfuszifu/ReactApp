import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {useAuth} from "./AuthProvider.tsx";
import {useNavigate} from "react-router-dom";

type user = {
    email: string;
    firstName: string;
    lastName: string;
}

type userDetails = {
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    birthDate: string;
    category: string;
}

type dictItem = {
    category: string;
    categorytype: string;
}

function UserList() {
    
    // Funkcje stanu zawierające informacje o danych użytkownika wyświetlanych w detalach lub
    // w formsach, zmienne które decydują o stanie formsa, listę użytkowników i danych słownikowych
    // oraz zmienna na szczegółowe dane 1 użytkownika
    
    const [show, setShow] = useState(false);
    const [userData, setUserData] = useState<user[]>();
    const [userDetails, setUserDetails] = useState<userDetails>();
    const [dict, setDict] = useState<dictItem[]>([]);

    const [edit, setEdit] = useState<boolean>(false);
    const [add, setAdd] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [birthdate, setBirthdate] = useState("")
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    // Funkcja wywołująca api w celu uzyskania listy użytkowników
    async function GetUsersList() {
        await fetch("/Api/userlist", {
            method: "GET",
            credentials: "include"
        }).then(response => {
            return response.json()
        }).then(data => {
            setUserData(data);
        }).catch(error => console.log(error))
    }

    // Funkcji wywołująca api w celu uzyskania szczegółowych danych użytkownika
    async function GetUserDetails(email: string) {
        await fetch("/Api/userDetails/" + email, {
            method: "GET",
            credentials: "include"
        }).then(response => {
            return response.json();
        }).then(data => {
            setUserDetails(data);
        }).catch(error => console.log(error))
    }

    // Funkcji wywołująca api w celu uzyskania danych słownikowych
    async function GetDict() {
        await fetch("/Api/dict", {
            method: "GET",
            credentials: "include"
        }).then(response => {
            return response.json();
        }).then(data => {
            setDict(data);
        }).catch(error => console.log(error))
    }

    // Funckja wywoływana podczas ładowania komponentu w celu uzyskania listy
    // użytkowników i danych słownikowych
    useEffect(() => {
        GetDict();
        GetUsersList();
    }, []);

    // Zbiór funkcji do zarządzania okienkiem formsa
    const handleClose = () => setShow(false);

    const handleShowAdd = () => {
        setShow(true);
        setEdit(true);
        setAdd(true);
    }
    const handleShow = async (email: string) => {
        GetUserDetails(email)
        setShow(true);
        setEdit(false);
        setAdd(false);
    }

    const handleShowEdit = (email: string) => {
        setEmail(email);
        setShow(true);
        setEdit(true);
        setAdd(false);
    }

    // Funckja przypisująca wartości z formsa do zmienncyh
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        console.log(name + " : " + value);
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "username") setUsername(value);
        if (name === "birthdate") setBirthdate(value);
        if (name === "lastname") setLastname(value);
        if (name === "firstname") setFirstname(value);
        if (name === "subcategory") setSubcategory(value);
    }

    // Funckja przypisująca wartości z formsa (<select>) do zmienncyh
    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = event.target;
        console.log(name + " : " + value);
        if (name === "category") {
            if (value === "private") setCategory(value);
            if (value === "business") setCategory(value);
            if (value === "other") setCategory(value);
        } else {
            setSubcategory(value);
        }
    }

    // Funkcja wywołująca api w celu usnięcia użytkownika
    const handleDelete = async (email: string) => {
        await fetch("/Api/userDelete/" + email, {
            method: "DELETE",
            credentials: "include"
        }).then(response => {
            return response.json();
        }).then(() => {
            window.location.reload();
        }).catch(error => console.log(error))
    }

    // Funkcja wywołująca api w celu aktualizacji / utworzenia użytkownika
    const handleUpdate = async () => {
        await fetch("/Api/userUpdate", {
            method: "PUT",
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
                category: category === "private" ? category : subcategory,
                lastname: lastname,
                firstname: firstname
            })
        }).then(response => { 
            return response.json()
        }).then(() => {
            window.location.reload();
        }).catch(error => console.log(error))
    }

    // Ciało strony, modyfikuje forms w zależności od przycisku który klikniemy
    return (
        <div className="center">
            <button onClick={handleShowAdd}>Create user</button>
            <table className="table">
                <thead>
                <tr>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                </tr>
                </thead>
                <tbody>
                {
                    userData && userData.length > 0 ?
                        userData.map(user => {
                            return (
                                <tr key={user.email}>
                                    <td>{user.email}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    {auth.user ?
                                        <td colSpan={2}>
                                            <button onClick={() => handleShow(user.email)}>Details</button>
                                            <button onClick={() => handleShowEdit(user.email)}>Edit</button>
                                            <button onClick={() => handleDelete(user.email)}>Delete</button>
                                        </td> : null
                                    }
                                </tr>
                            );
                        }) : null
                }
                </tbody>
            </table>
            <Modal show={show} onHide={handleClose} className="modal center">
                <Modal.Header>
                    <Modal.Title>{add ? <h1>Add User</h1> :
                        edit ? <h1>Modify User Details</h1> :
                            <h1>User Details </h1>
                    }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {edit && (
                        <div className="form-page">
                            <form>
                                {add && (
                                    <>
                                        <label htmlFor="email">Email</label>
                                        <input type="text" name="email" onChange={handleChange} required/>
                                        <br/></>
                                )}
                                <label htmlFor="username">User Name</label>
                                <input type="text" name="username" onChange={handleChange} required/>
                                <br/>
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" onChange={handleChange} required/>
                                <br/>
                                <label htmlFor="firstname">First Name</label>
                                <input type="text" name="firstname" onChange={handleChange} required/>
                                <br/>
                                <label htmlFor="lastname">Last Name</label>
                                <input type="text" name="lastname" onChange={handleChange} required/>
                                <br/>
                                <label htmlFor="category">Category</label>
                                <select name="category" onChange={handleSelect}>
                                    {dict && dict.length > 0 && (
                                        dict.map(dictItem => {
                                            return (
                                                dictItem.categorytype === "main" ?
                                                    <option value={dictItem.category}>{dictItem.category}</option> :
                                                    null
                                            );
                                        })
                                    )}
                                </select>
                                {category === "business" && (
                                    <>
                                        <label htmlFor="subcategory">Subcategory</label>
                                        <select name="subcategory" onChange={handleSelect}>
                                            {dict && dict.length > 0 && (
                                                dict.map(dictItem => {
                                                    return (
                                                        dictItem.categorytype === "sub" ?
                                                            <option
                                                                value={dictItem.category}>{dictItem.category}</option> :
                                                            null
                                                    );
                                                })
                                            )}
                                        </select>
                                    </>
                                )}
                                {category === "other" && (
                                    <>
                                        <label htmlFor="subcategory">Subcategory</label>
                                        <input type="text" name="subcategory" id="subcategory"
                                               onChange={handleChange} required/>
                                    </>
                                )}
                                <br/>
                                <label htmlFor="birthdate">Birth Date</label>
                                <input type="datetime-local" name="birthdate" onChange={handleChange} required/>
                                <br/>
                            </form>
                        </div>
                    )}
                    {!edit && (
                        <div>
                            <p>Email: {userDetails?.email} </p>
                            <p>User Name: {userDetails?.userName} </p>
                            <p>First Name: {userDetails?.firstName} </p>
                            <p>Last Name: {userDetails?.lastName} </p>
                            <p>Category: {userDetails?.category} </p>
                            <p>Birthdate: {userDetails?.birthDate.replace("T", " ").replace("Z", "")} </p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <br/>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {edit && !add && (
                        <Button variant="primary" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    )}
                    {add && (
                        <Button variant="primary" onClick={handleUpdate}>
                            Add User
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserList;