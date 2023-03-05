import React, { useState } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";
import Avatar from "react-avatar";
import { Rating } from "react-simple-star-rating";

function CreateRoom() {

  const [value, setValue] = React.useState(0);
  return (
    <div className="posting-list">
      <DashboardWrapper>
        <DashboardWrapperMain>
          <form className="card shadow-sm bg-body rounded-3 border-0">
            <div className="card-body"></div>
          </form>
          <form className="mt-3">
            <div className="card p-3 shadow-sm bg-body rounded-3 border-0">
              <div className="row">
                <div className="col-md-1">
                  <Avatar
                    name="John Doe"
                    size="40"
                    round={true}
                  />
                </div>
                <div className="col-md-11">
                  <div>
                    <span className="posting-list__titleName">thịnh đào</span>
                    <span className="posting-list__titleName__date">
                      1 tháng 3 lúc 10:03
                    </span>
                  </div>
                </div>
              </div>

              <div className="posting-img rounded-3">
                <div className="px-5">
                  <img
                    className="rounded-3"
                    src="https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/334252997_1137915373570538_7254530606042011463_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=0LGQuCMKq8MAX90HgLu&_nc_ht=scontent.fsgn5-8.fna&oh=00_AfCqHNi4xdkye3JyR4YnrleEhexZDFffrpOkvI4QsfONvA&oe=64036A4D"
                    alt=""
                  />
                </div>
              </div>
              <div className=" mx-4 my-2 ">
                <div className="float-start posting-list__feel">4.9rating</div>
                <div className="float-end">
                  <a href="" className="posting-list__feel">
                    {" "}
                    233 comment
                  </a>
                </div>
              </div>
              <hr className="posting-list__hr" />
              {/* <div className="px-5 text-center   ">
                <div className="float-start">
                  {" "}
                  <div>
                    <div className="d-inline">
                      {" "}
                      <Rating
                        onClick={handleRating}
                        ratingValue={rating}
                        size={20}
                        label
                        transition
                        fillColor="orange"
                        emptyColor="gray"
                        className="foo" 
                      />
                    </div>
                    <span className="posting-list__feel__icon">{rating}</span>
                  </div>
                </div>
                <div className="d-block">
                  <Link to=""> <ReportGmailerrorredIcon/> Báo cáo</Link>
                </div>
                <div className="float-end">
                  <a href="" className="posting-list__feel__icon">
                    {" "}
                    <i className="bx bx-message-square-dots me-2 "></i>Comment
                  </a>
                </div>
              </div> */}

              <Box sx={{}}>
                <BottomNavigation
                  showLabels
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                >
                  <BottomNavigationAction
                    // label={rating}
                    icon={
                      <Rating
                        // onClick={handleRating}
                        // ratingValue={rating}
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
                    icon={<ChatBubbleOutlineIcon />}
                  />
                  <BottomNavigationAction
                    label="Báo cáo"
                    icon={<ReportGmailerrorredIcon />}
                  />
                </BottomNavigation>
              </Box>
            </div>
          </form>
        </DashboardWrapperMain>
        <DashboardWrapperRight>
          <div className="card border-0">
            <div className="row"></div>
          </div>
        </DashboardWrapperRight>
      </DashboardWrapper>
    </div>
  );
}

export default CreateRoom;
