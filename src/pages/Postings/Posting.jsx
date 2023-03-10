  import React, { useEffect, useState } from "react";
  import Box from "@mui/material/Box";
  import BottomNavigation from "@mui/material/BottomNavigation";
  import BottomNavigationAction from "@mui/material/BottomNavigationAction";
  import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
  import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
  import DashboardWrapper, {
    DashboardWrapperMain,
    DashboardWrapperRight,
  } from "../../components/dashboard-wrapper/DashboardWrapper";
  import Avatar from "react-avatar";
  import { Rating } from "react-simple-star-rating";
  import "./posting.scss";
  import { Link } from "react-router-dom";
  import axios from "axios";
  import CropIcon from "@mui/icons-material/Crop";
  import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
  import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
  import PostModal from "./PostMoal";
  // import PostModal from "./PostMoal";

  function Posting() {
    const [rating, setRating] = useState(0); // initial rating value
    const userPosting = JSON.parse(localStorage.getItem("access_token"));
    const userPostings = userPosting?.data?.user;

    
    // Catch Rating value
    const handleRating = (rate) => {
      setRating(rate);
      // Some logic
    };
    const [data, setData] = useState({
      buildings: [],
      postings: [],
      rooms: [],
      users: [],
    });
    console.log(data.postings)
    const dataPost = data?.postings;

    useEffect(() => {
      const fetchData = async () => {
        try {
          const responses = await Promise.all([
            axios.get("https://fhome-be.vercel.app/getBuildings"),
            axios.get("https://fhome-be.vercel.app/getAllPostings"),
            axios.get("https://fhome-be.vercel.app/getRooms"),
            axios.get("https://fhome-be.vercel.app/getAllUsers"),
          ]);
          const buildings = responses[0].data.data.buildings;
          const postings = responses[1].data.data.postings;
          const rooms = responses[2].data.data.rooms;
          const users = responses[3].data;
          const newData = postings.map((post) => {
            const building = buildings.find((b) => b._id === post.buildings);
            const buildingName = building ? building.buildingName : "";

            const room = rooms.find((r) => r._id === post.rooms);
            const roomPrice = room ? room?.price : "";
            const roomSize = room ? room?.size : "";
            const roomName = room ? room?.roomName :"";

            const user = users.find((u) => u._id === post.userPosting);
            const userEmail = user ? user.email : "";
            const userFullName = user ? user.fullname : "";
            const userImg = user ? user.img : "";
            

            return {
              ...post,
              buildingName,
              roomName,
              roomPrice,
              roomSize,
              userEmail,
              userFullName,
              userImg,
            };
          });

          const buildingIds = newData.map((post) => post?.buildings);
          const filteredBuildingIds = buildings
            .filter((b) => buildingIds.includes(b?._id))
            .map((b) => b?._id);

          setData({
            users,
            rooms,
            buildings,
            postings: newData,
            buildingIds: filteredBuildingIds,
          });
        } catch (error) {
          console.log(error);
        }
      };
      const intervalId = setInterval(fetchData, 5000); // G???i fetchData sau m???i 5 gi??y
      return () => clearInterval(intervalId);
    }, []);

    const [value, setValue] = React.useState(0);
    return (
      <div className="posting-list">
        <DashboardWrapper>
          <DashboardWrapperMain>
            <form className="card shadow-sm bg-body rounded-3 border-0">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-1">
                    <Avatar
                      name="John Doe"
                      size="40"
                      round={true}
                      src={userPostings?.img}
                    />
                  </div>
                  <div className="col-md-11">
                    <PostModal />
                  </div>
                </div>
                <hr className="mx-1" />
                <div className="row px-3 ">
                  <div className="col-md-4 text-center">Video tr???c ti???p</div>
                  <div className="col-md-4 text-center">???nh/video</div>
                  <div className="col-md-4 text-center">C???m x??c/ho???t ?????ng</div>
                </div>
              </div>
            </form>
            {Array.isArray(dataPost) &&
              dataPost
                .sort((a, b) => {
                  return (
                    new Date(b?.createdAt).getTime() -
                    new Date(a?.createdAt).getTime()
                  );
                })
                .map((post) => (
                  
                  <form className="mt-3">
                    <div className="card p-3 shadow-sm bg-body rounded-3 border-0">
                      <div className="row">
                        <div className="col-md-1">
                          <Avatar
                            name={userPosting?.fullname}
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
                      {/* <div className="posting-img rounded-3"> */}
                      {/* <div className="px-5"> */}
                      <img className="rounded-3 mt-3" src={post?.img} alt="" />
                      {/* </div> */}
                      {/* </div> */}
                      <div className=" mx-4 my-2 ">
                        <div className="float-start posting-list__feel">
                          4.9rating
                        </div>
                        <div className="float-end">
                          <a href="" className="posting-list__feel">
                            {" "}
                            233 comment
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
                            label="B??nh lu???n"
                            icon={<ChatBubbleOutlineIcon />}
                          />
                          <BottomNavigationAction
                            label="B??o c??o"
                            icon={<ReportGmailerrorredIcon />}
                          />
                        </BottomNavigation>
                      </Box>
                    </div>
                  </form>
                ))}
          </DashboardWrapperMain>
          <DashboardWrapperRight>
            <div className="card border-0">
              <div className="row">
                <div className="col-md-2">
                  <Link to="/home/profiles">
                    <Avatar
                      name="John Doe"
                      size="55"
                      round={true}
                      src={userPostings?.img}
                    />
                  </Link>
                </div>
                <div className="col-md-10">
                  <div className="mt-2  ms-2">
                    <Link to="/home/profiles">
                      <span className="posting-list__titleName">
                        {userPostings?.fullname}
                      </span>
                    </Link>
                    <span className="posting-list__titleName__date">user</span>
                  </div>
                </div>
              </div>
            </div>
          </DashboardWrapperRight>
        </DashboardWrapper>
        {/* modal */}
        {/* modal */}
      </div>
    );
  }

  export default Posting;
