import { useState, useMemo, useEffect } from "react";
import { MyDialog } from "./myDialog.js";
import { MyDialogRename } from "./myDialogRename.js";
import RadioButtonForm2 from "./RadioButtonForm2";
import {
  addTask,
  deleteTaskById,
  getTaskAll,
  getTaskByTitle,
  updateTask,
} from "./api/task.js";
import { concatObject } from "./util/add.js";
import { deleteItemFromArray, deleteItemFromObject } from "./util/delete.js";
import { renameItemInArray } from "./util/rename.js";
import NumberDropdown from "./NumberDropdown";
import { arrayToObject } from "./util/add";
import {
  addAppearingDetail,
  getAppearingDetailByName,
  updateAppearingDetail,
} from "./api/appearingDetail.js";
import {
  addAppearing,
  deleteAppearing,
  getAppearingAll,
  getAppearingWithFileId,
  updateAppearing,
} from "./api/appearing.js";
import { addFile, getFileById, updateFile } from "./api/file.js";
import Button from "./button/Button.js";

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
  const [selectedOptionBefore, setSelectedOptionBefore] = useState(
    arrayToObject(questions, options[0])
  );

  // DB から質問のリストを取得。
  // 空の依存リストを渡すことで、コンポーネントがマウントされたときにのみ実行される
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTaskAll();
        const tmp = res.map((value2) => value2["title"]);
        // setQuestions(tmp); // res のデータをセット
        updateQuestions(tmp, "added");
      } catch (error) {
        console.error(error);
      }
      try {
        const res = await getAppearingAll();
        const tmp = res.reduce((accumulator, x) => {
          return { ...accumulator, [x["id"]]: x["appearing_detail"] };
        }, {});
        setOptions(tmp);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMemo(() => {
    if (Object.keys(options).length > 0) {
      setOptionExist(true);
    } else {
      setOptionExist(false);
    }
  }, [options]);
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
      const res = await getTaskByTitle(x);
      await deleteTaskById(res.id);
    }
  };

  const handleRenameClick = async (x) => {
    const ret = await new Promise((resolve) => {
      setModalConfigRename({
        onClose: resolve,
        title: "新しい選択肢を入力してください。",
        message: "空白のみにはできません。",
        oldText: x,
      });
    });
    setModalConfigRename(undefined);
    const ret_trimed = ret.trim();
    if (ret !== "cancel" && ret_trimed && !allQuestions.includes(ret_trimed)) {
      updateQuestions([x, ret], "renamed");
      const res = await getTaskByTitle(x);
      await updateTask(res.id, ret);
    }
  };

  const handleAddItem = async () => {
    updateQuestions([filterText], "added");
    //　task (人物) を DB にも追加する。
    await addTaskToDb(filterText);
    setVisibleAdd(false);
  };

  const addTaskToDb = async (title) => {
    const res = await addTask(title);
    return res.id;
  };

  const getTaskIdFromDb = async (title) => {
    const res = await getTaskByTitle(title);
    return res.id;
  };

  useMemo(async () => {
    if (Object.keys(optionSelectedDiff).length !== 0) {
      const task_id = await getTaskIdFromDb(optionSelectedDiff["name"]);
      const selectedOptionNum =
        Object.values(options)[optionSelectedDiff["value"]];
      const new_appearing_detail_id = Object.keys(options).find(
        (key) => options[key] === selectedOptionNum
      );
      const res = await updateAppearing(
        fileId,
        task_id,
        new_appearing_detail_id
      );
      // 未選択の場合、更新する対象が見つからないので、新たに作成する。
      if (res === 404) {
        console.error(
          "未選択の場合、更新する対象が見つからないので、新たに作成する。"
        );
        await addAppearing(fileId, task_id, new_appearing_detail_id);
      }
    }
  }, [optionSelectedDiff]);

  const memoQuestions = useMemo(() => {
    if (questions.length > 0) {
      return (
        <RadioButtonForm2
          questions={questions}
          questionsDiff={questionsDiff}
          options={Object.keys(options).map((item, idx) => {
            return idx;
          })}
          handleDeleteClick={handleDeleteClick}
          handleRenameClick={handleRenameClick}
          provideOptionChange={setOptionSelectedDiff}
          selectedOptionsBefore={selectedOptionBefore}
        />
      );
    } else {
      return <div>該当する人物が存在しません</div>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, options, selectedOptionBefore]);

  const [vol, setVol] = useState(1);
  const [file, setFile] = useState(1);
  const [filename, setFileName] = useState("");
  const [fileId, setFileId] = useState();
  const handleVolNumChange = (x) => {
    setVol(x);
  };
  const handleFileNumChange = (x) => {
    setFile(x);
  };

  // 巻数あるいはファイル番号が変わるたびにこの関数を実行
  useMemo(async () => {
    const res = await getFileById(vol, file);
    if (res.message === "None") {
      setFileName("NoneNone");
      setFileId(-1);
      setFileExist(false);
    } else {
      setFileName(res.file_name);
      setFileId(res.id);
      setFileExist(true);
    }
  }, [vol, file]);

  const fileRename = async (x) => {
    const ret = await new Promise((resolve) => {
      setModalConfigRename({
        onClose: resolve,
        title: "新しいファイル名を入力してください。",
        message: "空白のみにはできません。",
        oldText: x,
      });
    });
    setModalConfigRename(undefined);
    const ret_trimed = ret.trim();
    if (ret !== "cancel" && ret_trimed && !allQuestions.includes(ret_trimed)) {
      setFileName(ret);
      if (filename === "NoneNone") {
        const file_id = await addFile(vol, file, ret);
        setFileId(file_id);
      } else {
        const res = await updateFile(fileId, vol, file, ret);
        setFileId(res.id);
      }
      setFileExist(true);
    }
  };

  const handleAddOptions = async () => {
    const appearing_detail_id = await addAppearingDetail(optionInput);
    setOptions((prev) =>
      concatObject(prev, { [appearing_detail_id]: optionInput })
    );
  };

  const handleDeleteOption = async (appearing_name) => {
    const ret = await new Promise((resolve) => {
      setModalConfig({
        onClose: resolve,
        title: "削除します。よろしいですか?",
        message: "削除すると二度と元に戻せません。",
      });
    });
    setModalConfig(undefined);
    if (ret === "ok") {
      await deleteAppearing(appearing_name);
      const old_id = Object.keys(options).find(
        (key) => options[key] === appearing_name
      );
      const tmp = deleteItemFromObject(options, old_id);
      setOptions(tmp);
      await aaa(tmp, fileId);
    }
  };

  const handleRenameOption = async (x) => {
    const ret = await new Promise((resolve) => {
      setModalConfigRename({
        onClose: resolve,
        title: "新しい選択肢を入力してください。",
        message: "空白のみにはできません。",
        oldText: x,
      });
    });
    setModalConfigRename(undefined);
    const ret_trimed = ret.trim();
    if (ret !== "cancel" && ret_trimed) {
      const res = await getAppearingDetailByName(x);
      const appearing_detail_id = res.id;
      await updateAppearingDetail(appearing_detail_id, ret);
      setOptions((prev) => ({ ...prev, [appearing_detail_id]: ret }));
    }
  };

  const tmp123 = () => {
    const tmp = [];
    Object.values(options).forEach((item, idx) => {
      tmp.push(
        <div key={item}>
          <span>
            {idx}: {item} /
          </span>
          <Button name={item} handleClick={handleDeleteOption} icon="×" />
          <Button name={item} handleClick={handleRenameOption} icon="✑" />
        </div>
      );
    });
    return tmp;
  };

  const optionList = useMemo(() => {
    const tmp = tmp123();
    return tmp;
  }, [options]);

  const aaa = async (xxx, file_id) => {
    try {
      const rrr = Object.keys(xxx).map((item) => item);
      const sss = await questions.reduce(async (acc, item) => {
        acc = await acc;
        const tmp = await getTaskIdFromDb(item);
        acc = { ...acc, [tmp]: item };
        return acc;
      }, {});
      const appearling_list = await getAppearingWithFileId(file_id);
      const bbb = appearling_list.reduce((acc, item) => {
        const task_id = item["task_id"];
        const task = sss[task_id];
        const appearing_detail_id = item["appearing_detail_id"];
        const optionNum = rrr.indexOf(String(appearing_detail_id));
        return { ...acc, [task]: optionNum };
      }, {});
      setSelectedOptionBefore(bbb);
    } catch {
      console.error(
        "Cannot access getAppearingWithFileIdFromDb before initialization"
      );
    }
  };

  useMemo(async () => {
    if (fileExist && optionExist) {
      await aaa(options, fileId);
    }
  }, [fileId, fileExist, optionExist]);

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
        <input
          type="text"
          value={filename}
          onClick={(e) => fileRename(e.target.value)}
        />
      </div>

      <input
        type="text"
        placeholder="add options"
        onChange={handleOptionInputChange}
      />
      <button type="button" onClick={handleAddOptions}>
        add
      </button>
      <div>{optionList}</div>

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
