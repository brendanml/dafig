import { useState } from 'react'
import axios from 'axios'
import PriceHistory from './PriceHistory'
import TypingDropdown from './TypingDropdown'
import Navbar from './Navbar'

const PriceGuide = ({user}) => {
  const [priceData, setPriceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

const api_call = async (searchTerm) => {
  setLoading(true);
  try {
    const res = await axios.get(`/api/price-guide/${searchTerm}`)
    // If successful, store the data
    setPriceData(res.data);
  } catch (error) {
    // Axios error object has a response if it's an HTTP error 
    if (error.response) {
      if (error.response.status === 401) {
        setError("Not logged in");
      } else {
        setError(`Request failed with status ${error.response.status}`);
      }
    } else {
      // Network or other error
      setError("Failed to fetch data");
    }
  } finally {
    setLoading(false);
  }
};

  
  return (
    <div>
      <Navbar user={user}/>
      <h1 className='dafig'>dafig</h1>
      <ul>
        <TypingDropdown api_call={api_call}/>
        {loading ? <p>Loading...</p> : null}
        {priceData ? <PriceHistory priceData={priceData}/> : null}
        {error? <p>{error}</p> : null}
      </ul>
    </div>
  )
}

export default PriceGuide