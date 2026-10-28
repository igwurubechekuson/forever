/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/frontend_assets/assets";
import { useLocation } from "react-router-dom";

const Search = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(AppContext);

  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection") && showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location.pathname, showSearch]);

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="flex-1 outline-none bg-inherit text-sm"
          placeholder="Search products ....."
        />
        <img className="w-4" src={assets.search_icon} alt="" />
      </div>

      <img
        className="inline w-3 cursor-pointer"
        src={assets.cross_icon}
        onClick={() => setShowSearch(false)}
        alt=""
      />
    </div>
  ) : null;
};

export default Search;