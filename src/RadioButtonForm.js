import React, { useState, useMemo, useEffect } from "react";
import RadioButtonGroup from "./RadioButtonGroup";

function RadioButtonForm(props) {
  const { questions, options } = props;
  const [selectedOptions, setSelectedOptions] = useState(
    questions.reduce((accumulator, value) => {
      return { ...accumulator, [value]: options[0] };
    }, {})
  );
  const initQuestionsGroupByOptions = options.reduce((accumulator, value) => {
    return { ...accumulator, [value]: [] };
  }, {});
  // console.log("init");
  // console.log(initQuestionsGroupByOptions);
  const [questionsGroupByOptions, setQuestionsGroupByOptions] = useState(
    initQuestionsGroupByOptions
  );

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setSelectedOptions({
      ...selectedOptions,
      [name]: value,
    });
  };

  const memoQuestions = useMemo(() => {
    const bbb = [];
    options.forEach((elem, idx) => {
      const target1 = questionsGroupByOptions[elem];
      target1.forEach((elem2, idx2) => {
        if (questions.includes(elem2)) {
          bbb.push(
            <RadioButtonGroup
              key={idx.idx2}
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

  useEffect(() => {
    const tmp = initQuestionsGroupByOptions;
    const entries = Object.entries(selectedOptions);
    for (const [question, option] of entries) {
      tmp[option].push(question);
    }
    setQuestionsGroupByOptions(tmp);

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
