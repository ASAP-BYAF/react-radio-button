import { fetcher } from "./fetcher.js";

export const getAll = async () => {
  const url = `${process.env.REACT_APP_DB_API_HOST}/search`;
  const data = { method: "GET" };
  const res = await fetcher(url, data);
  return res;
};
