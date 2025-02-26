import { useState } from 'react'
import axios from 'axios'
import PriceHistory from './PriceHistory'
import Navbar from './Navbar'
import TypingDropdown from './TypingDropdown'

const PriceGuide = ({user}) => {
  const [priceData, setPriceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [listings, setListings] = useState(null)

  const styles ={
    attention: {
      fontSize: '1.5em',
      width: '700px',
      backgroundColor: 'rgba(255, 0, 0, 0.7)',
      borderRadius: '5px',
      padding: '10px',
      margin: '0 6rem',
      boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
      textAlign: 'center',
      color: "white"
    }
  }

const api_call = async (searchTerm) => {
  setLoading(true);
  try {
    const res = await axios.get(`/api/price-guide/${searchTerm}`)
    // If successful, store the data
    setPriceData(res.data);

    const listings = await axios.get(`/api/listings/${searchTerm}`)
    setListings(listings.data)
    console.log(listings.data)  
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
      <Navbar user={user} api_call={api_call}/>
      <div className="suggestions"></div>
      <div className='price-guide'>
        {loading ? <p>Loading...</p> : null}
        {priceData ? <PriceHistory priceData={priceData} listings={listings}/> :         <div style={styles.attention} className="attention">
          <p><strong>Attention</strong>: Due to bricklinks enforced limitations dafig is no longer able to operate. </p>
          <p style={{color: "white"}}>Data is accurate as of a snapshot taken on Feb 22nd 2025.</p>
          </div>}
        <h1 style={{paddingTop: '5rem'}} className='cta'>&uarr;search any minifig in the search bar above :) &uarr;</h1>
        {error? <p>{error}</p> : null}
        </div>
      </div>
  )
}

export default PriceGuide