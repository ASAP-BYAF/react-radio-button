import { useState, useMemo, useEffect } from "react";
import { MyDialog } from "./myDialog.js";
import { MyDialogRename } from "./myDialogRename.js";
import RadioButtonForm from "./RadioButtonForm";
import { fetcher } from "./api/fetcher.js";
import { deleteItemFromArray } from "./util/delete.js";
import { renameItemInArray } from "./util/rename.js";

const RefineRadio = () => {
  const [questions, setQuestions] = useState([]);
  const [questionsDiff, setQuestionsDiff] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [filterText, setFilterText] = useState("");
  const options = ["Option1", "Option2", "Option3"];

  // DB から質問のリストを取得。
  // 空の依存リストを渡すことで、コンポーネントがマウントされたときにのみ実行される
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://127.0.0.1:8000/tasks";
        const data = { method: "GET" };
        const res = await fetcher(url, data);
        const tmp = res.map((value2) => value2["title"]);
        // setQuestions(tmp); // res のデータをセット
        const diff = updateQuestions(tmp, "added");
        console.log(diff);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 質問の追加、削除、変更時に現在表示している質問とすべての質問を更新。
  // また、前回との差分を計算。
  const updateQuestions = (x, sign) => {
    // x は配列を想定。
    if (sign === "added") {
      // 最初の DB からとってくるときのみ x の長さは 1 とは限らない。
      // そのため、diff = x[0] ではだめ。
      const diff = x.filter((value) => {
        return !questions.includes(value);
      });
      setQuestions((prev) => [...prev, ...x]);
      setAllQuestions((prev) => [...prev, ...x]);
      setQuestionsDiff([sign, diff]);
    } else if (sign === "deleted") {
      const diff = x[0];
      setQuestions((prev) => deleteItemFromArray(prev, diff));
      setAllQuestions((prev) => deleteItemFromArray(prev, diff));
      setQuestionsDiff([sign, diff]);
    } else if (sign === "renamed") {
      const oldValue = x[0];
      const newValue = x[1];
      setQuestions((prev) => renameItemInArray(prev, oldValue, newValue));
      setAllQuestions((prev) => renameItemInArray(prev, oldValue, newValue));
      setQuestionsDiff([sign, [oldValue, newValue]]);
      return "renamed";
    }
  };
  console.log("questions");
  console.log(questions);
  console.log("allQuestions");
  console.log(allQuestions);

  const handleInputChange = (event) => {
    const newText = event.target.value.toLowerCase();
    setFilterText(newText);
    const filteredquestions = allQuestions.filter((item) =>
      item.toLowerCase().includes(newText)
    );
    // 配列の中身を比較。中身が異なるときだけ questions の状態を更新。
    // 単に questions !== filteredquestions とするだけではだめだった。
    if (JSON.stringify(questions) !== JSON.stringify(filteredquestions)) {
      setQuestions(filteredquestions);
    }
  };

  const [modalConfig, setModalConfig] = useState(undefined);
  const [modalConfigRename, setModalConfigRename] = useState(undefined);

  const handleDeleteClick = async (x) => {
    const ret = await new Promise((resolve) => {
      setModalConfig({
        onClose: resolve,
        title: "削除します。よろしいですか?",
        message: "削除すると二度と元に戻せません。",
      });
    });
    setModalConfig(undefined);
    if (ret === "ok") {
      updateQuestions([x], "deleted");
      const url = "http://127.0.0.1:8000/task_by_title";
      const data = {
        method: "POST",
        body: JSON.stringify({
          title: x,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      };
      const res = await fetcher(url, data);
      console.log(res);
      console.log(res.id);

      const url2 = `http://127.0.0.1:8000/tasks/${res.id}`;
      const data2 = { method: "DELETE" };
      const res2 = await fetcher(url2, data2);
      console.log(res2);
    }
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
    if (ret !== "cancel" && ret_trimed && !allQuestions.includes(ret_trimed)) {
      updateQuestions([x, ret], "renamed");
    }
  };

  const handleAddItem = async () => {
    if (filterText && !questions.includes(filterText)) {
      updateQuestions([filterText], "added");
      console.log(`filterText = ${filterText}`);
      //　選択肢を DB にも追加する。
      const url = "http://127.0.0.1:8000/tasks";
      const data = {
        method: "POST",
        body: JSON.stringify({
          title: filterText,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      };
      const res = await fetcher(url, data);
      console.log(res);
    }
  };

  const memoQuestions = useMemo(() => {
    return (
      <RadioButtonForm
        questions={questions}
        questionsDiff={questionsDiff}
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
      <button
        className="addQuestionButton"
        type="button"
        onClick={handleAddItem}
      >
        add
      </button>

      {modalConfig && <MyDialog {...modalConfig} />}
      {modalConfigRename && <MyDialogRename {...modalConfigRename} />}
      {memoQuestions}
    </div>
  );
};

export default RefineRadio;
