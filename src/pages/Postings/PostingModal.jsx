import * as React from "react";
import { Transition } from "react-transition-group";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { FormControl, FormLabel, Stack, TextField } from "@mui/material";
import {
  EmojiEmotions,
  Image,
  PersonAdd,
  VideoCameraBack,
} from "@mui/icons-material";
import Dropzone from "react-dropzone";
import axios from "axios";

export default function PostingModal() {
  const [open, setOpen] = React.useState(false);
  const localStorageDataBuildings = localStorage.getItem("buildings");
  const data = JSON.parse(localStorageDataBuildings);
  const dataOfBuildings = data.data.buildings;
  const localStorageDataProfile = localStorage.getItem("access_token");
  const dataProfile = JSON.parse(localStorageDataProfile);
  const dataProfiles = dataProfile.data.user;
  const [imagePreview, setImagePreview] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [building, setBuilding] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result;
      setSelectedFile({ file, preview });
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("buildings", building);
    formData.append("rooms", room);
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("https://fhome-be.vercel.app/postingNew", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Transition in={open} timeout={400}>
        {(state) => (
          <Modal
            keepMounted
            style={{
              overflowY: "auto",
            }}
            open={!["exited", "exiting"].includes(state)}
            onClose={() => setOpen(false)}
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 1,
                  backdropFilter: "none",
                  transition: `opacity 400ms, backdrop-filter 400ms`,
                  ...{
                    entering: { opacity: 1, backdropFilter: "blur(8px)" },
                    entered: { opacity: 1, backdropFilter: "blur(8px)" },
                  }[state],
                },
              },
            }}
            sx={{
              visibility: state === "exited" ? "hidden" : "visible",
            }}
          >
            <ModalDialog
              aria-labelledby="fade-modal-dialog-title"
              aria-describedby="fade-modal-dialog-description"
              sx={{
                backgroundColor: "white",
                opacity: 0,
                transition: `opacity 300ms`,
                ...{
                  entering: { opacity: 1 },
                  entered: { opacity: 1 },
                }[state],
              }}
            >
              <Typography id="fade-modal-dialog-title" component="h2">
                Tạo bài viết
              </Typography>
              <hr />
              <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={2}>
                <Box gridColumn="span 1">
                  <Link to="/home/profiles">
                    <Avatar
                      name="John Doe"
                      size="55"
                      round={true}
                      src={dataProfiles.img}
                    />
                  </Link>
                </Box>
                <Box gridColumn="span 6">
                  <div className="mt-2  ms-2">
                    <Link to="/home/profiles">
                      <span className="posting-list__titleName">
                        {dataProfiles.fullname}
                      </span>
                    </Link>
                    <span className="posting-list__titleName__date">user</span>
                  </div>
                </Box>
              </Box>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <TextField fullWidth id="fullWidth" value={title} onChange={(e) => setTitle(e.target.value)}/>
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <TextField fullWidth id="fullWidth" value={description} onChange={(e) => setDescription(e.target.value)}/>
              </FormControl>
              <div style={{ display: "flex" }}>
                <select
                  class="form-select"
                  aria-label="Default select example"
                  style={{
                    maxHeight: "100px", // đặt chiều cao tối đa cho menu
                    overflowY: "auto",
                  }}
                >
                  <option selected>Open this select menu</option>
                  {dataOfBuildings.map((buildings) => (
                    <option value={room} onChange={(e) => setRoom(e.target.value)}>{buildings.buildingName}</option>
                  ))}
                </select>
                <span value={building} onChange={(e) => setBuilding(e.target.value)}>
                  512 đường Nguyễn Xiển, Phường Long Thạnh Mỹ, Quận 9, TP. Thủ
                  Đức
                </span>
              </div>
              <Dropzone onDrop={handleDrop}>
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <Image
                            sx={{ marginRight: "25px" }}
                            color="secondary"
                          />
                        </div>
                      )}
                    </Dropzone>
              <Box
                sx={{
                  border: "2px solid #ccc",
                  borderRadius: "4px",
                  padding: "0px",
                }}
              >
                <Stack direction="row" gap={6} mt={2} mb={3}>
                  <Typography sx={{ fontSize: "17px" }}>
                    Thêm vào bài viết của bạn
                  </Typography>
                  <div sx={{ display: "flex" }}>
                    <EmojiEmotions
                      sx={{ marginRight: "25px" }}
                      color="primary"
                    />{" "}

                    <VideoCameraBack
                      sx={{ marginRight: "25px" }}
                      color="success"
                    />
                    <PersonAdd sx={{ marginRight: "25px" }} color="error" />
                  </div>
                </Stack>
              </Box>
              {imagePreview && <img src={imagePreview} alt="image preview" />}
            <button type="submit">submit</button>
            </ModalDialog>
          </Modal>
        )}
      </Transition>
    </form>
  );
}
