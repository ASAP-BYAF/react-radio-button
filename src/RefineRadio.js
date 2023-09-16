import { useState, useMemo } from "react";
import { MyDialog } from "./myDialog.js";
import { MyDialogRename } from "./myDialogRename.js";
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
  const [modalConfigRename, setModalConfigRename] = useState(undefined);

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
      removeItem(x, questions, setQuestions);
      removeItem(x, allQuestions, setAllQuestions);
    }
  };

  const removeItem = (x, prevList, updateFunc) => {
    updateFunc(
      prevList.filter((item) => {
        return item !== x;
      })
    );
  };

  const handleRenameClick = async (x) => {
    const ret = await new Promise((resolve) => {
      setModalConfigRename({
        onClose: resolve,
        title: "新しい選択肢を入力してください。",
        message: "空白のみにはできません。",
      });
    });
    setModalConfigRename(undefined);
    const ret_trimed = ret.trim();
    console.log(ret);
    if (ret !== "cancel" && ret_trimed && !allQuestions.includes(ret_trimed)) {
      console.log(ret);
      console.log(x);
      renameItem(x, ret);
    }
  };

  const renameItem = (x, x_prime) => {
    const x_idx_in_items = questions.indexOf(x);
    setQuestions(
      questions.map((item, index) =>
        index === x_idx_in_items ? x_prime : item
      )
    );
    setAllQuestions(
      allQuestions.map((item, index) =>
        index === x_idx_in_items ? x_prime : item
      )
    );
    // DB 上でも変更
    // 変更時は確認しなくてもいいと思う。
  };

  const memoQuestions = useMemo(() => {
    return (
      <RadioButtonForm
        questions={questions}
        options={options}
        handleDeleteClick={handleDeleteClick}
        handleRenameClick={handleRenameClick}
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
      {modalConfigRename && <MyDialogRename {...modalConfigRename} />}
      {memoQuestions}
    </div>
  );
};

export default RefineRadio;
