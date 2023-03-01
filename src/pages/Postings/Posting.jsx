import React, { useState } from "react";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";
import OverallList from "../../components/overall-list/OverallList";
import RevenueList from "../../components/revenue-list/RevenueList";
import Avatar from "react-avatar";
import { Rating } from "react-simple-star-rating";
import "./posting.scss";
function Posting() {
  const [rating, setRating] = useState(0); // initial rating value

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
    // Some logic
  };
  return (
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
                    src="https://www.example.com/image.jpg"
                  />
                </div>
                <div className="col-md-11">
                  <div
                    class="btn d-block rounded-5 posting-list__whwant"
                    data-bs-toggle="modal"
                    href="#exampleModalToggle"
                    role="button"
                  >
                    Dao oi, ban muon dang gi
                  </div>
                </div>
              </div>
              <hr className="mx-1" />
              <div class="row px-3 ">
                <div class="col-md-4 text-center">Video trực tiếp</div>
                <div class="col-md-4 text-center">Ảnh/video</div>
                <div class="col-md-4 text-center">Cảm xúc/hoạt động</div>
              </div>
            </div>
          </form>
          <form className="mt-3">
            <div className="card p-3 shadow-sm bg-body rounded-3 border-0">
              <div className="row">
                <div className="col-md-1">
                  <Avatar
                    name="John Doe"
                    size="40"
                    round={true}
                    src="https://www.example.com/image.jpg"
                  />
                </div>
                <div className="col-md-11">
                  <div>
                    <span className="posting-list__titleName">
                      thịnh đào
                    </span>
                    <span className="posting-list__titleName__date">
                      1 tháng 3 lúc 10:03
                    </span>
                  </div>
                </div>
              </div>
              <span className="fs-6 posting-list__color-text my-2 d-block">
                PHÉP THỬ ĐƠN GIẢN: “Với số tiền x triệu Việt Nam Đồng (X từ tiểu
                học, trung học tới đại học, cao học), tao có thể mua được brand
                quốc tế A, B, C thay vì mua một local brand (Việt) .” Lời khẳng
                định đanh như thép, chất như nước cất này là một “tấm bùa hộ
                mệnh” dành cho bất kỳ một ai đang là anti-local brands hay có
                một cái nhìn “ác cảm” đối với những thương hiệu Việt hiện tại.
                Cũng đúng thôi vì đó là “hậu quả xấu” sau những tin nào là:
                Local brand ăn cắp ý tưởng, local brands làm chất lượng kém,
                local brands đấu giá những sản phẩm lên tới chục triệu. Nhưng đó
                thực sự có phải là một “Tấm bùa hộ mệnh” quy chuẩn.
              </span>
              <div className="posting-img rounded-3">
                <div className="px-5">
                  <img
                    className="rounded-3"
                    src="https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/334252997_1137915373570538_7254530606042011463_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=0LGQuCMKq8MAX90HgLu&_nc_ht=scontent.fsgn5-8.fna&oh=00_AfCqHNi4xdkye3JyR4YnrleEhexZDFffrpOkvI4QsfONvA&oe=64036A4D"
                    alt=""
                  />
                </div>
              </div>
              <div className=" mx-4 mt-2 ">
                <div className="float-start posting-list__feel">4.9rating</div>
                <div className="float-end">
                  <a href="" className="posting-list__feel">
                    {" "}
                    233 comment
                  </a>
                </div>
              </div>
              <hr className="posting-list__hr" />
              <div className="px-5 ">
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
                        className="foo" // Will remove the inline style if applied
                      />
                    </div>
                    <span className="posting-list__feel__icon">{rating}</span>
                  </div>
                  {/* Use rating value */}
                </div>
                <div className="float-end">
                  <a href="" className="posting-list__feel__icon">
                    {" "}
                    <i class="bx bx-message-square-dots me-2 "></i>Comment
                  </a>
                </div>
              </div>
            </div>
          </form>
        </DashboardWrapperMain>
        <DashboardWrapperRight>
                  <div className='card border-0'>
                    <div className="row">
                      <div className="col-md-2">
                      <Avatar
                    name="John Doe"
                    size="55"
                    round={true}
                    src="https://www.example.com/image.jpg"
                  />
                      </div>
                      <div className="col-md-10">
                        <div className="mt-2  ms-2">
                        <span className="posting-list__titleName">
                      thịnh đào
                    </span>
                    <span className="posting-list__titleName__date">
                      user
                    </span>
                        </div>
                      </div>
                    </div>
                  </div>
        </DashboardWrapperRight>
      </DashboardWrapper>
      {/* modal */}
      <div
        class="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header position-relative">
              <span
                class="modal-title fs-5 position-absolute top-0 start-50 translate-middle-x pt-3 fw-bolder text-dark "
                id="exampleModalToggleLabel"
              >
                Tạo bài viết
              </span>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
              <button
                class="btn btn-primary"
                // data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal"
              >
                Open second modal
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabindex="-1"
      ></div>
      {/* modal */}
    </div>
  );
}

export default Posting;
