import React, { useState } from "react";
import InputButtonComponent from "./InputButtonComponent";

const ParentComponent = () => {
  const [inputComponents, setInputComponents] = useState([{ id: 1 }]);

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

  return (
    <div>
      <h1>Multiple InputButton Components</h1>
      {inputComponents.map((component) => (
        <InputButtonComponent
          key={component.id}
          onDeleteClick={() => handleDeleteComponent(component.id)}
        />
      ))}
      <button onClick={handleAddComponent}>Add Input Button</button>
    </div>
  );
};

export default ParentComponent;
