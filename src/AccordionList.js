import React, { useState } from "react";

const AccordionList = ({
  index,
  label,
  children,
  className = "",
  initOpen = false,
}) => {
  const [open, setOpen] = useState(initOpen);

  const toggleAccordion = () => {
    setOpen((prev) => !prev);
  };

  return (
    <li key={index} className={className}>
      {label}
      <span className="accordion-header" onClick={() => toggleAccordion()}>
        {open ? "▲" : "▼"}
      </span>
      {open && <React.Fragment>{children}</React.Fragment>}
    </li>
  );
};

export default AccordionList;
