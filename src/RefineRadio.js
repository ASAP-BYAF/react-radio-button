import { useState, useMemo } from "react";
import RadioButtonForm from "./RadioButtonForm";

const RefineRadio = () => {
  const initialquestions = ["Apple", "Orange", "Banana", "Pineapple"];
  const [questions, setQuestions] = useState(initialquestions);
  const [allQuestions, setAllQuestions] = useState(initialquestions);
  const [filterText, setFilterText] = useState("");

  const handleInputChange = (event) => {
    const newText = event.target.value.toLowerCase();
    setFilterText(newText);
    const filteredquestions = allQuestions.filter((item) =>
      item.toLowerCase().includes(newText)
    );
    // 配列の中身を比較。単に questions !== filteredquestions とするだけではだめだった。
    if (JSON.stringify(questions) !== JSON.stringify(filteredquestions)) {
      setQuestions(filteredquestions);
    }
  };

  //   const questions = ["option1", "option2"];
  const options = ["Option1", "Option2", "Option3"];

  const memoQuestions = useMemo(() => {
    return <RadioButtonForm questions={questions} options={options} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  return (
    <div>
      <input
        type="text"
        placeholder="絞り込む文字を入力"
        onChange={handleInputChange}
      />
      {memoQuestions}
    </div>
  );
};

export default RefineRadio;
