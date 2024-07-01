import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "./AuthProvider.tsx";


type dictItem = {
    category: string;
    categorytype: string;
}
function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [birthdate, setBirthdate] = useState("")
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");

    const [dict, setDict] = useState<dictItem[]>([]);
    const navigate = useNavigate()
    const auth = useAuth();

    useEffect(() => {
        if (auth.user) {
            navigate("/");
        }
        GetDict();
    }, []);

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
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "username") setUsername(value);
        if (name === "birthdate") setBirthdate(value);
        if (name === "lastname") setLastname(value);
        if (name === "firstname") setFirstname(value);
        if (name === "subcategory") setSubcategory(value);
    }

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = event.target;
        if (name === "category") {
            if (value === "private") setCategory(value);
            if (value === "business") setCategory(value);
            if (value === "other") setCategory(value);
        } else {
            setSubcategory(value);
        }
    }

    return (
        <div className="form-page">
            <h1>Register Page</h1>
            <form onSubmit={registerHandler}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" onChange={handleChange} required/>
                <br/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" onChange={handleChange} required/>
                <br/>
                <label htmlFor="username">User Name</label>
                <input type="text" name="username" id="username" onChange={handleChange} required/>
                <br/>
                <label htmlFor="firstname">First Name</label>
                <input type="text" name="firstname" id="firstname" onChange={handleChange} required/>
                <br/>
                <label htmlFor="lastname">Last Name</label>
                <input type="text" name="lastname" id="lastname" onChange={handleChange} required/>
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
                <input type="datetime-local" name="birthdate" id="birthdate" onChange={handleChange} required/>
                <br/>
                <button type="submit">Register</button>
            </form>
        </div>
    );

    async function registerHandler(e) {
        e.preventDefault();

        auth.register(
            email,
            password,
            username,
            birthdate,
            category === "private" ? category : subcategory,
            lastname,
            firstname
        )
    }
}

export default Register;