import React, { useState } from "react";

const InputButtonComponent = ({ onDeleteClick }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDeleteClick = () => {
    onDeleteClick();
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleDeleteClick}>Delete</button>
    </div>
  );
};

export default InputButtonComponent;
