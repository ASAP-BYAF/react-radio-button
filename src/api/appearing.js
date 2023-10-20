import { fetcher } from "./fetcher.js";

export const getAppearingAll = async () => {
  const url = "http://127.0.0.1:8000/appearings";
  const data = { method: "GET" };
  const res = await fetcher(url, data);
  return res;
};
export const getAppearingWithFileId = async (file_id) => {
  const url = `http://127.0.0.1:8000/appearing_with_file_id/${file_id}`;
  const data = {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  const res = await fetcher(url, data);
  return res;
};

export const addAppearing = async (file_id, task_id, appearing_detail_id) => {
  const url = "http://127.0.0.1:8000/appearing_create";
  const data = {
    method: "POST",
    body: JSON.stringify({
      file_id: file_id,
      task_id: task_id,
      appearing_detail_id: appearing_detail_id,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  const res = await fetcher(url, data);
  return res;
};

export const updateAppearing = async (
  file_id,
  task_id,
  appearing_detail_id
) => {
  const url = "http://127.0.0.1:8000/appearing_update";
  const data = {
    method: "PUT",
    body: JSON.stringify({
      file_id: file_id,
      task_id: task_id,
      appearing_detail_id: appearing_detail_id,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  const res = await fetcher(url, data);
  return res;
};

export const deleteAppearing = async (appearing_name) => {
  const url = "http://127.0.0.1:8000/appearing_delete";
  const data = {
    method: "DELETE",
    body: JSON.stringify({
      appearing_detail: appearing_name,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  const res = await fetcher(url, data);
  return res;
};
