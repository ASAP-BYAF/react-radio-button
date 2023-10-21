const Button = ({ name, handleClick, icon }) => {
  return (
    <button
      type="button"
      name={name}
      onClick={(e) => {
        handleClick(e.target.name);
      }}
    >
      {icon}
    </button>
  );
};

export default Button;
