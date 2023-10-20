import { fetcher } from "./fetcher.js";

export const getAppearingDetailByName = async (appearing_detail_name) => {
  const url = "http://127.0.0.1:8000/appearing_detail_by_name";
  const data = {
    method: "POST",
    body: JSON.stringify({
      appearing_detail: appearing_detail_name,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  const res = await fetcher(url, data);
  return res;
};

export const addAppearingDetail = async (appearing_detail) => {
  const url = "http://127.0.0.1:8000/appearing_detail_create";
  const data = {
    method: "POST",
    body: JSON.stringify({
      appearing_detail: appearing_detail,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  const res = await fetcher(url, data);
  return res;
};

export const updateAppearingDetail = async (
  appearing_detail_id,
  new_appearing_detail_name
) => {
  const url = `http://127.0.0.1:8000/update_appearing_detail/${appearing_detail_id}`;
  const data = {
    method: "put",
    body: JSON.stringify({
      appearing_detail: new_appearing_detail_name,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  const res = await fetcher(url, data);
  return res;
};
