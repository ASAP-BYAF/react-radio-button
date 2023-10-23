import { fetcher } from "./fetcher.js";

export const getAll = async () => {
  const url = `${process.env.REACT_APP_DB_API_HOST}/search`;
  const data = { method: "GET" };
  const res = await fetcher(url, data);
  return res;
};

export const getFilteredByTask = async (filterList) => {
  const url = `${process.env.REACT_APP_DB_API_HOST}/search_filtered_by_task`;
  const data = {
    method: "POST",
    body: JSON.stringify({
      task_list: filterList,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  const res = await fetcher(url, data);
  return res;
};
