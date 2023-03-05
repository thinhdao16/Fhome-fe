import React from "react";
import "./Upload.scss";
import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";

function Upload() {
  const [imagePreview, setImagePreview] = useState(null);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result;
      setImagePreview(preview);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="product-storage">
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag and drop an image file here, or click to select file</p>
          </div>
        )}
      </Dropzone>
      {imagePreview && (
        <img src={imagePreview} alt="image preview" />
      )}
    </div>
  );
}

export default Upload;
