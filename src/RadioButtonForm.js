import React, { useState, useMemo } from "react";
import RadioButtonGroup from "./RadioButtonGroup";

function RadioButtonForm() {
  const questionLists = ["option1", "option2"];
  const [selectedOptions, setSelectedOptions] = useState({});
  // const [selectedOptions, setSelectedOptions] = useState({
  //   option1: "",
  //   option2: "",
  // });

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

  const memoItemList = useMemo(() => {
    if (questionLists.length > 0) {
      return questionLists.map((item, index) => (
        <RadioButtonGroup
          questionName={item}
          options={options}
          selectedOption={selectedOptions}
          onChange={handleOptionChange}
        />
      ));
    } else {
      return <div>該当するアイテムはありません</div>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionLists]);

  return (
    <form onSubmit={handleSubmit}>
      {memoItemList}
      <button type="submit">送信</button>
    </form>
  );
}

export default RadioButtonForm;
