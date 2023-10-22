import "./App.css";
import RefineRadio from "./RefineRadio";
import Search from "./Search";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/register" element={<RefineRadio />} />
        {/* <Route path="/" element={<RefineRadio />} /> */}
      </Routes>
    </div>
  );
}

export default App;
