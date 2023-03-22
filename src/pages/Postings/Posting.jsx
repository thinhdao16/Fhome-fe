import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";
import Avatar from "react-avatar";
import "./posting.scss";
import { Link } from "react-router-dom";
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
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import Dropzone from "react-dropzone";

function Posting({ children, filePath }) {
  const userPosting = JSON.parse(localStorage.getItem("access_token"));
  const userPostings = userPosting?.data?.user;

  const { posting, setPosting, allCmt, setAllCmt, isLiked, setIsLiked } =
    useContext(DataContext);

  const [postingPush, setPostingPush] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://fhome-be.vercel.app/getFavouriteByUser",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userPosting.data.accessToken}`,
            },
          }
        );
        setIsLiked(response.data?.data?.favourite);

        const responsePost = await axios.get(
          "https://fhome-be.vercel.app/posts/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userPosting.data.accessToken}`,
            },
          }
        );
        setPostingPush(responsePost?.data?.data);

        const responsePostComment = await axios.get(
          "https://fhome-be.vercel.app/allComment/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userPosting.data.accessToken}`,
            },
          }
        );
        setAllCmt(responsePostComment?.data?.data?.postingComments);
      } catch (error) {
        toastr.error("Can not find post", {
          position: "top-right",
          heading: "Done",
        });
      }
    };
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    if (postingPush?.postings?.length > 0) {
      setPosting(postingPush?.postings);
    }
  }, [postingPush?.postings]);

  const arrPostPublish = useMemo(() => {
    if (!postingPush) return [];
    return postingPush?.postings?.filter(
      (posting) => posting.status === "published"
    );
  }, [postingPush]);
  console.log(arrPostPublish);
  const arrPostDarft = useMemo(() => {
    if (!postingPush) return [];

    return postingPush?.postings?.filter(
      (posting) => posting.status === "draft"
    );
  }, [postingPush]);
  const postCommentRef = useRef(null);
  const [value, setValue] = React.useState(0);

  const [selectedPost, setSelectedPost] = useState(null);

  function handleCommentPost(event, id) {
    event.preventDefault();
    const index = postingPush?.postings?.findIndex((item) => item._id === id);
    const idDataPost = postingPush?.postings[index];
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
        .put(
          `https://fhome-be.vercel.app/posts/confirm/${id}`,
          {
            status: "pending",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userPosting.data.accessToken}`,
            },
          }
        )
        .then((response) => {
          toastr.success("Successfully you wait pls", {
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
        .delete(`https://fhome-be.vercel.app/posts/delete/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userPosting.data.accessToken}`,
          },
        })
        .then((response) => {
          toastr.success("delêt successfully", {
            position: "top-right",
            heading: "Done",
          });
        })
        .catch((error) => {
          toastr.error("delete fail", {
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
        "https://fhome-be.vercel.app/createFavouritePost",
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
    const idLike = isLiked?.filter((like) => like?.post?._id === id)?.[0]._id;
    event.preventDefault();
    axios
      .delete(`https://fhome-be.vercel.app/deleteFavouritePost/${idLike}`, {
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
  const PostingPublic = <PublicOutlinedIcon style={{ color: "green" }} />;

  return (
    <>
      {/* {isLoading && (
      <Loading loading background="#666" loaderColor="#fff" />
    )} */}
      <DataContext.Provider value={{ selectedPost, arrPostPublish }}>
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
                    </div>
                  </div>
                  <hr className="mx-1" />
                  <div className="row px-3 ">
                    <div className="col-md-4 text-center">Video trực tiếp</div>
                    <div className="col-md-4 text-center">Ảnh/video</div>
                    <div className="col-md-4 text-center">
                      Cảm xúc/hoạt động
                    </div>
                  </div>
                </div>
              </form>
              {Array.isArray(arrPostPublish) &&
                arrPostPublish
                  .sort((a, b) => {
                    return (
                      new Date(b?.updatedAt).getTime() -
                      new Date(a?.updatedAt).getTime()
                    );
                  })
                  .map((post) => (
                    <form className="mt-3">
                      <div className="card p-3 shadow-sm bg-body rounded-3 border-0">
                        <div className="row">
                          <div className="col-md-1">
                            <Avatar
                              name={post?.userPosting?.fullname}
                              size="40"
                              round={true}
                              src={post?.userPosting?.img}
                            />
                          </div>
                          <div className="col-md-11">
                            <div>
                              <span className="posting-list__titleName">
                                {post?.userPosting?.fullname}
                              </span>
                              <span className="posting-list__titleName__date">
                                {new Date(post?.updatedAt).toLocaleString()}
                              </span>
                              <span className="ms-2">
                                {post?.status === "published" && PostingPublic}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="fs-6 posting-list__color-text mt-2  d-block fw-bolder">
                          {post?.title}
                        </span>
                        <div className="row text-dark">
                          <div className="col-md-4 text-center">
                            <CropIcon style={{ color: "#b48845" }} />{" "}
                            {post?.rooms?.size}
                          </div>
                          <div className="col-md-4 text-center">
                            {" "}
                            <RoofingOutlinedIcon
                              style={{ color: "#b48845" }}
                            />{" "}
                            {post?.buildings?.buildingName}
                          </div>
                          <div className="col-md-4 text-center">
                            <PriceChangeOutlinedIcon
                              style={{ color: "#b48845" }}
                            />
                            {post?.rooms?.price}{" "}
                          </div>
                        </div>
                        <span className="fs-6 posting-list__color-text my-2 d-block">
                          {post?.description}
                        </span>
                        <img
                          className="rounded-3 mt-3"
                          src={post?.img}
                          alt=""
                        />
                        <div className=" mx-4 my-2 ">
                          <div className="float-start posting-list__feel">
                            {
                              isLiked?.filter?.(
                                (like) => like?.post?._id === post?._id
                              )?.length
                            }{" "}
                            like
                          </div>
                          <div className="float-end">
                            <a href="" className="posting-list__feel">
                              {" "}
                              {
                                allCmt?.filter?.(
                                  (cmt) => cmt?.posting?._id === post?._id
                                )?.length
                              }{" "}
                              bình luận
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
                                isLiked?.filter(
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
                              onClick={(event) =>
                                handleDisLike(event, post?._id)
                              }
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
                      <span className="posting-list__titleName__date">
                        user
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {Array.isArray(arrPostDarft) &&
                arrPostDarft
                  .sort((a, b) => {
                    return (
                      new Date(b?.updatedAt).getTime() -
                      new Date(a?.updatedAt).getTime()
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
                            {post?.rooms?.size}
                          </div>
                          <div className="col-md-4" style={{ fontSize: 15 }}>
                            {" "}
                            <RoofingOutlinedIcon
                              className="d-block"
                              style={{ color: "#b48845" }}
                            />{" "}
                            {post?.buildings?.buildingName}
                          </div>
                          <div className="col-md-4 " style={{ fontSize: 15 }}>
                            <PriceChangeOutlinedIcon
                              className="d-block"
                              style={{ color: "#b48845" }}
                            />
                            {post?.rooms?.price}{" "}
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
                            onClick={(event) =>
                              handlePostRejct(event, post._id)
                            }
                          />
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
            </DashboardWrapperRight>
          </DashboardWrapper>
        </div>
      </DataContext.Provider>
    </>
  );
}

export default Posting;

// const [dataPosting, setDataPosting] = useState({
//   buildings: [],
//   postings: [],
//   rooms: [],
//   users: [],
// });
// const arrPost = useMemo(() => dataPosting?.postings, [dataPosting]);
// const responses = await Promise.all([
//   axios.get("https://fhome-be.vercel.app/getBuildings"),
//   axios.get("https://fhome-be.vercel.app/getAllStatus"),
//   axios.get("https://fhome-be.vercel.app/getRooms"),
//   axios.get("https://fhome-be.vercel.app/getAllUsers"),
// ]);
// const buildings = responses[0].data.data.buildings;
// const postings = responses[1].data.data.postings;
// const rooms = responses[2].data.data.rooms;
// const users = responses[3].data;
// const newData = postings.map((post) => {
//   const building = buildings.find((b) => b._id === post.buildings);
//   const buildingName = building ? building.buildingName : "";
//   const room = rooms.find((r) => r._id === post.rooms);
//   const roomPrice = room ? room?.price : "";
//   const roomSize = room ? room?.size : "";
//   const roomName = room ? room?.roomName : "";

//   const user = users.find((u) => u._id === post?.userPosting?._id);
//   const userEmail = user ? user.email : "";
//   const userFullName = user ? user.fullname : "";
//   const userImg = user ? user.img : "";

//   return {
//     ...post,
//     buildingName,
//     roomName,
//     roomPrice,
//     roomSize,
//     userEmail,
//     userFullName,
//     userImg,
//   };
// });

// const buildingIds = newData.map((post) => post?.buildings);
// const filteredBuildingIds = buildings
//   .filter((b) => buildingIds.includes(b?._id))
//   .map((b) => b?._id);

// setDataPosting({
//   users,
//   rooms,
//   buildings,
//   postings: newData,
//   buildingIds: filteredBuildingIds,
// });

// // Get favorites
// const response = await axios.get(
//   "https://fhome-be.vercel.app/getFavouriteByUser",
//   {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${userPosting.data.accessToken}`,
//     },
//   }
// );
// setIsLiked(response.data);
