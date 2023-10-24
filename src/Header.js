import { Link } from "react-router-dom";

const Header = () => {
  return (
    <p>
      <Link to="/">ホーム </Link>
      <span> | </span>
      <Link to="/search">検索</Link>
      <span> | </span>
      <Link to="/register">登録</Link>
    </p>
  );
};

export default Header;
