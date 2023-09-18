export const renameItemInArray = (array, x, x_prime) => {
  const x_idx_in_items = array.indexOf(x);
  return array.map((item, index) =>
    index === x_idx_in_items ? x_prime : item
  );
};
