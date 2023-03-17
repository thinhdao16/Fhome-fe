import {
  Avatar,
  Button,
  ButtonGroup,
  Modal,
  styled,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import Dropzone from "react-dropzone";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { Textarea } from "@mui/joy";
import { DataContext } from "../DataContext";
import CropIcon from "@mui/icons-material/Crop";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
});

const PostComment = () => {
  const [open, setOpen] = useState(true);
  const [commentButtonClicked, setCommentButtonClicked] = useState(false);

  const handleClose = () => setOpen(false);

  const [success, setSuccess] = useState(false);

  const userPosting = JSON.parse(localStorage.getItem("access_token"));
  const userPostings = userPosting.data.user;

  const { selectedPost, arrPost } = useContext(DataContext);
  const [description, setDescription] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const token = JSON.parse(localStorage.getItem("access_token"));
  // console.log(token)

  const [comments, setComments] = React.useState([]);
  // console.log(comments[1]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedPostComment = selectedPost?._id;
    console.log(selectedPostComment);
    var formData = new FormData();
    formData.append("description", description);
    formData.append("img", selectedFile);
    formData.append("posting", selectedPostComment);
    let isMounted = true;
    try {
      const response = await axios.post(
        "https://fhome-be.vercel.app/postAllPostingCommentByPost",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.data.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (isMounted) {
        console.log(response.data);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
    return () => {
      isMounted = false;
    };
  };
  useEffect(() => {
    if (!selectedPost) return;

    const fetchComments = async () => {
      try {
        const selectedPostComment = selectedPost._id;
        const response = await axios.get(
          `https://fhome-be.vercel.app/getAllPostingCommentByPost/${selectedPostComment}`,
          {
            headers: {
              Authorization: `Bearer ${token.data.accessToken}`,
            },
          }
        );
        setComments(response.data.data.postingComments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [selectedPost]);

  // const roomUserId = JSON.parse(localStorage.getItem("roomIds")).data.rooms;

  const handleDelete = () => {
    setSelectedFile(null);
    setShowDeleteButton(false);
  };
  const handleFileChange = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const handleGetRoomUpdate = () => {
    setCommentButtonClicked(true);
    setOpen(false);
  };
  if (!selectedPost) {
    return null;
  }

  return (
    <>
{commentButtonClicked ? null : (
      <Button
        onClick={handleGetRoomUpdate}
        variant="contained"
        // fullWidth={true}
        className="rounded-5 bg-light shadow-none text-secondary"
      >
        Comment
      </Button>
)}

      {/* Modal */}
      <StyledModal
        // onClick={handleGetRoomUpdate}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit}>
          <Box
            style={{ position: "relative" }}
            width={700}
            height={650}
            bgcolor="white"
            p={3}
            borderRadius={5}
            overflow="auto"
          >
            <Typography color="gray" textAlign="center">
              Bài viết
            </Typography>
            <hr width="100%" size="5px" align="center" color="gray" />
            <div className="p-3 bg-body rounded-3 border-0">
              <div className="row">
                <div className="col-md-1">
                  <Avatar
                    name={selectedPost?.userFullName}
                    size="40"
                    round={true}
                    src={selectedPost?.userImg}
                  />
                </div>
                <div className="col-md-11">
                  <div>
                    <span className="posting-list__titleName">
                      {selectedPost?.userFullName}
                    </span>
                    <span className="posting-list__titleName__date">
                      {new Date(selectedPost?.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <span className="fs-6 posting-list__color-text mt-2  d-block fw-bolder">
                {selectedPost?.title}
              </span>
              <div className="row">
                <div className="col-md-4 text-center">
                  {/* <CropIcon /> {dataPost.roomSize} */}
                </div>
                <div className="col-md-4 text-center">
                  {" "}
                  <RoofingOutlinedIcon /> {selectedPost?.buildingName}
                </div>
                <div className="col-md-4 text-center">
                  <PriceChangeOutlinedIcon />
                  {selectedPost?.roomPrice}{" "}
                </div>
              </div>
              <span className="fs-6 posting-list__color-text my-2 d-block">
                {selectedPost?.description}
              </span>
              <img
                className="rounded-3 mt-3"
                src={selectedPost?.img}
                alt=""
                style={{ maxWidth: 600 }}
              />
              <hr className="posting-list__hr" />
            </div>
            {Array.isArray(comments) &&
              comments
                .sort((a, b) => {
                  return (
                    new Date(b?.updatedAt).getTime() -
                    new Date(a?.updatedAt).getTime()
                  );
                })
                .map((commentss) => (
                  <Box>
                    <div className="row my-3">
                      <div className="col-md-1">
                        {" "}
                        <Avatar
                          name={commentss.userPostingComment.fullname}
                          size="10"
                          round={true}
                          src={commentss.userPostingComment?.img}
                        />
                      </div>
                      <div className="col-md-11 rounded-3">
                        <div
                          className="bg-light p-2 rounded-4"
                          style={{ width: "fit-content" }}
                        >
                          {" "}
                          <span className="fw-bolder fs-6 text-dark">
                            {commentss.userPostingComment.fullname}
                          </span>
                          <span className="d-block fs-6 text-dark">
                            {commentss.description}
                          </span>
                        </div>
                        <span className="d-block fs-6 text-dark">
                          {new Date(commentss?.updatedAt).toLocaleString()}
                        </span>
                        <img
                          src={commentss?.img}
                          alt="err"
                          style={{ maxWidth: 200, borderRadius: 15 }}
                        />
                      </div>
                    </div>
                  </Box>
                ))}
            <Box>
              <UserBox>
                <Avatar
                  src={userPostings.img}
                  sx={{ width: 55, height: 55, marginTop: 1 }}
                />
                <Typography
                  fontWeight={500}
                  sx={{
                    marginTop: -3,
                    color: "black",
                    fontSize: ".875rem",
                    fontWeight: 600,
                  }}
                  variant="span"
                >
                  {userPostings.fullname}
                </Typography>
                <Typography
                  style={{
                    marginLeft: -68,
                    marginTop: 30,
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    backgroundColor: "#e4e6eb",
                    boxShadow: "rgb(149 157 165 / 20%) 0px 8px 24px",
                    padding: "2px 4px",
                    borderRadius: "10px",
                    color: "black",
                  }}
                ></Typography>
              </UserBox>
              <Textarea
                sx={{ width: "100%" }}
                id="standard-multiline-static"
                multiline
                rows={5}
                placeholder={`${userPostings.fullname} ơi bạn muốn đăng gì thế ?`}
                variant="standard"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Dropzone onDrop={handleFileChange} accept="image/*">
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {selectedFile ? (
                      <div>
                        <img
                          className="rounded-3 shadow"
                          src={URL.createObjectURL(selectedFile)}
                          alt="preview"
                        />
                        {showDeleteButton && (
                          <button onClick={handleDelete}>Delete</button>
                        )}
                      </div>
                    ) : (
                      <p
                        className="text-center"
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#65676b",
                        }}
                      >
                        <ImageOutlinedIcon
                          style={{ fontSize: "30px", color: "#6ab175" }}
                        />{" "}
                        Thêm ảnh
                      </p>
                    )}
                  </div>
                )}
              </Dropzone>

              <ButtonGroup style={{ position: "absolute", width: "90%" }}>
                <Button variant="contained" fullWidth={true} type="submit">
                  Click me
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        </form>
      </StyledModal>
      {success && setOpen(false)} {/* close the modal when success is true */}
    </>
  );
};

export default PostComment;
