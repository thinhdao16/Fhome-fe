import React, { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import DescriptionIcon from "@mui/icons-material/Description";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";
import CropOutlinedIcon from "@mui/icons-material/CropOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import Avatar from "react-avatar";
import { Rating } from "react-simple-star-rating";
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Textarea } from "@mui/joy";
import "./CreateRoom.scss";
function CreateRoom() {
  const localStorageDataBuildings = localStorage.getItem("buildings");
  const data = JSON.parse(localStorageDataBuildings);
  const dataOfBuildings = data.data.buildings;

  const [name, setName] = React.useState("")
  const [size, setSize] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [building, setBuilding] = React.useState("");
  console.log(building);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = JSON.parse(localStorage.getItem("access_token"));
    if (!token) {
      console.log("No access token found.");
      return;
    }
    var formData = new FormData();
    formData.append("roomName",name)
    formData.append("size", size);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("buildings", building);
    formData.append("img", selectedFile);

    axios
      .post("https://fhome-be.vercel.app/createRoom", formData, {
        headers: {
          Authorization: `Bearer ${token.data.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        // C???p nh???t d??? li???u m???i v??o state
        setDataRoom((prevData) => {
          return {
            ...prevData,
            rooms: [...prevData.rooms, response.data.data],
          };
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // L???y d??? li???u t??? server
    const fetchData = async () => {
      try {
        // const token = JSON.parse(localStorage.getItem("access_token"));
        // // console.log(token)
        // if (!token) {
        //   console.log("No access token found.");
        //   return;
        // }    
        // const headers = { Authorization: `Bearer ${token}` };
        const responses = await Promise.all([
          axios.get("https://fhome-be.vercel.app/getBuildings"),
          axios.get("https://fhome-be.vercel.app/getRooms"),
          axios.get("https://fhome-be.vercel.app/getAllUsers"),
        ]);
        const buildings = responses[0].data.data.buildings;
        const rooms = responses[1].data.data.rooms;
        const users = responses[2].data;
        const newData = rooms.map((room) => {
          const building = buildings.find((b) => b._id === room.buildings);
          const buildingName = building ? building.buildingName : "";

          const user = users.find((u) => u._id === room.users);
          const userEmail = user ? user.email : "";
          const userFullName = user ? user.fullname : "";
          const userImg = user ? user.img : "";
          return {
            ...room,
            buildingName,
            userEmail,
            userFullName,
            userImg,
          };
        });

        const buildingIds = buildings.map((post) => post.buildings);
        const filteredBuildingIds = buildings
          .filter((b) => buildingIds.includes(b._id))
          .map((b) => b._id);

        setDataRoom((prevState) => {
          return {
            ...prevState,
            buildings: newData,
            rooms,
            users,
            buildingIds: filteredBuildingIds,
          };
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const [dataRoom, setDataRoom] = useState({
    buildings: [],
    rooms: [],
    users: [],
  });
  const dataRooms = dataRoom.rooms;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  return (
    <div className="posting-list">
      <DashboardWrapper>
        <DashboardWrapperMain>
          <form onSubmit={handleSubmit} className="bg-drak">
            <div className="p-4 bg-white rounded-3">
              <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={2}>
                <Box gridColumn="span 1"></Box>
                <Box gridColumn="span 6">
                  <div className="mt-2  ms-2">
                    <span className="posting-list__titleName__date"></span>
                  </div>
                </Box>
              </Box>
              {/* <TextField
                fullWidth
                placeholder="description"
                id="fullWidth"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              /> */}
              <span className="m-3">
                <CropOutlinedIcon />
                Name
              </span>
              <Textarea
                name="Plain"
                placeholder="Type in here???"
                variant="plain"
                className="shadow rounded-3 mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="m-3">
                <CropOutlinedIcon />
                Size
              </span>
              <Textarea
                name="Plain"
                placeholder="Type in here???"
                variant="plain"
                className="shadow rounded-3 mb-3"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
              <span className="m-3">
                {" "}
                <MonetizationOnOutlinedIcon />
                Price
              </span>
              <Textarea
                name="Plain"
                placeholder="Type in here???"
                variant="plain"
                className="shadow rounded-3 mb-3"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ borderRadius: "50px" }}
              />

              <span className=" m-3">
                {" "}
                <DescriptionIcon />
                Description
              </span>
              <Textarea
                className="border-0 shadow rounded-3 mb-3"
                minRows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  boxShadow: `box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;`,
                }}
              />

              <div style={{ display: "flex" }}>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  style={{
                    border: "none",
                    maxHeight: "100px",
                    overflowY: "auto",
                  }}
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                >
                  <option value="" disabled>
                    Ch???n t??a nh??
                  </option>
                  {dataOfBuildings.map(
                    (
                      building,
                      index // Th??m tham s??? index v??o h??m map
                    ) => (
                      <option key={index} value={building?._id}>
                        {building?.buildingName}
                      </option>
                    )
                  )}
                </select>
                <span>
                  512 ???????ng Nguy???n Xi???n, Ph?????ng Long Th???nh M???, Qu???n 9, TP. Th???
                  ?????c
                </span>
              </div>
              <input type="file" onChange={handleFileChange} />
              <button type="submit">submit</button>
            </div>
          </form>
        </DashboardWrapperMain>
        <DashboardWrapperRight>
          <div className="scroll-container">
          {Array.isArray(dataRooms) &&
              dataRooms
                .sort((a, b) => {
                  return (
                    new Date(b?.updatedAt).getTime() -
                    new Date(a?.updatedAt).getTime()
                  );
                })
                .map((rooms) => (
                <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={rooms.img}
                    title="green iguana"
                  />
                  <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                      {rooms.roomName}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {rooms.buildingName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rooms.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">{rooms.price}</Button>
                    <Button size="small">{rooms.size}</Button>
                    <span style={{fontSize:15}}>  {new Date(rooms?.updatedAt).toLocaleString()}</span>
                  </CardActions>
                </Card>
              ))}
          </div>
        </DashboardWrapperRight>
      </DashboardWrapper>
    </div>
  );
}

export default CreateRoom;
