import "./login.scss";
import React, { useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../components/context/AuthContext";
import { auth } from "../../components/context/firebase";
import clientId from "./client_secret_624291541261-vsnpuqvrn48tah5ju43l048ug23a3hre.apps.googleusercontent.com.json";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { googleSignIn, user, accessToken } = UserAuth();
  // console.log(user);
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      if (accessToken !== undefined) {
        // Thêm điều kiện kiểm tra accessToken
        const user = auth.currentUser;
        console.log(user);
        if (user) {
          const idToken = await user.getIdToken();
          const accessToken = await user.getIdToken(true);
          const response = await axios.post(
            "https://fhome-be.vercel.app/login",
            { accessToken: accessToken },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
            }
          );
          if ((response.status = 200)) {
            // const data = await response.json();
            if (
              response !== undefined &&
              response.data.data.user.roleName !== "admin" &&
              response.data.data.user.status.user !== true
            ) {
              localStorage.setItem(
                "access_token",
                JSON.stringify(response.data)
              );
              console.log(response);
              const token = JSON.parse(localStorage.getItem("access_token"));
              const headers = {
                Authorization: `Bearer ${token.data.accessToken}`,
              };
              axios
                .get("https://fhome-be.vercel.app/getRoomsByUserId", {
                  headers,
                })
                .then((response) => {
                  const roomIds = response.data;
                  console.log(roomIds)
                  if (roomIds) {
                    localStorage.setItem("roomIds", JSON.stringify(roomIds));
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
                navigate("/home");
              //         }
            } else {
              setTimeout(() => {
                alert("Please you are admin please dont enter");
              }, 1000);
            }
          } else {
            console.log("Response not OK");
          }
        } else {
          console.log("User not found");
        }
      } else {
        console.log("Access token not found");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const accessTokenString = localStorage.getItem("access_token");
    let accessToken = null;
    if (typeof accessTokenString === "string" && accessTokenString !== "") {
      accessToken = JSON.parse(accessTokenString);
    }

    const userDataString = localStorage.getItem("user_data");
    let userData = null;
    if (typeof userDataString === "string" && userDataString !== "") {
      userData = JSON.parse(userDataString);
    }

    if (accessToken && userData && userData.user.roleName !== "admin") {
      navigate("/home");
    } else {
      navigate("");
    }
  }, [navigate]);

  return (
    <div className="body">
      <h1 id="site-logo">
        <img
          src="https://fuidentity.edunext.vn/images/logo-login-new.png"
          alt="f-home"
        />
      </h1>
      <div id="wrap-main-content">
        <div className="identity-tabs">
          <a href="/vi/Account/Login">Login</a>
        </div>
        <ul className="list-social-login">
          <li className="social-login-item">
            <GoogleButton
              className="googleButton"
              onClick={handleGoogleSignIn}
              data-clientid={clientId.web.client_id}
            />
          </li>
        </ul>
        <div className="wrap-form-field">
          <div className="form-group group-width-icon">
            <i className="fa-solid fa-user"></i>
            <input
              type="email"
              className="form-control input-validation-error"
              placeholder="Email"
              autoComplete="off"
              data-val="true"
              data-val-required="Password is required"
              id="Password"
              name="Password"
            />
          </div>
        </div>
        <div className="wrap-form-field">
          <div className="form-group group-width-icon">
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              className="form-control input-validation-error"
              placeholder="Password"
              autoComplete="off"
              data-val="true"
              data-val-required="Password is required"
              id="Password"
              name="Password"
            />
          </div>
        </div>
        <div className="d-grid form-identify">
          <button className="btn btn-primary" type="button">
            Log in
          </button>
          <Link to="/linkto" relative="path" className="change-rtn-home">
            Return To Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
