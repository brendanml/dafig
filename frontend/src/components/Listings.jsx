import { useState } from "react";
import bricklink from "../assets/bricklink.png";

const Listings = ({ listings, user }) => {
    return (
        <div className="listings">
            <ul>
                {listings.length > 0 ? (
                    listings.slice(0,8).map((listing) => (
                                <a href={`https://${listing.url}`} target="_blank" rel="noopener noreferrer">
                        <li key={listing._id} className="listing-item">
                            <p>{listing.condition}</p>
                            <p>{listing.price}</p>
                            <p><strong>Quantity:</strong> {listing.quantity}</p>
                            <p>
                                    <img src={bricklink} alt="" />
                            </p>
                        </li>
                                </a>
                    ))
                ) : (
                    <p>No listings available.</p>
                )}
            </ul>
        </div>
    );
};

export default Listings;
