import RadioButtonForm from "./RadioButtonForm.js";

const RadioButtonFormValue = () => {
  const questions = ["option1", "option2"];
  const options = ["Option1", "Option2", "Option3"];

  return <RadioButtonForm questions={questions} options={options} />;
};

export default RadioButtonFormValue;
