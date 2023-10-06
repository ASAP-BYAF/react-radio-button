import { useState, useMemo, useEffect } from "react";
import { MyDialog } from "./myDialog.js";
import { MyDialogRename } from "./myDialogRename.js";
import RadioButtonForm from "./RadioButtonForm";
import { fetcher } from "./api/fetcher.js";
import { deleteItemFromArray } from "./util/delete.js";
import { renameItemInArray } from "./util/rename.js";
import NumberDropdown from "./NumberDropdown";

const RefineRadio = () => {
  const [questions, setQuestions] = useState([]);
  const [questionsDiff, setQuestionsDiff] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [filterText, setFilterText] = useState("");
  const options = ["Option1", "Option2", "Option3"];
  const [visible, setVisible] = useState(false);

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
    // 選択肢の追加ボタンは検索に該当する選択肢がないときにだけ表示。
    if (filteredquestions.length === 0) {
      setVisible(true);
    } else {
      setVisible(false);
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
    setVisible(false);
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

  const [vol, setVol] = useState(1);
  const [file, setFile] = useState(1);
  const [fileId, setFileId] = useState(NaN);
  const [filename, setFileName] = useState("");
  const handleVolNumChange = (x) => {
    setVol(x);
  };
  const handleFileNumChange = (x) => {
    setFile(x);
  };

  // 巻数あるいはファイル番号が変わるたびにこの関数を実行
  useMemo(async () => {
    const url = "http://127.0.0.1:8000/file_title_by_vol_file";
    console.log(vol, file);
    const data = {
      method: "POST",
      body: JSON.stringify({
        vol_num: vol,
        file_num: file,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const res = await fetcher(url, data);
    if (res.message === "None") {
      setFileName("NoneNone");
    } else {
      setFileName(res.file_name);
      setFileId(res.id);
    }
  }, [vol, file]);

  const fileRename = async () => {
    const ret = await new Promise((resolve) => {
      setModalConfigRename({
        onClose: resolve,
        title: "新しいファイル名を入力してください。",
        message: "空白のみにはできません。",
      });
    });
    setModalConfigRename(undefined);
    const ret_trimed = ret.trim();
    if (ret !== "cancel" && ret_trimed && !allQuestions.includes(ret_trimed)) {
      setFileName(ret);
    }
  };

  return (
    <div>
      <div>
        <NumberDropdown
          n_st={1}
          n_ed={103}
          label="vol"
          handleChange={handleVolNumChange}
        />
        <NumberDropdown
          n_st={1}
          n_ed={11}
          label="file"
          handleChange={handleFileNumChange}
        />
        <input type="text" value={filename} onClick={fileRename} />
      </div>

      <input type="text" placeholder="" onChange={handleInputChange} />
      <button
        className="addQuestionButton"
        type="button"
        onClick={handleAddItem}
        style={{ visibility: visible ? "visible" : "hidden" }}
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
