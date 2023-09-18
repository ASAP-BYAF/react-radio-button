import { deleteItemFromArrayInObject, deleteItemFromObject } from "./delete";

// 配列の特定の値を別の値に変更する。
//  例: [value1, value2, value3, ...]
//        `--> [value1_prime, value2, value3, ...]
export const renameItemInArray = (array, x, x_prime) => {
  const x_idx_in_items = array.indexOf(x);
  return array.map((item, index) =>
    index === x_idx_in_items ? x_prime : item
  );
};

// オブジェクトの特定のキーを変更する。
// 例: { key1: value1, key2: value2, ...}
//    `--> { key1_prime: value1, key2: value2, ...}
export const renameKeyInObject = (obj, x, x_prime) => {
  const value = obj[x];
  const obj_ = deleteItemFromObject(obj, x);
  obj_[value] = x_prime;
  return obj_;
};

// { key1: [array1], key2: [array2], ...} というオブジェクトの配列のある値を別の値に変更する。
export const renameItemInArrayInObject = (obj, key, x, x_prime) => {
  const obj_ = deleteItemFromArrayInObject(obj, key, x);
  obj_[key] = [...obj_[key], x_prime];
  return obj_;
};
