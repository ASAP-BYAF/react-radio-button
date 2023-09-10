import React, { useState } from "react";

function RadioButtonForm() {
  const [selectedOptions, setSelectedOptions] = useState({
    option1: "",
    option2: "",
  });

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setSelectedOptions({
      ...selectedOptions,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // フォームが送信された際の処理をここに追加します
    console.log("選択したオプション1:", selectedOptions.option1);
    console.log("選択したオプション2:", selectedOptions.option2);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          質問1: オプション1
          <input
            type="radio"
            name="option1"
            value="option1"
            checked={selectedOptions.option1 === "option1"}
            onChange={handleOptionChange}
          />
        </label>
        <label>
          オプション2
          <input
            type="radio"
            name="option1"
            value="option2"
            checked={selectedOptions.option1 === "option2"}
            onChange={handleOptionChange}
          />
        </label>
      </div>
      <div>
        <label>
          質問2: オプションA
          <input
            type="radio"
            name="option2"
            value="optionA"
            checked={selectedOptions.option2 === "optionA"}
            onChange={handleOptionChange}
          />
        </label>
        <label>
          オプションB
          <input
            type="radio"
            name="option2"
            value="optionB"
            checked={selectedOptions.option2 === "optionB"}
            onChange={handleOptionChange}
          />
        </label>
      </div>
      <button type="submit">送信</button>
    </form>
  );
}

export default RadioButtonForm;
