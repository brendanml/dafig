import axios from 'axios';

const register = (user)=> {
    console.log("hitting register")
    const req = axios.post("/api/register", user);
    return req.then(res => res.data);
}

const login = async (user)=> {
    console.log("hitting login")
    const req = axios.post("/api/login", user, {withCredentials: true});
    return req.then(res => res.data);
}

export default {register, login}
