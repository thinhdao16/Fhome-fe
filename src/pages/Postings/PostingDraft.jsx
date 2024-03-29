import {
  Avatar,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  styled,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import Dropzone from "react-dropzone";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { Textarea } from "@mui/joy";
import toastr from "cogo-toast";

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

const PostingDarft = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [success, setSuccess] = useState(false);
  const [roomIds, setRoomIds] = useState([]);
  const localStorageDataBuildings = localStorage.getItem("buildings");
  const data = JSON.parse(localStorageDataBuildings);
  const dataOfBuildings = data?.data?.buildings;
  // console.log(dataOfBuildings);
  const roomUserId = roomIds?.data?.rooms;
  // console.log(roomUserId);
  const userPosting = JSON.parse(localStorage.getItem("access_token"));
  const userPostings = userPosting.data.user;
  if (roomUserId) {
    // console.log(roomUserId);
  } else {
    // console.log("Không tìm thấy thông tin phòng!");
  }

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);

  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [buildingName, setBuildingName] = useState("");
  const [buildingId, setBuildingId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = JSON.parse(localStorage.getItem("access_token"));
   
    if (!token) {
      console.log("No access token found.");
      return;
    }

    var formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("buildings", buildingId);
    formData.append("rooms", room);
    formData.append("img", buildingId);
    let isMounted = true;

    try {
      const response = await axios.post(
        "https://fhome-be.vercel.app/createPosting",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.data.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toastr.success("Post successfully", {
        position: "top-right",
        heading: "Done",
      });
      if (isMounted) {
        console.log(response.data);
        setOpen(false);
      }
    } catch (error) {
      toastr.error("Can not post", {
        position: "top-right",
        heading: "Done",
      });
      console.error(error);
    }
    return () => {
      isMounted = false;
    };
  };
  const handleDelete = () => {
    setSelectedFile(null);
    setShowDeleteButton(false);
  };
  const handleFileChange = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };
  const handleGetRoomUpdate = () => {
    setOpen(true);
    const token = JSON.parse(localStorage.getItem("access_token"));
    const headers = { Authorization: `Bearer ${token.data.accessToken}` };
    axios
      .get("https://fhome-be.vercel.app/getRoomsByUserId", { headers })
      .then((response) => {
        const roomIds = response.data;
        if (roomIds) {
          setRoomIds(roomIds);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function getBuildingName(roomId) {
    const room = roomUserId.find((room) => room?._id === roomId);
    const building = dataOfBuildings.find(
      (building) => building?._id === room?.buildings
    );
    setBuildingName(building?.buildingName);
    setBuildingId(building?._id);
  }


  return (
    <>
      <Button
        onClick={handleGetRoomUpdate}
        variant="contained"
        fullWidth={true}
        className="rounded-5 bg-light shadow-none text-secondary"
      >
        PostingDraft
      </Button>
      {/* Modal */}
      <StyledModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit}>
          <Box
            style={{ position: "relative" }}
            width={500}
            maxHeight={480}
            bgcolor="white"
            p={3}
            borderRadius={5}
            overflow="auto"
          >
            <Typography color="gray" textAlign="center">
              Tạo bài viết
            </Typography>
            <hr width="100%" size="5px" align="center" color="gray" />
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
              >
                <AccountCircleOutlinedIcon /> {userPostings.roleName}
              </Typography>
            </UserBox>
            <Textarea
              name="Plain"
              placeholder="title"
              variant="plain"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              sx={{ width: "100%", minHeight: 90 }}
              id="standard-multiline-static"
              multiline
              rows={5}
              placeholder={`${userPostings.fullname} ơi bạn muốn đăng gì thế ?`}
              variant="standard"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="col-md-6">
                {" "}
                <FormControl sx={{ minWidth: 180 }} size="small">
                  <span className="text-dark fs-6 mt-2">Building: {room && buildingName}</span>
                </FormControl>
              </div>
              <div className="col-md-6">
                {" "}
                <FormControl sx={{ minWidth: 180 }} size="small">
                  <InputLabel id="demo-select-small">Room</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={room}
                    label="Room"
                    onChange={(e) => {
                      setRoom(e.target.value);
                      getBuildingName(e.target.value);
                    }}
                    style={{ maxHeight: "50px", overflowY: "auto" }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {roomUserId?.map((room) => (
                      <MenuItem key={room._id} value={room._id}>
                        {room.roomName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <Typography
                style={{ fontSize: "15px", margin: 10, color: "black" }}
              >
                Đ. Nguyễn Xiển, Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh
                700000{" "}
              </Typography>
            </div>
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
        </form>
      </StyledModal>
      {success && setOpen(false)} {/* close the modal when success is true */}
    </>
  );
};

export default PostingDarft;
