import * as React from "react";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { TextField } from "@mui/material";
import { Image } from "@mui/icons-material";
import Dropzone from "react-dropzone";
import axios from "axios";

export default function Upload() {
  const localStorageDataBuildings = localStorage.getItem("buildings");
  const data = JSON.parse(localStorageDataBuildings);
  const dataOfBuildings = data.data.buildings;
  const localStorageDataProfile = localStorage.getItem("access_token");
  const dataProfile = JSON.parse(localStorageDataProfile);
  const dataProfiles = dataProfile.data.user;
  const accessTokenUser = dataProfile.data.accessToken;

  const [imagePreview, setImagePreview] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [building, setBuilding] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  // const handleDrop = (acceptedFiles) => {
  //   const file = acceptedFiles[0];
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const preview = reader.result;
  //     setSelectedFile({ file });
  //     setImagePreview(preview);
  //   };
  //   reader.readAsDataURL(file);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = JSON.parse(localStorage.getItem("access_token"));
    // console.log(token)
    if (!token) {
      console.log("No access token found.");
      return;
    }

    var formData = new FormData();
    formData.append("img", selectedFile);

    axios
      .post("https://fhome-be.vercel.app/postingNew", { title: title, description: description, buildings: building, rooms: room }
        , {
          headers: {
            Authorization: `Bearer ${token.data.accessToken}`,
            "Content-Type": "application/json",
          },
        })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  return (
    <form onSubmit={handleSubmit}>
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
      <TextField
        fullWidth
        id="fullWidth"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        fullWidth
        id="fullWidth"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        fullWidth
        placeholder="room"
        id="fullWidth"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <div style={{ display: "flex" }}>
        <select
          className="form-select"
          aria-label="Default select example"
          style={{
            maxHeight: "100px",
            overflowY: "auto",
          }}
          value={building} onChange={(e) => setBuilding(e.target.value)}
        >
          <option value="" disabled>
            Chọn tòa nhà
          </option>
          {dataOfBuildings.map(
            (
              building,
              index // Thêm tham số index vào hàm map
            ) => (
              <option key={index} value={building._id}>
                {building._id}
              </option>
            )
          )}
        </select>

        <span>
          512 đường Nguyễn Xiển, Phường Long Thạnh Mỹ, Quận 9, TP. Thủ Đức
        </span>
      </div>
      <input type="file" onChange={handleFileChange} />
      {/* <Dropzone onDrop={handleDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Image sx={{ marginRight: "25px" }} color="secondary" />
                  </div>
                )}
              </Dropzone>
              {imagePreview && <img src={imagePreview} alt="image preview" />} */}
      <button type="submit">submit</button>
    </form>
  );
}
