import { useState, useEffect, useMemo } from "react";
import { getAll } from "./api/search";
import { getFilteredByTask } from "./api/search";
import makeGroupedList from "./GroupedList";
import ParentComponent from "./button/DuplicateButton";

const Search = () => {
  const [appearingList, setAppearingList] = useState([]);
  const [filterList, setFilterList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAll();
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

  useMemo(async () => {
    const res = await getFilteredByTask(filterList);
    setAppearingList(res);
  }, [filterList]);

  return (
    <div>
      <ParentComponent onChangeAllValue={setFilterList} />
      <ul>{memoAppearingList}</ul>
    </div>
  );
};

export default Search;
