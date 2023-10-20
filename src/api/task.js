import { fetcher } from "./fetcher.js";

export const getTaskByTitle = async (title) => {
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
  return res;
};

export const getTaskAll = async () => {
  const url = "http://127.0.0.1:8000/tasks";
  const data = { method: "GET" };
  const res = await fetcher(url, data);
  return res;
};

export const addTask = async (title) => {
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
  return res;
};

export const deleteTaskById = async (task_id) => {
  const url = `http://127.0.0.1:8000/tasks/${task_id}`;
  const data = { method: "DELETE" };
  const res = await fetcher(url, data);
  return res;
};
