export const deleteItemFromArray = (array, x) => {
  return array.filter((item) => {
    return item !== x;
  });
};
