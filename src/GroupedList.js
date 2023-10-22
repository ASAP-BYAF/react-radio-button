const makeGroupedList = (data) => {
  const groupedData = {};
  data.forEach((item) => {
    const { vol_num, file_num } = item;
    if (!groupedData[vol_num]) {
      groupedData[vol_num] = {};
    }
    if (!groupedData[vol_num][file_num]) {
      groupedData[vol_num][file_num] = [];
    }
    groupedData[vol_num][file_num].push(item);
  });

  // マップしてJSX生成
  const listItems = Object.entries(groupedData).map(
    ([volNum, fileNumGroup]) => (
      <li key={volNum}>
        {`${volNum} 巻`}
        <ul key={volNum}>
          {Object.entries(fileNumGroup).map(([fileNum, items]) => (
            <li key={fileNum}>
              {`${fileNum} 話`}
              <ul key={fileNum}>
                {items.map((item, index) => (
                  <li key={index}>
                    {item.title} ({item.appearing_detail})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </li>
    )
  );
  return listItems;
};

export default makeGroupedList;
