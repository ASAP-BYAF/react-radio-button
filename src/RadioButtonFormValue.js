import RadioButtonForm from "./RadioButtonForm.js";

const RadioButtonFormValue = () => {
  const questions = [
    "question1",
    "question2",
    "question3",
    "question4",
    "question5",
    "question6",
  ];
  const options = ["Option1", "Option2", "Option3"];

  return <RadioButtonForm questions={questions} options={options} />;
};

export default RadioButtonFormValue;
