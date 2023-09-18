export const concatArraytoArrayInObject = (obj, key, array) => {
  obj[key] = [...obj[key], ...array];
  return obj;
};

export const arrayToObject = (array, value) => {
  return array.reduce((accumulator, x) => {
    return { ...accumulator, [x]: value };
  }, {});
};

export const concatObject = (obj1, obj2) => {
  return { ...obj1, ...obj2 };
};
