export const fetcher = async (resource, data) => {
  const res = await fetch(resource, data);
  const resJson = await res.json();
  if (!res.ok) {
    const errorRes = resJson;
    const error = new Error(
      errorRes.message ?? "API リクエスト中にエラーが発生しました。"
    );

    console.error(error);
    // throw error;
    return NaN;
  } else {
    return resJson;
  }
};
