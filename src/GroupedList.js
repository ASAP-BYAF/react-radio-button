import AccordionList from "./AccordionList";

const makeGroupedList = (data, toggleAccordion, openIndex) => {
  // マップしてJSX生成
  const listItems = Object.entries(data).map(([volNum, fileNumGroup]) => (
    <AccordionList index={volNum} label={`${volNum} 巻`}>
      <ul key={volNum}>
        {Object.entries(fileNumGroup).map(([fileNum, items]) => (
          <AccordionList
            index={fileNum}
            label={`${fileNum}話: ${items[0]["file_name"]}`}
          >
            <ul key={fileNum}>
              {items.map((item, index) => (
                <li key={index}>
                  {item.task_title} ({item.appearing_detail_name})
                </li>
              ))}
            </ul>
          </AccordionList>
        ))}
      </ul>
    </AccordionList>
  ));
  return listItems;
};

export default makeGroupedList;
