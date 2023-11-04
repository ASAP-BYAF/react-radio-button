import AccordionList from "./AccordionList";

const makeGroupedList = (data) => {
  // マップしてJSX生成
  const listItems = Object.entries(data).map(
    ([volNum, fileNumGroup], i_vol) => (
      <AccordionList
        index={volNum}
        label={`${volNum} 巻`}
        className="bg-emerald-500 mx-auto w-[50%] text-left"
        initOpen={i_vol === 0 ? true : false}
      >
        <ul key={volNum}>
          {Object.entries(fileNumGroup).map(([fileNum, items], i_file) => (
            <AccordionList
              index={`${volNum}-${fileNum}`}
              label={`${fileNum}話: ${items[0]["file_name"]}`}
              className="bg-emerald-300"
              initOpen={i_file === 0 ? true : false}
            >
              <ul key={fileNum}>
                {items.map((item, index) => (
                  <li key={index} className="bg-emerald-100">
                    {item.task_title} ({item.appearing_detail_name})
                  </li>
                ))}
              </ul>
            </AccordionList>
          ))}
        </ul>
      </AccordionList>
    )
  );
  return listItems;
};

export default makeGroupedList;
