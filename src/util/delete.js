// [value1, value2, value3, ...] という配列からある値を削除する。
export const deleteItemFromArray = (array, x) => {
  return array.filter((item) => {
    return item !== x;
  });
};

// Rf: https://chaika.hatenablog.com/entry/2020/05/13/083000
// { key1: value1, key2: value2, ...} というオブジェクトからある値を削除する。
export const deleteItemFromObject = (prev, key) => {
  const { [key]: _, ...newObj } = prev;
  return newObj;
};

// { key1: [array1], key2: [array2], ...} というオブジェクトの配列からある値を削除する。
export const deleteItemFromArrayInObject = (obj, key, x) => {
  deleteItemFromArray(obj[key], x);
  return obj;
};
