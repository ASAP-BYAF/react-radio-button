import React, { useState, useMemo, useEffect } from "react";
import RadioButtonGroup from "./RadioButtonGroup";

function RadioButtonForm(props) {
  console.log("childBegin");
  const {
    questions,
    questionsDiff,
    options,
    handleDeleteClick = () => {},
    handleRenameClick = () => {},
  } = props;
  console.log(`questions = ${questions}`);

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

  useEffect(() => {
    const sign = questionsDiff[0];
    const diff = questionsDiff[1];
    console.log(`sign = ${sign}`);
    console.log(`diff = ${diff}`);
    if (sign === "added") {
      setSelectedOptions((prev) =>
        diff.reduce((accumulator, value) => {
          return { ...accumulator, [value]: options[0] };
        }, prev)
      );

      setQuestionsGroupByOptions((prev) =>
        Object.keys(prev).reduce((accumulator, key, idx) => {
          return {
            ...accumulator,
            [key]: idx === 0 ? [...prev[key], ...diff] : prev[key],
          };
        }, {})
      );
    } else if (sign === "deleted") {
      console.log(`${sign} is selected`);
      const value = selectedOptions[diff];
      setQuestionsGroupByOptions((prev) => deletetmp2(prev, diff, value));
      setSelectedOptions((prev) => deletetmp(prev, diff));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsDiff]);
  console.log("selectedOptions");
  console.log(selectedOptions);
  console.log("questionsGroupByOptions");
  console.log(questionsGroupByOptions);

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setSelectedOptions({
      ...selectedOptions,
      [name]: value,
    });
    setQuestionsGroupByOptions((prev) => updatetmp(prev, name, value));
  };

  // 選択肢に対する質問のリストを更新。
  // 直前まで選択されていた選択肢のリストから質問を削除し、
  // 新たに選択された選択肢のリストに質問を追加。
  // 例: {"option1": [question1, question2], "option2"}
  //       |
  //       |  question1 の選択状況が option1 から option2 に変更。
  //       |
  //       `-> {"option1": [question1], "option2":[question2]}
  const updatetmp = (prev, name, value) => {
    const beforeValue = selectedOptions[name];
    const index = prev[beforeValue].indexOf(name);
    prev[beforeValue].splice(index, 1);
    prev[value].push(name);
    return prev;
  };

  const deletetmp = (prev, name) => {
    delete prev[name];
    return prev;
  };

  const deletetmp2 = (prev, name, value) => {
    const index = prev[value].indexOf(name);
    prev[value].splice(index, 1);
    return prev;
  };

  const memoQuestions = useMemo(() => {
    const bbb = [];
    options.forEach((elem, idx) => {
      const target1 = questionsGroupByOptions[elem];
      target1.forEach((elem2) => {
        if (questions.includes(elem2)) {
          bbb.push(
            <div key={elem2}>
              <RadioButtonGroup
                key={elem2}
                questionName={elem2}
                options={options}
                selectedOption={selectedOptions}
                onChange={handleOptionChange}
              />
              <button
                className="deleteButton"
                type="button"
                name={elem2}
                onClick={(e) => {
                  handleDeleteClick(e.target.name);
                  console.log("clicked");
                }}
              >
                delete
              </button>
              <button
                className="renameButton"
                type="button"
                name={elem2}
                onClick={(e) => {
                  handleRenameClick(e.target.name);
                  console.log("clicked");
                }}
              >
                rename
              </button>
            </div>
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
