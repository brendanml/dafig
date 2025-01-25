import useState from 'react'
import axios from 'axios'

const AdminPanel = ({user}) => {
    const deleteAll = async () => {
        const res = await axios.post('/api/delete-all')
    }
    return (
        <>
            <h1>Admin Panel</h1>
            <div>
                <button onClick={deleteAll}>Delete All Users</button>
            </div>
        </>
    )
}

export default AdminPanel