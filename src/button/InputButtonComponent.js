import React, { useState } from "react";

const InputButtonComponent = ({ onDeleteClick, onValueChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onValueChange(e.target.value);
  };

  const handleDeleteClick = () => {
    onDeleteClick();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="人物名を入力"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleDeleteClick}>×</button>
    </div>
  );
};

export default InputButtonComponent;
