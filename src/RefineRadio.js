import { useState, useMemo, useEffect } from "react";
import { MyDialog } from "./myDialog.js";
import { MyDialogRename } from "./myDialogRename.js";
import RadioButtonForm2 from "./RadioButtonForm2";
// import RadioButtonForm from "./RadioButtonForm";
import { fetcher } from "./api/fetcher.js";
import { deleteItemFromArray } from "./util/delete.js";
import { renameItemInArray } from "./util/rename.js";
import NumberDropdown from "./NumberDropdown";

const RefineRadio = () => {
  const [questions, setQuestions] = useState([]);
  const [questionsDiff, setQuestionsDiff] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [optionInput, setOptionInput] = useState("");
  const [options, setOptions] = useState([]);
  const [optionSelectedDiff, setOptionSelectedDiff] = useState([]);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [fileExist, setFileExist] = useState(false);
  const [optionExist, setOptionExist] = useState(false);

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
      } catch (error) {
        console.error(error);
      }
      try {
        const url = "http://127.0.0.1:8000/appearings";
        const data = { method: "GET" };
        const res = await fetcher(url, data);
        const tmp = res.map((value2) => String(value2["id"]));
        console.log("RadioRefine, UseEffect");
        console.log(tmp);
        setOptions(tmp);
        if (tmp.length > 0) {
          setOptionExist(true);
        }
        // setQuestions(tmp); // res のデータをセット
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
      setVisibleAdd(true);
    } else {
      setVisibleAdd(false);
    }
  };

  const handleOptionInputChange = (event) => {
    const newText = event.target.value.toLowerCase();
    setOptionInput(newText);
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

      const url2 = `http://127.0.0.1:8000/tasks/${res.id}`;
      const data2 = { method: "DELETE" };
      const res2 = await fetcher(url2, data2);
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
    //　task (人物) を DB にも追加する。
    const task_id = await addTaskToDb(filterText);
    addAppearingToDb(task_id, 1);
    setVisibleAdd(false);
  };

  const addTaskToDb = async (title) => {
    const url = "http://127.0.0.1:8000/tasks";
    const data = {
      method: "POST",
      body: JSON.stringify({
        title: title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const res = await fetcher(url, data);
    console.log(`file_id = ${res.id}`);
    return res.id;
  };

  const getTaskIdFromDb = async (title) => {
    const url = "http://127.0.0.1:8000/task_by_title";
    const data = {
      method: "POST",
      body: JSON.stringify({
        title: title,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const res = await fetcher(url, data);
    console.log(`file_id = ${res.id}`);
    return res.id;
  };

  const addAppearingToDb = async (task_id, appearing_detail_id) => {
    const url3 = "http://127.0.0.1:8000/appearing_create";
    const data3 = {
      method: "post",
      body: JSON.stringify({
        file_id: fileId,
        task_id: task_id,
        appearing_detail_id: appearing_detail_id,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    console.log(data3);
    const res3 = await fetcher(url3, data3);
    console.log(`appearing_id = ${res3.appearing_id}`);
  };

  const updateAppearingToDb = async (task_id, appearing_detail_id) => {
    const url3 = "http://127.0.0.1:8000/appearing_update";
    const data3 = {
      method: "put",
      body: JSON.stringify({
        file_id: fileId,
        task_id: task_id,
        appearing_detail_id: appearing_detail_id,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    console.log("data3");
    console.log(data3);
    const res3 = await fetcher(url3, data3);
    console.log(`appearing_id = ${res3.appearing_id}`);
  };

  useMemo(async () => {
    if (Object.keys(optionSelectedDiff).length !== 0) {
      const task_id = await getTaskIdFromDb(optionSelectedDiff["name"]);
      await updateAppearingToDb(task_id, optionSelectedDiff["value"]);
    }
  }, [optionSelectedDiff]);

  const memoQuestions = useMemo(() => {
    if (questions.length > 0) {
      return (
        <RadioButtonForm2
          questions={questions}
          questionsDiff={questionsDiff}
          options={options}
          handleDeleteClick={handleDeleteClick}
          handleRenameClick={handleRenameClick}
          provideOptionChange={setOptionSelectedDiff}
        />
      );
    } else {
      return <div>人物が登録されていません。</div>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, options]);

  const [vol, setVol] = useState(1);
  const [file, setFile] = useState(1);
  const [filename, setFileName] = useState("");
  const [fileId, setFileId] = useState("");
  const handleVolNumChange = (x) => {
    setVol(x);
  };
  const handleFileNumChange = (x) => {
    setFile(x);
  };

  // 巻数あるいはファイル番号が変わるたびにこの関数を実行
  useMemo(async () => {
    const url = "http://127.0.0.1:8000/file_name_by_vol_file";
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
      setFileExist(false);
    } else {
      setFileName(res.file_name);
      setFileId(res.id);
      setFileExist(true);
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
      if (filename === "NoneNone") {
        const file_id = await addFileToDb(vol, file, ret);
        setFileId(file_id);
        console.log(file_id);
      } else {
        const file_id = await updateFileToDb(fileId, vol, file, ret);
        setFileId(file_id);
        console.log(file_id);
      }
      setFileExist(true);
    }
  };

  const updateFileToDb = async (file_id, vol_num, file_num, file_name) => {
    const url3 = `http://127.0.0.1:8000/file_update/${file_id}`;
    const data3 = {
      method: "put",
      body: JSON.stringify({
        vol_num: vol_num,
        file_num: file_num,
        file_name: file_name,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const res3 = await fetcher(url3, data3);
    return res3.id;
  };

  const addFileToDb = async (vol_num, file_num, file_name) => {
    const url3 = "http://127.0.0.1:8000/file_create";
    const data3 = {
      method: "post",
      body: JSON.stringify({
        vol_num: vol_num,
        file_num: file_num,
        file_name: file_name,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const res3 = await fetcher(url3, data3);
    return res3.id;
  };

  const handleAddAppearingDetail = async (x) => {
    //　task (人物) を DB にも追加する。
    const task_id = await addAppearingDetailToDb(x);
    addAppearingToDb(task_id, 1);
    setVisibleAdd(false);
  };

  const handleAddOptions = async () => {
    addAppearingDetailToDb(optionInput);
    setOptionExist(true);
  };

  const addAppearingDetailToDb = async (appearing_detail) => {
    const url3 = "http://127.0.0.1:8000/appearing_detail_create";
    const data3 = {
      method: "post",
      body: JSON.stringify({
        appearing_detail: appearing_detail,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const res3 = await fetcher(url3, data3);
    return res3.id;
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

      <input
        type="text"
        placeholder="add options"
        onChange={handleOptionInputChange}
      />
      <button type="button" onClick={handleAddOptions}>
        add
      </button>

      <div style={{ display: fileExist && optionExist ? "block" : "none" }}>
        <input
          type="text"
          placeholder="人物を絞り込む"
          onChange={handleInputChange}
        />
        <button
          className="addQuestionButton"
          type="button"
          onClick={handleAddItem}
          style={{ display: visibleAdd ? "inline-block" : "none" }}
        >
          add
        </button>
        {memoQuestions}
      </div>
      {modalConfig && <MyDialog {...modalConfig} />}
      {modalConfigRename && <MyDialogRename {...modalConfigRename} />}
    </div>
  );
};

export default RefineRadio;
