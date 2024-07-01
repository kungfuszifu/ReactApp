import {useAuth} from "./AuthProvider.tsx";

function Home() {
    const user = useAuth();

    return (
        <div>
            <h1> Home page </h1>
            <p> {user.user} </p>
        </div>
    );
}

export default Home;