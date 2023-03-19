import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";
import Avatar from "react-avatar";
import { Rating } from "react-simple-star-rating";
import "./posting.scss";
import { Link, Route } from "react-router-dom";
import axios from "axios";
import CropIcon from "@mui/icons-material/Crop";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PostModal from "./PostMoal";
import PostComment from "./PostComment";
import { DataContext } from "../DataContext";
import toastr from "cogo-toast";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DraftsIcon from "@mui/icons-material/Drafts";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";

function Posting({ children, filePath }) {
  const userPosting = JSON.parse(localStorage.getItem("access_token"));
  const userPostings = userPosting?.data?.user;
  const { posting, setPosting } = useContext(DataContext);

  const [isLiked, setIsLiked] = useState(false);
  const likePostFavourite = isLiked?.data?.favourite;
  const [dataPosting, setDataPosting] = useState({
    buildings: [],
    postings: [],
    rooms: [],
    users: [],
  });
  useEffect(() => {
    if (dataPosting?.postings.length > 0) {
      setPosting(dataPosting?.postings);
    }
  }, [dataPosting?.postings]);
  const arrPost = useMemo(() => dataPosting?.postings, [dataPosting]);

  const arrPostDarft = useMemo(() => {
    if (!dataPosting) return [];

    return dataPosting.postings.filter((posting) => posting.status === "draft");
  }, [dataPosting]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          axios.get("http://localhost:3000/getBuildings"),
          axios.get("http://localhost:3000/getAllStatus"),
          axios.get("http://localhost:3000/getRooms"),
          axios.get("http://localhost:3000/getAllUsers"),
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
          const roomName = room ? room?.roomName : "";

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

        setDataPosting({
          users,
          rooms,
          buildings,
          postings: newData,
          buildingIds: filteredBuildingIds,
        });

        // Get favorites
        const response = await axios.get(
          "http://localhost:3000/getFavouriteByUser",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userPosting.data.accessToken}`,
            },
          }
        );
        setIsLiked(response.data);
      } catch (error) {
        toastr.error("Can not find post", {
          position: "top-right",
          heading: "Done",
        });
        console.log(error);
      }
    };
    const intervalId = setInterval(fetchData, 5000); // Gọi fetchData sau mỗi 5 giây

    return () => clearInterval(intervalId);
  }, []);
  const arrPostPublish = useMemo(() => {
    if (!dataPosting) return [];
    return dataPosting.postings.filter(
      (posting) => posting.status === "published"
    );
  }, [dataPosting]);
  const postCommentRef = useRef(null);
  const [value, setValue] = React.useState(0);

  function handleCommentPost(event, id) {
    event.preventDefault();
    const index = arrPost.findIndex((item) => item._id === id);
    const idDataPost = arrPost[index];
    setSelectedPost(idDataPost);

    if (postCommentRef.current) {
      postCommentRef.current.click();
    }
  }

  function handlePostPending(event, id) {
    event.preventDefault();

    const confirmed = window.confirm("Bạn có chắc chắn muốn gửi bài này?");

    if (confirmed) {
      axios
        .put(`http://localhost:3000/confirm-post/${id}`, {
          status: "pending",
        })
        .then((response) => {
          toastr.success("P successfully", {
            position: "top-right",
            heading: "Done",
          });
        })
        .catch((error) => {
          toastr.error("Reject fail", {
            position: "top-right",
            heading: "Done",
          });
          console.log(error);
        });
    }
  }

  function handlePostRejct(event, id) {
    event.preventDefault();

    if (window.confirm("Bạn có chắc muốn reject post này không?")) {
      axios
        .put(`http://localhost:3000/confirm-post/${id}`, {
          status: "rejected",
        })
        .then((response) => {
          toastr.success("Reject successfully", {
            position: "top-right",
            heading: "Done",
          });
          console.log(response.data);
        })
        .catch((error) => {
          toastr.error("Reject fail", {
            position: "top-right",
            heading: "Done",
          });
          console.log(error);
        });
    }
  }
  const handleLike = (event, id) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:3000/createFavouritePost",
        { postId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userPosting.data.accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Like added successfully");
      })
      .catch((error) => {
        console.error("Failed to add like", error);
      });
  };
  const handleDisLike = (event, id) => {
    const idLike = likePostFavourite?.filter(
      (like) => like?.post?._id === id
    )?.[0]._id;
    event.preventDefault();
    axios
      .delete(`http://localhost:3000/deleteFavouritePost/${idLike}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userPosting.data.accessToken}`,
        },
      })
      .then((response) => {
        console.log("DisLike added successfully");
      })
      .catch((error) => {
        console.error("Failed to add Dislike", error);
      });
  };
  const [selectedPost, setSelectedPost] = useState(null);

  const styleStatus = {
    display: "inline-block",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    lineHeight: "40px",
    fontSize: 10,
    boxShadow: "0px 7px 29px 0px rgba(100, 100, 111, 0.2)",
    marginLeft: 13,
  };
  const PostingDraft = <DraftsIcon style={{ color: "brown" }} />;
  const PostingPending = <PendingIcon style={{ color: "blue" }} />;
  const PostingAprove = (
    <CheckCircleOutlineOutlinedIcon style={{ color: "violet" }} />
  );

  const PostingPublic = <PublicOutlinedIcon style={{ color: "green" }} />;
  const PostingReject = <ThumbDownAltOutlinedIcon style={{ color: "red" }} />;
  return (
    <DataContext.Provider
      value={{ dataPosting, setDataPosting, selectedPost, arrPost }}
    >
      {children}

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
                    {/* <PostDarft /> */}
                  </div>
                </div>
                <hr className="mx-1" />
                <div className="row px-3 ">
                  <div className="col-md-4 text-center">Video trực tiếp</div>
                  <div className="col-md-4 text-center">Ảnh/video</div>
                  <div className="col-md-4 text-center">Cảm xúc/hoạt động</div>
                </div>
              </div>
            </form>
            {Array.isArray(arrPostPublish) &&
              arrPostPublish
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
                            <span className="ms-2">
                              {post.status === "published" && PostingPublic}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="fs-6 posting-list__color-text mt-2 ms-2 d-block fw-bolder">
                        {post?.title}
                      </span>
                      <div className="row text-dark">
                        <div className="col-md-4 text-center">
                          <CropIcon style={{ color: "#b48845" }} />{" "}
                          {post?.roomSize}
                        </div>
                        <div className="col-md-4 text-center">
                          {" "}
                          <RoofingOutlinedIcon
                            style={{ color: "#b48845" }}
                          />{" "}
                          {post?.buildingName}
                        </div>
                        <div className="col-md-4 text-center">
                          <PriceChangeOutlinedIcon
                            style={{ color: "#b48845" }}
                          />
                          {post?.roomPrice}{" "}
                        </div>
                      </div>
                      <span className="fs-6 posting-list__color-text my-2 ms-2 d-block">
                        {post?.description}
                      </span>
                      <img className="rounded-3 mt-3" src={post?.img} alt="" />
                      <div className=" mx-4 my-2 ">
                        <div className="float-start posting-list__feel">
                          {
                            likePostFavourite?.filter?.(
                              (like) => like?.post?._id === post?._id
                            )?.length
                          }{" "}
                          like
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
                            icon={
                              likePostFavourite?.filter(
                                (f) => f?.post?._id === post?._id
                              )?.length > 0 ? (
                                <FavoriteIcon sx={{ color: "#ec2d4d" }} />
                              ) : (
                                <FavoriteIcon sx={{ color: "black" }} />
                              )
                            }
                            onClick={(event) => handleLike(event, post?._id)}
                          />
                          <BottomNavigationAction
                            icon={<DeleteIcon sx={{ color: "black  " }} />}
                            onClick={(event) => handleDisLike(event, post?._id)}
                          />
                          <div style={{ display: "flex" }}>
                            <Button
                              onClick={(event) =>
                                handleCommentPost(event, post._id)
                              }
                            >
                             CMT
                            </Button>
                            <PostComment ref={postCommentRef} />
                          </div>
                        </BottomNavigation>
                      </Box>
                    </div>
                  </form>
                ))}
          </DashboardWrapperMain>
          <DashboardWrapperRight>
            <div className="card border-0 mb-4  ">
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
            {Array.isArray(arrPostDarft) &&
              arrPostDarft
                .sort((a, b) => {
                  return (
                    new Date(b?.createdAt).getTime() -
                    new Date(a?.createdAt).getTime()
                  );
                })
                .map((post) => (
                  <Card sx={{ maxWidth: 270, marginBottom: 2 }}>
                    <CardMedia
                      component="img"
                      alt="green iguana"
                      height="140"
                      image={post?.img}
                    />
                    <CardContent>
                      <div className="row mb-2">
                        <div className="col-md-8">
                          <span
                            style={{
                              wordWrap: "break-word",
                              display: "block",
                              marginRight: -45,
                              overflow: "auto",
                              maxHeight: 35,
                            }}
                          >
                            {post?.title}
                          </span>
                        </div>{" "}
                        <div className="col-md-2" style={{ marginTop: -5 }}>
                          {" "}
                          <div style={styleStatus}>
                            {" "}
                            {post.status === "draft" && PostingDraft}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4" style={{ fontSize: 15 }}>
                          <CropIcon
                            className="d-block"
                            style={{ color: "#b48845" }}
                          />{" "}
                          {post?.roomSize}
                        </div>
                        <div className="col-md-4" style={{ fontSize: 15 }}>
                          {" "}
                          <RoofingOutlinedIcon
                            className="d-block"
                            style={{ color: "#b48845" }}
                          />{" "}
                          {post?.buildingName}
                        </div>
                        <div className="col-md-4 " style={{ fontSize: 15 }}>
                          <PriceChangeOutlinedIcon
                            className="d-block"
                            style={{ color: "#b48845" }}
                          />
                          {post?.roomPrice}{" "}
                        </div>
                      </div>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ maxHeight: 80, overflow: "auto" }}
                      >
                        {post?.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">
                        <DoneOutlinedIcon
                          sx={{ color: "green" }}
                          onClick={(event) =>
                            handlePostPending(event, post._id)
                          }
                        />
                      </Button>
                      <Button size="small">
                        {" "}
                        <DeleteOutlinedIcon
                          sx={{ color: "red" }}
                          onClick={(event) => handlePostRejct(event, post._id)}
                        />
                      </Button>
                    </CardActions>
                  </Card>
                ))}
          </DashboardWrapperRight>
        </DashboardWrapper>
        {/* modal */}
        {/* modal */}
      </div>
    </DataContext.Provider>
  );
}

export default Posting;
