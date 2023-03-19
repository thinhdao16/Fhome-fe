import { Link } from "react-router-dom";
import "./profile.scss";
import toastr from "cogo-toast";
import { DataContext } from "../DataContext";
import { useContext, useEffect, useState } from "react";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";
import { CommentBankOutlined } from "@mui/icons-material";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

import axios from "axios";
import { toast } from "react-toastify";
import Avatar from "react-avatar";
import { Box } from "@mui/system";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Rating } from "react-simple-star-rating";
import PostComment from "../Postings/PostComment";
import CropIcon from "@mui/icons-material/Crop";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import Dropzone from "react-dropzone";

import DraftsIcon from "@mui/icons-material/Drafts";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";

const Profile = () => {
  const userProfile = JSON.parse(localStorage.getItem("access_token"));
  const userProfiles = userProfile?.data;
  const [profilePost, setProfilePost] = useState([]);
  const arrayProfilePost = profilePost?.data?.postings;
  const [value, setValue] = useState(0);
  const [rating, setRating] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [profileUpdate, setProfileUpdate] = useState([]);

  const [dataProfile, setDataProfile]= useState([])
  // console.log(dataProfile)
  const [fullName, setFullName] = useState(userProfiles?.user?.fullname);
  const [email, setEmail] = useState(userProfiles?.user?.email);
  const [phone, setPhone] = useState(userProfiles?.user?.phoneNumber);
  const [newImage, setNewImage] = useState(null);

  const handleRating = (rate) => {
    setRating(rate);
  };

  function handleCommentPost(event, id) {
    event.preventDefault();
    const index = arrayProfilePost.findIndex((item) => item._id === id);
    const idDataPost = arrayProfilePost[index];
    setSelectedPost(idDataPost);
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/getAllStatus", )
      .then((response) => {
        toast.success("Successfully!");
        setProfilePost(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios.get(
      `http://localhost:3000/userProfile/${userProfiles.user.id}`)
        .then((response) => {
          toast.success("Get profile Successfully!");
          setDataProfile(response.data);
        })
        .catch((error) => {
          console.error(error);
        }
    );
  });

  const handleSubmitFormProfile = async (e) => {
    e.preventDefault();
    var formData = new FormData();
    formData.append("fullname", fullName);
    formData.append("email", email);
    formData.append("phoneNumber", phone);
    formData.append("img", newImage);
    try {
      const response = await axios.put(
        `http://localhost:3000/userProfile/${userProfiles.user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userProfiles.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const roomIds = response.data;
      if (roomIds) {
        setProfileUpdate(roomIds);
      }
      toastr.success("Update successfully", {
        position: "top-right",
        heading: "Done",
      });
    } catch (error) {
      toastr.error("Can not updateProfile", {
        position: "top-right",
        heading: "Done",
      });
      console.error(error);
    }
  };
  const handleDrop = (acceptedFiles) => {
    setNewImage(acceptedFiles[0]);
  };


  const PostingDraft = <DraftsIcon style={{ color: "brown" }} />;
  const PostingPending = <PendingIcon style={{ color: "blue" }} />;
  const PostingAprove = (
    <CheckCircleOutlineOutlinedIcon style={{ color: "violet" }} />
  );
  const PostingPublic = <PublicOutlinedIcon style={{ color: "green" }} />;
  const PostingReject = <ThumbDownAltOutlinedIcon style={{ color: "red" }} />;
  return (
    <DataContext.Provider value={{ selectedPost }}>
      <div className="posting-list">
        <DashboardWrapper>
          <DashboardWrapperMain>
            {Array.isArray(arrayProfilePost) &&
              arrayProfilePost
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
                            <span className="ms-2">{ post.status === "approved" && PostingAprove  }</span>
                            <span className="ms-2">{ post.status === "draft" && PostingDraft  }</span>
                            <span className="ms-2">{ post.status === "pending" && PostingPending  }</span>
                            <span className="ms-2">{ post.status === "rejected" && PostingReject  }</span>
                            <span className="ms-2">{ post.status === "pulished" && PostingPublic  }</span>
                          </div>
                        </div>
                      </div>
                      <span className="fs-6 posting-list__color-text mt-2 ms-2 d-block fw-bolder">
                        {post?.title}
                      </span>
                      <div className="row text-dark">
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
                      <span className="fs-6 posting-list__color-text my-2 ms-2 d-block">
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
                            icon={<CommentBankOutlined />}
                          />
                          <div>
                            <button
                              onClick={(event) =>
                                handleCommentPost(event, post._id)
                              }
                            >
                              submit
                            </button>
                            <PostComment />
                          </div>
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
          </DashboardWrapperMain>
          <DashboardWrapperRight>
            <div className="scroll-container">
              <div className="body-profile">
                <form onSubmit={handleSubmitFormProfile}>
                  <div className="text-dark">
                    <div className="text-center">
                      <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Avatar
                              name={dataProfile?.fullname}
                              size="160"
                              round={true}
                              src={
                                newImage
                                  ? URL.createObjectURL(newImage)
                                  : dataProfile?.img
                              }
                              className="shadow-sm"
                            />
                          </div>
                        )}
                      </Dropzone>
                      <h4 className="mt-2">{dataProfile?.fullname}</h4>
                    </div>
                    <hr />
                    <div className="row">
                      <div className=" personal-info">
                        <div className="form-group">
                          <label className="control-label ms-1">
                            Full name:
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                setFullName(dataProfile?.fullname);
                              }
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className=" control-label ms-1">Email:</label>
                          <input
                            className="form-control"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                setEmail(dataProfile?.email);
                              }
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className=" control-label ms-1">Phone:</label>
                          <input
                            className="form-control"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                setEmail(dataProfile?.phoneNumber);
                              }
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className=" control-label ms-1">
                            AdminID:
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            defaultValue={dataProfile?.id}
                          />
                        </div>
                        <div className="form-group">
                          <label className=" control-label ms-1">
                            Username:
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            defaultValue={dataProfile?.roleName}
                          />
                        </div>
                        <div className="form-group text-center">
                          <label className=" control-label" />
                          <input
                            type="submit"
                            className="btn btn-primary me-2 shadow"
                            value="Save"
                          />
                          <input
                            type="reset"
                            className="btn btn-default shadow ms-2"
                            value="Cancel"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </DashboardWrapperRight>
        </DashboardWrapper>
      </div>
    </DataContext.Provider>
  );
};
export default Profile;
