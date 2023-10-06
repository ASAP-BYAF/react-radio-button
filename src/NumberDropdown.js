import React from "react";

const NumberDropdown = (props) => {
  const { n_st, n_ed, label = "default", handleChange } = props;
  const options = [];
  for (let i = n_st; i <= n_ed; i++) {
    options.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  return (
    <div>
      <label htmlFor="numberDropdown">{label}: </label>
      <select
        id="numberDropdown"
        onChange={(e) => handleChange(e.target.value)}
      >
        {options}
      </select>
    </div>
  );
};

export default NumberDropdown;
