import React, { useState, useMemo, useEffect } from "react";
import RadioButtonGroup from "./RadioButtonGroup";

function RadioButtonForm(props) {
  console.log("childBegin");
  const { questions, options } = props;
  const [selectedOptions, setSelectedOptions] = useState(
    questions.reduce((accumulator, value) => {
      return { ...accumulator, [value]: options[0] };
    }, {})
  );
  const initQuestionsGroupByOptions = options.reduce(
    (accumulator, value, idx) => {
      return { ...accumulator, [value]: idx === 0 ? questions.concat() : [] };
    },
    {}
  );
  const [questionsGroupByOptions, setQuestionsGroupByOptions] = useState(
    initQuestionsGroupByOptions
  );

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setSelectedOptions({
      ...selectedOptions,
      [name]: value,
    });
    setQuestionsGroupByOptions((prev) => updatetmp(prev, name, value));
  };

  const updatetmp = (prev, name, value) => {
    const beforeValue = selectedOptions[name];
    const index = prev[beforeValue].indexOf(name);
    prev[beforeValue].splice(index, 1);
    prev[value].push(name);
    return prev;
  };

  console.log("OK");

  const memoQuestions = useMemo(() => {
    const bbb = [];
    options.forEach((elem, idx) => {
      const target1 = questionsGroupByOptions[elem];
      target1.forEach((elem2) => {
        if (questions.includes(elem2)) {
          bbb.push(
            <RadioButtonGroup
              key={elem2}
              questionName={elem2}
              options={options}
              selectedOption={selectedOptions}
              onChange={handleOptionChange}
            />
          );
        }
      });
    });
    return bbb;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, selectedOptions]);

  console.log("childEnd");

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
