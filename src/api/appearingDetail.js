import { fetcher } from "./fetcher.js";

export const getAppearingDetailByName = async (appearing_detail_name) => {
  const url = `${process.env.REACT_APP_DB_API_HOST}/appearing_detail_by_name`;
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
  const url = `${process.env.REACT_APP_DB_API_HOST}/appearing_detail_create`;
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
  const url = `${process.env.REACT_APP_DB_API_HOST}/update_appearing_detail/${appearing_detail_id}`;
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

export const deleteAppearingDetail = async (appearing_detail_name) => {
  const url = `${process.env.REACT_APP_DB_API_HOST}/appearing_detail_delete`;
  const data = {
    method: "DELETE",
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
