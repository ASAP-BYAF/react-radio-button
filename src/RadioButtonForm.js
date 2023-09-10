import React, { useState, useMemo } from "react";
import RadioButtonGroup from "./RadioButtonGroup";

function RadioButtonForm(props) {
  const { questions, options } = props;
  const [selectedOptions, setSelectedOptions] = useState({});
  // const questions = ["option1", "option2"];
  // const options = ["Option1", "Option2", "Option3"];
  console.log(questions, options);

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setSelectedOptions({
      ...selectedOptions,
      [name]: value,
    });
  };

  const memoQuestions = useMemo(() => {
    if (questions.length > 0) {
      return questions.map((item, idx) => (
        <RadioButtonGroup
          key={idx}
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
  }, [questions, selectedOptions]);

  return (
    <form
      onSubmit={() => {
        console.log("submitted");
      }}
    >
      {memoQuestions}
      <button type="submit">送信</button>
    </form>
  );
}

export default RadioButtonForm;
