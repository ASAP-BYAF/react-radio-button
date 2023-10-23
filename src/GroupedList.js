const makeGroupedList = (data) => {
  // マップしてJSX生成
  const listItems = Object.entries(data).map(([volNum, fileNumGroup]) => (
    <li key={volNum}>
      {`${volNum} 巻`}
      <ul key={volNum}>
        {Object.entries(fileNumGroup).map(([fileNum, items]) => (
          <li key={fileNum}>
            {`${fileNum} 話`}
            {`: ${items[0]["file_name"]}`}
            <ul key={fileNum}>
              {items.map((item, index) => (
                <li key={index}>
                  {item.task_title} ({item.appearing_detail_name})
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </li>
  ));
  return listItems;
};

export default makeGroupedList;
