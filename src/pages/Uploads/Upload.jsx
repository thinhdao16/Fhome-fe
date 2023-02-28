import React from "react";
import "./Upload.scss";
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../components/context/firebase";
import { v4 } from "uuid";
import { UserAuth } from "../../components/context/AuthContext";
import axios from "axios";

function Upload() {
  const { token } = UserAuth();
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);
  const fetchData = async (token) => {
    const res = await axios.get(
      "http://178.128.223.115:8080/api/v1/auth/sign-in",
      {
        headers: {
          Authorization: "Bearer" + token,
        },
      }
    );
    console.log("res.data,50000", res.data);
  };

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div className="product-storage">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button onClick={uploadFile}> Upload Image</button>
      {imageUrls.map((url) => {
        return        <section className="bg-light py-4 my-5">
          <div className="container">
            <div className="row">
              <div className="col-12"></div>
              <div className="col-md-6 col-lg-4">
                <div className="card my-3">
                  <img
                    src={url}
                    className="card-image-top"
                    alt="thumbnail"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>;
      })}
    </div>
  );
}

export default Upload;
