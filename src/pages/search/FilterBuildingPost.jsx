import toastr from "cogo-toast";
import { DataContext } from "../DataContext";
import { useContext, useState } from "react";
import Avatar from "react-avatar";
import CropIcon from "@mui/icons-material/Crop";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Rating } from "react-simple-star-rating";
import PostComment from "../Postings/PostComment";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

const FilterBuildingPost = ({ children }) => {
  const [value, setValue] = useState(0);
  const [rating, setRating] = useState(0); // initial rating value

  const {filterBuildingPosting } = useContext(DataContext);
  console.log(filterBuildingPosting);
  const handleRating = (rate) => {
    setRating(rate);
    // Some logic
  };
  function handleCommentPost(event, id) {
    event.preventDefault();
    const index = filterBuildingPosting.findIndex((item) => item._id === id);
    const idDataPost = filterBuildingPosting[index];
    setSelectedPost(idDataPost);
  }
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <DataContext.Provider
      value={{ selectedPost,  }}
    >
      {children}
      <div className="px-5">
        {" "}
        {/* <div className="body-profile" style={{backgroundColor:"F3F4FA !important"}}> */}
          <div className="container" >
            {Array.isArray(filterBuildingPosting) &&
              filterBuildingPosting
                .sort((a, b) => {
                  return (
                    new Date(b?.createdAt).getTime() -
                    new Date(a?.createdAt).getTime()
                  );
                })
                .map((post) => (
                  <form className="mt-3">
                    <div className="card p-5 shadow-sm bg-body rounded-3 border-0">
                      <div className="row">
                        <div className="col-md-1">
                          <Avatar
                            name={post.fullname}
                            size="40"
                            round={true}
                            src={post?.userImg}
                          />
                        </div>
                        <div className="col-md-11">
                          <div>
                            <span className="posting-list__titleName">
                              {post?.userFullName}
                            </span>
                            <span className="posting-list__titleName__date">
                              {new Date(post?.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="fs-6 posting-list__color-text mt-2  d-block fw-bolder">
                        {post?.title}
                      </span>
                      <div className="row">
                        <div className="col-md-4 text-center">
                          <CropIcon /> {post?.roomSize}
                        </div>
                        <div className="col-md-4 text-center">
                          {" "}
                          <RoofingOutlinedIcon /> {post?.buildingName}
                        </div>
                        <div className="col-md-4 text-center">
                          <PriceChangeOutlinedIcon />
                          {post?.roomPrice}{" "}
                        </div>
                      </div>
                      <span className="fs-6 posting-list__color-text my-2 d-block">
                        {post?.description}
                      </span>
                      <img className="rounded-3 mt-3" src={post?.img} alt="" />
                      <div className=" mx-4 my-2 ">
                        <div className="float-start posting-list__feel">
                          4.9rating
                        </div>
                        <div className="float-end">
                          <a href="" className="posting-list__feel">
                            {" "}
                            {post?.userFullName}
                          </a>
                        </div>
                      </div>
                      <hr className="posting-list__hr" />
                      <Box sx={{}}>
                        <BottomNavigation
                          showLabels
                          value={value}
                          onChange={(event, newValue) => {
                            setValue(newValue);
                          }}
                        >
                          <BottomNavigationAction
                            label={rating}
                            icon={
                              <Rating
                                onClick={handleRating}
                                ratingValue={rating}
                                size={30}
                                label
                                transition
                                fillColor="orange"
                                emptyColor="gray"
                                className="foo d-block"
                              />
                            }
                          />
                          <BottomNavigationAction
                            label="Bình luận"
                            icon={<PostComment />}
                          />
                          <button
                            onClick={(event) =>
                              handleCommentPost(event, post._id)
                            }
                          >
                            submit
                          </button>
                          {/* </button> */}
                          <BottomNavigationAction
                            label="Báo cáo"
                            icon={<ReportGmailerrorredIcon />}
                          />
                        </BottomNavigation>
                      </Box>
                    </div>
                  </form>
                ))}
          </div>
          <hr />
        </div>
      {/* </div> */}
    </DataContext.Provider>
  );
};
export default FilterBuildingPost;
