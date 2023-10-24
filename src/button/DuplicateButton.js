import React, { useState } from "react";
import InputButtonComponent from "./InputButtonComponent";

const ParentComponent = ({ onChangeAllValue }) => {
  const [inputComponents, setInputComponents] = useState([{ id: 1 }]);
  const [allInputValues, setAllInputValues] = useState([]);

  const handleAddComponent = () => {
    const newId = inputComponents.length + 1;
    setInputComponents([...inputComponents, { id: newId }]);
  };

  const handleDeleteComponent = (id) => {
    const updatedComponents = inputComponents.filter(
      (component) => component.id !== id
    );
    setInputComponents(updatedComponents);
  };

  const handleGetAllValues = async () => {
    const allValues = [];
    inputComponents.forEach((component) => {
      allValues.push(component.inputValue);
    });
    setAllInputValues(allValues);
    if (allInputValues.length > 0 && !allInputValues.includes(undefined)) {
      onChangeAllValue(allValues);
    }
  };

  return (
    <div>
      {inputComponents.map((component) => (
        <InputButtonComponent
          key={component.id}
          onDeleteClick={() => handleDeleteComponent(component.id)}
          onValueChange={(value) => {
            // Update the input value for the component
            component.inputValue = value;
          }}
        />
      ))}
      <button onClick={handleAddComponent}>AND 検索する人物を増やす</button>
      <div>
        <button onClick={handleGetAllValues}>検索</button>
      </div>
      <div>
        <h3>以下の人物で AND 検索しました</h3>
        <p>
          <pre>
            {allInputValues.length === 0 || allInputValues.includes(undefined)
              ? "絞り込みなし"
              : allInputValues.join(" / ")}
          </pre>
        </p>
      </div>
    </div>
  );
};

export default ParentComponent;
