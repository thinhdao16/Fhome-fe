import {
  Avatar,
  Button,
  ButtonGroup,
  Fab,
  Modal,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
// import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import {
  Add as AddIcon,
  DateRange,
  EmojiEmotions,
  Image,
  PersonAdd,
  VideoCameraBack,
} from "@mui/icons-material";

// import { IconButton } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';
// import './stylemodal.scss'

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

const Add = () => {
  const [open, setOpen] = useState(false);

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <>

      <Tooltip
        onClick={(e) => setOpen(true)}
        title="Delete"
        sx={{
          position: "fixed",
          bottom: 20,
          left: { xs: "calc(50% - 25px)", md: 30 },
        }}
      >
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>
      {/* Modal */}


      <StyledModal
        open={open}
        onClose={(e) => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box width={500} height={380} bgcolor="white" p={3} borderRadius={5}>
          <Typography variant="h4" color="gray" textAlign="center">Tạo bài viết</Typography>
          <hr width="100%" size="5px" align="center" color="gray" />
          <UserBox>

            <Avatar
              src="https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              sx={{ width: 55, height: 55, marginTop: 1 }}
            />
            <Typography fontWeight={700} sx={{ marginTop: -3 }} variant="span">Thịnh Đào</Typography>
            <FormControl sx={{ minWidth: 120, height: 10 }}>
              <Select sx={{ width: 120, height: 30, marginTop: 1, marginLeft: -11, backgroundColor: 'gray', color: 'white' }}

                value={age}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="">
                  Công khai
                </MenuItem>
                <MenuItem value={10}>Bạn bè</MenuItem>
                <MenuItem value={20}>Chỉ mình tôi</MenuItem>
                <MenuItem value={30}>Bạn bè cụ thể</MenuItem>
              </Select>
            </FormControl>


          </UserBox>
          <TextField
            sx={{ width: "100%" }}
            id="standard-multiline-static"
            multiline
            rows={5}
            placeholder="Thịnh Đào ơi, bạn đang nghỉ gì thế ?"
            variant="standard"
            placeholderTypographyProps={{ fontSize: 20 }}
            InputProps={{
              endAdornment: (
                <SentimentSatisfiedAltIcon sx={{ position: 'absolute', right: '10px', top: '80%', transform: 'translateY(-50%)' }} />
              )
            }}
          />

          <Box sx={{ border: '2px solid #ccc', borderRadius: '4px', padding: '0px' }}>
            <Stack direction="row" gap={6} mt={2} mb={3}>
              <Typography sx={{ fontSize: '17px' }}>Thêm vào bài viết của bạn</Typography>
              <div sx={{ display: 'flex' }}>
                <EmojiEmotions sx={{ marginRight: '25px' }} color="primary" />
                <Image sx={{ marginRight: '25px' }} color="secondary" />
                <VideoCameraBack sx={{ marginRight: '25px' }} color="success" />
                <PersonAdd sx={{ marginRight: '25px' }} color="error" />
                <MoreHorizIcon />
              </div>
            </Stack>
          </Box>

          <ButtonGroup
            sx={{ marginTop: '10px' }}
            fullWidth
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button>Đăng</Button>
            <Button sx={{ width: "100px" }}>
              <DateRange />
            </Button>
          </ButtonGroup>
        </Box>
      </StyledModal>

    </>
  );
};

export default Add;
