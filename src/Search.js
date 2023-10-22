import { useState, useEffect, useMemo } from "react";
import { getAll } from "./api/search";
import makeGroupedList from "./GroupedList";
import ParentComponent from "./button/DuplicateButton";

const Search = () => {
  const [appearingList, setAppearingList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAll();
        console.log(res);
        setAppearingList(res);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const memoAppearingList = useMemo(() => {
    const res = makeGroupedList(appearingList);
    return res;
  }, [appearingList]);

  return (
    <div>
      <ParentComponent />
      <ul>{memoAppearingList}</ul>
    </div>
  );
};

export default Search;
