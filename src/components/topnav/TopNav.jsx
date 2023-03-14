import "./topnav.scss";
import UserInfo from "../user-info/UserInfo";
import { data } from "../../constants";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../pages/DataContext";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useNavigate } from "react-router-dom";
import toastr from "cogo-toast";

const TopNav = () => {
  const openSidebar = () => {
    document.body.classList.add("sidebar-open");
  };
  const { posting } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");

  const navigate = useNavigate();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const { searchPosting, setSearchPosting, filterPosting, setFilterPosting } =
    useContext(DataContext);
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = posting.filter((post) => {
      const values = Object.values(post).join(" ").toLowerCase();
      return values.includes(searchTerm.toLowerCase());
    });

    if (data.length === 0) {
      toastr.error("Can not find", {
        position: "top-right",
        heading: "Done",
      });
    } else {
      toastr.info("This is an info find", {
        position: "top-right",
        heading: "Done",
      });
      setSearchPosting(data);
      navigate("searchPost");
    }
  };
  const handleSubmitFilter = (event) => {
    event.preventDefault();
    const filteredPrice = filteredPrice.filter((post) => {
      const [min, max] = selectedPriceRange.split("-");
      return post.roomPrice >= min && post.roomPrice <= max;
    });
  
    if (filteredPrice.length === 0) {
      toastr.error("Can not filter", {
        position: "top-right",
        heading: "Done",
      });
    } else {
      toastr.info("This is an info find", {
        position: "top-right",
        heading: "Done",
      });
      setFilterPosting(filteredPrice);
      navigate("");
    }
  };

  return (
    <>
      <form className="topnav" onSubmit={handleSubmit}>
        <div
          style={{
            padding: 8,
            width: 252,
            borderRadius: 19,
            backgroundColor: "white",
          }}
        >
          <SearchRoundedIcon type="submit" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            style={{ border: "none", outline: "none" }}
          />
        </div>

        <div>
          <form onSubmit={handleSubmitFilter}>
            <label htmlFor="price-range">Select a price range:</label>
            <select
              id="price-range"
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              value={selectedPriceRange}
            >
              <option value="">All prices</option>
              <option value="0-2000">0 - 2000</option>
              <option value="2001-3500">2000 - 3500</option>
              <option value={"3501-5501"}>3500 - 5500</option>
            </select>
            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="sidebar-toggle" onClick={openSidebar}>
          <i className="bx bx-menu-alt-right"></i>
        </div>
      </form>
    </>
  );
};

export default TopNav;
