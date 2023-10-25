import React, { useState } from "react";

const AccordionList = ({ index, label, children }) => {
  const [openIndex, setOpenIndex] = useState([]);

  const toggleAccordion = (index) => {
    if (openIndex.includes(index)) {
      // クリックしたアコーディオンを閉じる
      const newOpenIndex = openIndex.filter((item) => item !== index);
      setOpenIndex(newOpenIndex);
    } else {
      // クリックしたアコーディオンを開く
      const newOpenIndex = [...openIndex, index];
      setOpenIndex(newOpenIndex);
    }
  };

  return (
    <li key={index}>
      {label}
      {/* {`: ${items[0]["file_name"]}`} */}
      <span className="accordion-header" onClick={() => toggleAccordion(index)}>
        {openIndex.includes(index) ? "▲" : "▼"}
      </span>
      {openIndex.includes(index) && <React.Fragment>{children}</React.Fragment>}
    </li>
  );
};

export default AccordionList;
