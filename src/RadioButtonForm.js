import React, { useState } from "react";
import RadioButtonGroup from "./RadioButtonGroup";

function RadioButtonForm() {
  const [selectedOptions, setSelectedOptions] = useState({});

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

  const options = ["Option 1", "Option 2", "Option 3"];
  // const [selectedOption, setSelectedOption] = useState("");
  // const handleOptionChange2 = (event) => {
  //   setSelectedOption(event.target.value);
  // };
  return (
    <form onSubmit={handleSubmit}>
      <RadioButtonGroup
        questionName="option1"
        options={options}
        selectedOption={selectedOptions}
        onChange={handleOptionChange}
      />
      <RadioButtonGroup
        questionName="option2"
        options={options}
        selectedOption={selectedOptions}
        onChange={handleOptionChange}
      />
      <button type="submit">送信</button>
    </form>
  );
}

export default RadioButtonForm;
