import { useState, useMemo } from "react";
import { MyDialog } from "./myDialog.js";
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

  const [modalConfig, setModalConfig] = useState(undefined);

  const handleDeleteClick = async (x) => {
    console.log(`${x} is clicked`);
    const ret = await new Promise((resolve) => {
      setModalConfig({
        onClose: resolve,
        title: "削除します。よろしいですか?",
        message: "削除すると二度と元に戻せません。",
      });
    });
    setModalConfig(undefined);
    console.log(ret);
    if (ret === "ok") {
      // removeItem(x, questions, setQuestions, allQuestions, setAllQuestions);
    }
  };

  const memoQuestions = useMemo(() => {
    return (
      <RadioButtonForm
        questions={questions}
        options={options}
        handleDeleteClick={handleDeleteClick}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  return (
    <div>
      <input
        type="text"
        placeholder="絞り込む文字を入力"
        onChange={handleInputChange}
      />
      {modalConfig && <MyDialog {...modalConfig} />}
      {memoQuestions}
    </div>
  );
};

export default RefineRadio;

// const removeItem = (x, y, yUpdateFunc, z, zUpdateFunc) => {
//   console.log(x, y, yUpdateFunc, z, zUpdateFunc);
//   removeItemPrime(x, y, yUpdateFunc);
//   removeItemPrime(x, z, zUpdateFunc);
//   // DB からも削除
//   // 削除ではなく使わないリストに追加がいいかも。
//   // 再度必要になった時や誤って削除したときに DB で同じ id で復活できるように。
// };

// const removeItemPrime = (x, prevList, updateFunc) => {
//   updateFunc(
//     prevList.filter((item) => {
//       return item !== x;
//     })
//   );
// };
