const RadioButtonGroup = ({
  questionName,
  options,
  selectedOption,
  onChange,
}) => {
  return (
    <span>
      {questionName}:
      {options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            name={questionName}
            value={option}
            checked={selectedOption[questionName] === option}
            onChange={onChange}
          />
        </label>
      ))}
    </span>
  );
};

export default RadioButtonGroup;
