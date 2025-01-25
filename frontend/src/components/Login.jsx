import {useState} from 'react';
import us from '../services/UserService';
import { useNavigate } from 'react-router-dom';

const Login = ({setUser}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const updateUsername = (e) => {
        setUsername(e.target.value);
        logUser();
    }

    const updatePassword = (e) => {
        setPassword(e.target.value);
        logUser();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.nativeEvent.submitter.value);
        if(e.nativeEvent.submitter.value === "register"){
            register();
        } else {
            login();
        }
    }

    const register = (e) => {
        us.register({username, password}).then((res) => {
            // console.log(res);
            return
        })

        console.log("ending frontend of reg")
    }

    const login = async (e) => {
        us.login({username, password}).then((res) => {
            // console.log(res);
            return
        }).then(res => {
            console.log("Navigating to /price-guide...")
            setUser(username);
            navigate('/price-guide')
        }
        )
    }
    // LOGGING
    const logUser = () => {
        // console.log(username, password);
    }


    return (
        <>
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" name="username" onChange={updateUsername} />
            </label>
            <label>
                Password:
                <input type="password" name="password" onChange={updatePassword}/>
            </label>
            <button type="submit" value={"register"}>Register</button>
            <button type="submit" value={"login"}>Login</button>
        </form>
        </>
    )
}

export default Login