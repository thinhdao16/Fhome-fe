// import * as React from "react";
// import { Transition } from "react-transition-group";
// import Button from "@mui/joy/Button";
// import Modal from "@mui/joy/Modal";
// import ModalDialog from "@mui/joy/ModalDialog";
// import Typography from "@mui/joy/Typography";
// import { Box } from "@mui/system";
// import { Link } from "react-router-dom";
// import Avatar from "react-avatar";
// import { TextField } from "@mui/material";
// import { Image } from "@mui/icons-material";
// import Dropzone from "react-dropzone";
// import axios from "axios";

// export default function PostModal() {
//   const [open, setOpen] = React.useState(false);
//   const localStorageDataBuildings = localStorage.getItem("buildings");
//   const data = JSON.parse(localStorageDataBuildings);
//   const dataOfBuildings = data.data.buildings;
//   const localStorageDataProfile = localStorage.getItem("access_token");
//   const dataProfile = JSON.parse(localStorageDataProfile);
//   const dataProfiles = dataProfile.data.user;
//   const [imagePreview, setImagePreview] = React.useState(null);
//   const [title, setTitle] = React.useState("");
//   const [description, setDescription] = React.useState("");
//   const [room, setRoom] = React.useState("");
//   const [building, setBuilding] = React.useState("");
//   const [selectedFile, setSelectedFile] = React.useState(null);
//   const handleDrop = (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const reader = new FileReader();
//     reader.onload = () => {
//       const preview = reader.result;
//       setSelectedFile({ file, preview });
//       setImagePreview(preview);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("buildings", building);
//     formData.append("rooms", room);
//     formData.append("file", selectedFile);

//     try {
//       const response = await axios.post(
//         "https://fhome-be.vercel.app/postingNew",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <Button
//         variant="outlined"
//         color="neutral"
//         type="submit"
//         onClick={() => setOpen(true)}
//       >
//         Open modal
//       </Button>
//               <Typography id="fade-modal-dialog-title" component="h2">
//                 Tạo bài viết
//               </Typography>
//               <hr />
//               <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={2}>
//                 <Box gridColumn="span 1">
//                   <Link to="/home/profiles">
//                     <Avatar
//                       name="John Doe"
//                       size="55"
//                       round={true}
//                       src={dataProfiles.img}
//                     />
//                   </Link>
//                 </Box>
//                 <Box gridColumn="span 6">
//                   <div className="mt-2  ms-2">
//                     <Link to="/home/profiles">
//                       <span className="posting-list__titleName">
//                         {dataProfiles.fullname}
//                       </span>
//                     </Link>
//                     <span className="posting-list__titleName__date">user</span>
//                   </div>
//                 </Box>
//               </Box>
//               <TextField
//                 fullWidth
//                 id="fullWidth"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />
//               <TextField
//                 fullWidth
//                 id="fullWidth"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//               <div style={{ display: "flex" }}>
//                 <select
//                   className="form-select"
//                   aria-label="Default select example"
//                   style={{
//                     maxHeight: "100px", // đặt chiều cao tối đa cho menu
//                     overflowY: "auto",
//                   }}
//                   value={building}
//                   onChange={(e) => setBuilding(e.target.value)}
//                 >
//                   <option value="" disabled>
//                     Chọn tòa nhà
//                   </option>
//                   {dataOfBuildings.map((building) => (
//                     <option value={building.name}>{building.name}</option>
//                   ))}
//                 </select>

//                 <span
//                   value={building}
//                   onChange={(e) => setBuilding(e.target.value)}
//                 >
//                   512 đường Nguyễn Xiển, Phường Long Thạnh Mỹ, Quận 9, TP. Thủ
//                   Đức
//                 </span>
//               </div>
//               <Dropzone onDrop={handleDrop}>
//                 {({ getRootProps, getInputProps }) => (
//                   <div {...getRootProps()}>
//                     <input {...getInputProps()} />
//                     <Image sx={{ marginRight: "25px" }} color="secondary" />
//                   </div>
//                 )}
//               </Dropzone>
//               {imagePreview && <img src={imagePreview} alt="image preview" />}
//               <button type="submit">submit</button>
//     </form>
//   );
// }
