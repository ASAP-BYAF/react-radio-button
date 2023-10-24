import "./App.css";
import RefineRadio from "./RefineRadio";
import Search from "./Search";
import Home from "./Home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/register" element={<RefineRadio />} />
      </Routes>
    </div>
  );
}
export default App;
