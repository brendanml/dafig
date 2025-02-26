import {useState} from 'react';
import us from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/dafig.png';

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
        <div className='login'>
            <div className="login-top">

            <div className="login-lhs">
                <img src={logo} alt="" />
                <p>the data you want, accessible.</p>
            </div>
            <div className="login-rhs">

                <form className='login-form' onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input placeholder='your email...' type="text" name="username" onChange={updateUsername} />
                    </label>
                    <label>
                        Password:
                        <input placeholder='your password...' type="password" name="password" onChange={updatePassword}/>
                    </label>
                    <div className="buttons">
                        <button className='button' type="submit" value={"register"}>Register</button>
                        <button className='button' type="submit" value={"login"}>Login</button>

                    </div>
                </form>
            </div>
            </div>
            <div className="login-bottom"></div>

        </div>
    )
}

export default Login