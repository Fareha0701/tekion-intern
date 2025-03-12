//Handles Image Uploading with File Upload & Drag and Drop
//Triggers from Profile Page

import React, { useRef, useState, useContext } from "react";
import { UserContext } from "../../Store/UserContext";
import { useNavigate } from "react-router-dom";
import { saveUserProfile } from "../../backend/firebase";
import "./Upload.scss";

function Upload({ onImageUpload }) {
  const fileRef = useRef(null); //file input reference
  const [uploadImg, setUploadImg] = useState(null);
  const { userId, username } = useContext(UserContext);

  const uploadFile = async (file) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = reader.result;
      setUploadImg(reader.result); //storing
      onImageUpload(reader.result); //sending back
      // };

      if (userId) {
        await saveUserProfile(userId, username, imageUrl);
      }
    };
    reader.readAsDataURL(file); //convertion
  };

  const handleOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files; // Get dropped files
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get selected file
    if (file) uploadFile(file);
  };

  const handleButtonClick = () => {
    fileRef.current.click(); // Trigger file input
  };

  return (
    <>
      <div className="UploadContainer">
        <div
          className="DragnDropCon"
          //   draggable="true"
          onDragOver={handleOver} // Allow drop
          //   onDragEnter={handleOver}
          onDrop={handleDrop}
          style={{
            textAlign: "center",
            border: "2px dashed #aaa",
            cursor: "pointer",
            width: "100%",
            height: "40%",
          }}
        >
          <p>Drag and Drop</p>
        </div>

        <hr className="Divider" />
        <div className="UploadImageCon">
          <input
            type="file"
            ref={fileRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <p onClick={handleButtonClick}>Upload Image</p>
        </div>
      </div>
    </>
  );
}

export default Upload;
