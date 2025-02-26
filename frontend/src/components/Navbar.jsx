import useState from 'react'
import TypingDropdown from './TypingDropdown';
import { useNavigate } from 'react-router-dom';

const Navbar = ({user, api_call}) => {
    const nav = useNavigate();
    const style = {
        cursor: 'pointer'
    }
    return (
        <nav>
            <h1 style={style} onClick={()=> {nav("/login")}} className='dafig'>dafig</h1>
            <TypingDropdown api_call={api_call}/>
            <div className="links">
                <ul>
                    <li className='username'>{user}</li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;