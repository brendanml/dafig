import { useState, useEffect } from "react";

const PriceBar = ({ priceData, maxPrice }) => {
  const [newPrices, setNewPrices] = useState([]);
  const [scalingFactor, setScalingFactor] = useState(1);

  console.log("max price", maxPrice)

  useEffect(() => {
    // Parse prices when priceData changes
    const parse_prices = () => {
      const new_listing = priceData.stock.new.map((listing) => listing.price);
      setNewPrices(new_listing);
      setScalingFactor(50 / maxPrice);
    };

    parse_prices();
  }, [priceData]); // Runs only when `priceData` changes

  useEffect(() => {
    // Highlight listings when newPrices or scalingFactor changes
    const highlight_listings = () => {
      // Clear existing highlights
      document.querySelectorAll(".highlighted").forEach((el) =>
        el.classList.remove("highlighted")
      );

      // Add highlights for current newPrices
      newPrices.forEach((price) => {
        const div_to_highlight = Math.ceil(price * scalingFactor);
        const class_of_div = `.column-${div_to_highlight}`;
        // console.log("this is the div to highlight: ", class_of_div);
        const element = document.querySelector(class_of_div);
        if (element) {
          element.classList.add("highlighted");
        }
      });
    };

    if (newPrices.length > 0) {
      highlight_listings();
    }
  }, [newPrices, scalingFactor]); // Runs when `newPrices` or `scalingFactor` changes

  const log_prices = (column_num) => {
    console.log(column_num);
  }

  return (
    <div>
      {/* <p>Max Sold: {priceData.stats.sold_max_N}</p> */}
      {/* <h2>Available to Purchase</h2> */}
      <div className="price-bar">
        {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} onClick={()=>{log_prices(i)}} className={`price-bar-column column-${i}`}></div>
        ))}
      </div>
      {/* <p>Min Sold: {priceData.stats.sold_min_N}</p> */}
    </div>
  );
};

export default PriceBar;
