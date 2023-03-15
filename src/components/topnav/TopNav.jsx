import "./topnav.scss";
import UserInfo from "../user-info/UserInfo";
import { data } from "../../constants";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../pages/DataContext";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useNavigate } from "react-router-dom";
import toastr from "cogo-toast";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Stack } from "@mui/system";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";

const TopNav = () => {
  const openSidebar = () => {
    document.body.classList.add("sidebar-open");
  };
  // const { posting } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [buildings, setBuildings] = useState("");
  const [selectedArePost, setSelectedArePost] = useState("");

  const localStorageDataBuildings = localStorage.getItem("buildings");
  const data = JSON.parse(localStorageDataBuildings);
  const dataOfBuildings = data.data.buildings;

  const navigate = useNavigate();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const {
    searchPosting,
    setSearchPosting,
    filterPosting,
    setFilterPosting,
    posting,
    setPosting,
    filterBuildingPosting,
    setFilterBuildingPosting,
    filterAreaPosting,
    setFilterAreaPosting,
  } = useContext(DataContext);
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
    let filteredPrice = posting.filter((post) => {
      const [min, max] = selectedPriceRange.split("-");
      return post.roomPrice >= min && post.roomPrice <= max;
    });
    if (filteredPrice.length === 0) {
      toastr.error("Can not filter", {
        position: "top-right",
        heading: "Done",
      });
    } else {
      toastr.info("This is an info filter", {
        position: "top-right",
        heading: "Done",
      });
      setFilterPosting(filteredPrice);
      navigate("filterPost");
    }
  };
  const handleFilterBuilding = (event) => {
    event.preventDefault();
    const building = posting.filter((post) => {
      const values = Object.values(post).join(" ").toLowerCase();
      return values.includes(buildings.toLowerCase());
    });
    console.log(building);
    if (building.length === 0) {
      toastr.error("Can not find", {
        position: "top-right",
        heading: "Done",
      });
    } else {
      toastr.info("This is an info building", {
        position: "top-right",
        heading: "Done",
      });
      setFilterBuildingPosting(building);
      navigate("filterBuildPost");
    }
  };
  const handleAreaFilter = (event) => {
    event.preventDefault();
    let filteredArea = posting.filter((post) => {
      const [min, max] = selectedArePost.split("-");
      return post.roomSize >= min && post.roomSize <= max;
    });
    if (filteredArea.length === 0) {
      toastr.error("Can not area", {
        position: "top-right",
        heading: "Done",
      });
    } else {
      toastr.info("This is an info area", {
        position: "top-right",
        heading: "Done",
      });
      setFilterAreaPosting(filteredArea);
      navigate("filterAreaPost");
    }
  };
  return (
    <>
      <div className="topnav">
        <div>
          <form onSubmit={handleSubmit}>
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
          </form>
          <Stack direction="row" spacing={0} mt={2}>
            <form onSubmit={handleSubmitFilter}>
              <FormControl sx={{ minWidth: 90 }} size="small">
                <InputLabel
                  id="demo-select-price-small"
                  style={{ fontSize: 14 }}
                >
                  <PriceChangeOutlinedIcon />
                </InputLabel>
                <Select
                  labelId="demo-select-price-small"
                  id="demo-select-price-small"
                  label="Price"
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  value={selectedPriceRange}
                  style={{
                    maxHeight: "40px",
                    overflowY: "auto",
                    backgroundColor: "white",
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="0-9999999">All prices</MenuItem>
                  <MenuItem value="0-2000">0-2000</MenuItem>
                  <MenuItem value="2000-4000">2000-4000</MenuItem>
                  <MenuItem value="4000-6000">4000-6000</MenuItem>
                </Select>
              </FormControl>
              <Button color="secondary" type="submit">
                <FilterAltOutlinedIcon />
              </Button>
            </form>
            <form onSubmit={handleFilterBuilding}>
              <FormControl sx={{ minWidth: 90 }} size="small">
                <InputLabel id="demo-select-small" style={{ fontSize: 14 }}>
                  <RoofingOutlinedIcon />
                </InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={buildings}
                  label="Building"
                  onChange={(e) => setBuildings(e.target.value)}
                  style={{
                    maxHeight: "40px",
                    overflowY: "auto",
                    backgroundColor: "white",
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {dataOfBuildings.map(
                    (
                      building,
                      index // Thêm tham số index vào hàm map
                    ) => (
                      <MenuItem key={index} value={building.buildingName}>
                        {" "}
                        {building.buildingName}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
              <Button type="submit" color="secondary">
                <FilterAltOutlinedIcon />
              </Button>
            </form>
            <form onSubmit={handleAreaFilter}>
              <FormControl sx={{ minWidth: 90 }} size="small">
                <InputLabel
                  id="demo-select-area-small"
                  style={{ fontSize: 14 }}
                >
                  <PriceChangeOutlinedIcon />
                </InputLabel>
                <Select
                  labelId="demo-select-area-small"
                  id="demo-select-area-small"
                  label="Price"
                  onChange={(e) => setSelectedArePost(e.target.value)}
                  value={selectedArePost}
                  style={{
                    maxHeight: "40px",
                    overflowY: "auto",
                    backgroundColor: "white",
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="0-9999999">All prices</MenuItem>
                  <MenuItem value="0-15">0-15</MenuItem>
                  <MenuItem value="15-30">15-30</MenuItem>
                  <MenuItem value="30-45">30-45</MenuItem>
                  <MenuItem value="45-60">45-60</MenuItem>
                  <MenuItem value="60-80">60-80</MenuItem>
                  <MenuItem value="80-110">80-110</MenuItem>
                </Select>
              </FormControl>
              <Button color="secondary" type="submit">
                <FilterAltOutlinedIcon />
              </Button>
            </form>
          </Stack>
        </div>

        <div className="sidebar-toggle" onClick={openSidebar}>
          <i className="bx bx-menu-alt-right"></i>
        </div>
      </div>
    </>
  );
};

export default TopNav;
