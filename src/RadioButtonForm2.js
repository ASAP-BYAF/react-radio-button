import React, { useState, useMemo, useEffect } from "react";
import RadioButtonGroup from "./RadioButtonGroup";
import { deleteItemFromObject } from "./util/delete";
import { renameKeyInObject } from "./util/rename";
import { arrayToObject, concatObject } from "./util/add";

function RadioButtonForm(props) {
  const {
    questions,
    questionsDiff,
    options,
    handleDeleteClick = () => {},
    handleRenameClick = () => {},
    provideOptionChange = () => {},
  } = props;

  const [selectedOptions, setSelectedOptions] = useState({});
  console.log("RadioButtonForm2");
  console.log(selectedOptions);

  useEffect(() => {
    const sign = questionsDiff[0];
    const diff = questionsDiff[1];
    if (sign === "added") {
      setSelectedOptions((prev) => concatObject(prev, arrayToObject(diff, 0)));
    } else if (sign === "deleted") {
      setSelectedOptions((prev) => deleteItemFromObject(prev, diff));
      setSelectedOptions((prev) => deleteItemFromObject(prev, diff));
    } else if (sign === "renamed") {
      const oldValue = diff[0];
      const newValue = diff[1];
      setSelectedOptions((prev) => renameKeyInObject(prev, oldValue, newValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsDiff]);

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    console.log(`name = ${name}`);
    console.log(`value = ${value}`);
    setSelectedOptions({
      ...selectedOptions,
      [name]: value,
    });
    provideOptionChange({ name: name, value: value });
  };

  const memoQuestions = useMemo(() => {
    const bbb = [];
    questions.forEach((elem2, idx) => {
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
            }}
          >
            rename
          </button>
        </div>
      );
    });
    return bbb;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, selectedOptions, options]);

  return <div>{memoQuestions}</div>;
}

export default RadioButtonForm;
