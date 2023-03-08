import { Link } from "react-router-dom";
import "./profile.scss"
import toastr from "cogo-toast";

const Profile = () => {
    const handleDeleteUser = (id) => {
        toastr.success("Update successfully", {
          position: "top-right",
          heading: "Done",
        });
      };
      const userData = JSON.parse(localStorage.getItem("access_token")).data; 
      console.log(userData)
  return (
    <div className="body-profile">
      <div className="container">
        <h1 className="text-dark">Edit Profile</h1>
        <hr />
        <div className="row">
          {/* left column */}
          <div className="col-md-3">
            <div className="text-center">
              <img
                src={userData.user.img}
                className="avatar img-circle rounded-5"
                alt="avatar"
              />
              <h6>Upload a different photo...</h6>
              <input type="file" className="form-control" />
            </div>
          </div>
          {/* edit form column */}
          <div className="col-md-9 personal-info">
            {/* <div className="alert alert-info alert-dismissable">
              <a className="panel-close close" data-dismiss="alert">
                ×
              </a>
              <i className="fa fa-coffee" />
              This is an <strong>.alert</strong>. Use this to show important
              messages to the user.
            </div> */}
            <h3 className="text-dark">Personal info</h3>
            <form className="form-horizontal" role="form">
              <div className="form-group">
                <label className="col-lg-3 control-label">Full name:</label>
                <div className="col-lg-8">
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={userData.user.fullname}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">Email:</label>
                <div className="col-lg-8">
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={userData.user.email}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label">AdminID:</label>
                <div className="col-lg-8">
                  <input className="form-control" type="text" defaultValue ={userData.user.id}/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label">Username:</label>
                <div className="col-md-8">
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={userData.user.roleName}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label" />
                <div className="col-md-8">
                  <Link to="/">
                    <input
                      type="button"
                      className="btn btn-primary"
                      defaultValue="Save Changes"
                      onClick={() => handleDeleteUser()}
                    />
                  </Link>
                  <span />
                  <input
                    type="reset"
                    className="btn btn-default"
                    defaultValue="Cancel"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};
export default Profile;
