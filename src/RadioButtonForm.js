import React, { useState, useMemo } from "react";
import RadioButtonGroup from "./RadioButtonGroup";
import { deleteItemFromObject } from "./util/delete";
import { renameKeyInObject } from "./util/rename";
import { arrayToObject, concatObject } from "./util/add";
import Button from "./button/Button.js";

function RadioButtonForm(props) {
  const {
    questions,
    questionsDiff,
    options,
    handleDeleteClick = () => {},
    handleRenameClick = () => {},
    provideOptionChange = () => {},
    selectedOptionsBefore = {},
  } = props;

  const [selectedOptions, setSelectedOptions] = useState({});

  // 選択状況を得たときはそれを各選択制の初期値に設定します。
  useMemo(() => {
    setSelectedOptions(selectedOptionsBefore);
  }, [selectedOptionsBefore]);

  useMemo(() => {
    const sign = questionsDiff[0];
    const diff = questionsDiff[1];
    if (sign === "added") {
      setSelectedOptions((prev) =>
        concatObject(prev, arrayToObject(diff, NaN))
      );
    } else if (sign === "deleted") {
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
    setSelectedOptions({
      ...selectedOptions,
      [name]: Number(value),
    });
    provideOptionChange({ name: name, value: value });
  };

  const handleResetClick = (name) => {
    const nameList = document.getElementsByName(name);
    nameList.forEach((elem) => {
      elem.checked = false;
    });
    setSelectedOptions({
      ...selectedOptions,
      [name]: NaN,
    });
    provideOptionChange({ name: name, value: NaN });
  };

  const memoQuestions = useMemo(() => {
    const tmpOptionList = [];
    tmpOptionList.push(
      options.map((option) => <span key={option}>{option}</span>)
    );
    questions.forEach((elem, idx) => {
      tmpOptionList.push(
        <div key={elem}>
          <RadioButtonGroup
            key={elem}
            questionName={elem}
            options={options}
            selectedOption={selectedOptions}
            onChange={handleOptionChange}
          />
          <Button name={elem} handleClick={handleDeleteClick} icon="✕" />
          <Button name={elem} handleClick={handleRenameClick} icon="✑" />
          <Button
            name={elem}
            handleClick={() => handleResetClick(elem)}
            icon="↻"
          />
        </div>
      );
    });
    return tmpOptionList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, selectedOptions, options]);

  return <div>{memoQuestions}</div>;
}

export default RadioButtonForm;
