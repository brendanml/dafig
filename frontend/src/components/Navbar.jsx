import useState from 'react'

const Navbar = ({user}) => {

    return (
        <nav>
            <h1>Home</h1>
            <div></div>
            <div className="links">
                <ul>
                    <li>Browse</li>
                    <li>Template</li>
                    <li className='username'>{user}</li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;