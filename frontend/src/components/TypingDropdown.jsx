import axios from "axios";
import React, { useEffect, useState } from "react";

function TypingDropdown({ api_call }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false); // Track input focus

  useEffect(() => {
    axios
      .get("/api/items")
      .then((res) => {
        setOptions(res.data);
        setFilteredOptions(res.data);
      })
      .catch((error) => console.error("Error fetching items:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredOptions(
      options.filter((option) =>
        option.ITEMNAME.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setSearchTerm(option.ITEMNAME);
    setFilteredOptions([]);
    setIsFocused(false); // Close dropdown

    api_call(option.ITEMID);
  };

  return (
    <div
      style={{ width: "400px", margin: "20px auto", fontFamily: "Arial, sans-serif", position: "relative" }}
      onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow click event
    >
      {loading ? (
        <p>Loading options...</p>
      ) : (
        <>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            placeholder="Type to search..."
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {isFocused && filteredOptions.length > 0 && (
            <ul
              style={{
                listStyleType: "none",
                margin: 0,
                padding: 0,
                border: "1px solid #ccc",
                borderTop: "none",
                borderRadius: "0 0 4px 4px",
                maxHeight: "150px",
                overflowY: "auto",
                backgroundColor: "#fff",
                position: "absolute",
                width: "100%",
                zIndex: 1,
              }}
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    color: "#333",
                    borderBottom:
                      index === filteredOptions.length - 1 ? "none" : "1px solid #ccc",
                  }}
                >
                  {option.ITEMNAME}
                </li>
              ))}
            </ul>
          )}
          {/* {selectedOption && (
            // <p style={{ marginTop: "10px" }}>
            //   Selected: <strong>{selectedOption.ITEMNAME}</strong> (ID:{" "}
            //   {selectedOption.ITEMID})
            // </p>
          )} */}
        </>
      )}
    </div> 
  );
}

export default TypingDropdown;
