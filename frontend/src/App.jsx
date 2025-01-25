import { useState } from 'react'
import axios from 'axios'
import './App.css'
import { useEffect } from 'react'
import PriceGuide from './components/PriceGuide'
import TypingDropdown from './components/TypingDropdown'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import AdminPanel from './components/AdminPanel'


function App() {
  const [user, setUser] = useState("Sign In")

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get('/api/user')
      if(res.data){
        setUser(res.data)
      } else {
        console.log('no user')
      }
    }
    fetchUser()
  }, [])
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser}/>}/>
          <Route path="/price-guide" element={<PriceGuide user={user}/>}/>
          <Route path="/admin-panel" element={<AdminPanel user={user}/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
