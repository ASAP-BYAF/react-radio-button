import { useState, useMemo, useEffect } from "react";
import { MyDialog } from "./myDialog.js";
import { MyDialogRename } from "./myDialogRename.js";
import RadioButtonForm from "./RadioButtonForm";
import { fetcher } from "./api/fetcher.js";

const RefineRadio = () => {
  // const res = fetcher(url, data);
  // const initialquestions = ["Apple", "Orange", "Banana", "Pineapple"];
  const [questions, setQuestions] = useState([]);
  const [questionsDiff, setQuestionsDiff] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [filterText, setFilterText] = useState("");

  // DB から質問のリストを取得。
  // 空の依存リストを渡すことで、コンポーネントがマウントされたときにのみ実行される
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://127.0.0.1:8000/tasks";
        const data = { method: "GET" };
        const res = await fetcher(url, data);
        // const tmp = res.reduce((accumulator, value2) => {
        //   return { ...accumulator, [value2["title"]]: value2["id"] };
        // }, {});
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
      removeItem(diff, questions, setQuestions);
      removeItem(diff, allQuestions, setAllQuestions);
      setQuestionsDiff([sign, diff]);
      // setQuestionsDiff([sign, diff]);
    } else {
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
      updateQuestions([x], "deleted");
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

  const handleAddItem = async () => {
    if (filterText && !questions.includes(filterText)) {
      updateQuestions([filterText], "added");
      //　選択肢を DB にも追加する。
      // const url = "http://127.0.0.1:8000/tasks";
      // const data = {
      //   method: "POST",
      //   body: JSON.stringify({
      //     title: filterText,
      //   }),
      //   headers: {
      //     "Content-type": "application/json; charset=UTF-8",
      //   },
      // };
      // const res = await fetcher(url, data);
      // console.log(res);
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
