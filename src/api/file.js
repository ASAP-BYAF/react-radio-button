import { fetcher } from "./fetcher.js";

export const getFileById = async (vol, file) => {
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
  return res;
};

export const addFile = async (vol_num, file_num, file_name) => {
  const url = "http://127.0.0.1:8000/file_create";
  const data = {
    method: "POST",
    body: JSON.stringify({
      vol_num: vol_num,
      file_num: file_num,
      file_name: file_name,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  const res = await fetcher(url, data);
  return res;
};

export const updateFile = async (file_id, vol_num, file_num, file_name) => {
  const url = `http://127.0.0.1:8000/file_update/${file_id}`;
  const data = {
    method: "PUT",
    body: JSON.stringify({
      vol_num: vol_num,
      file_num: file_num,
      file_name: file_name,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  const res = await fetcher(url, data);
  return res;
};
