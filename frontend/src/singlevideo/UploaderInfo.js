// UploaderInfo.js
import React from "react";
import { Link } from "react-router-dom";
import FollowButton from "../profile/FollowButton";

const UploaderInfo = ({ uploader, onFollowStatusChange }) => {
  return (
    <div className="mt-3">
      <Link to={`/profile/${uploader ? uploader.username : ""}`}>
        <img
          src={
            uploader ? uploader.userimageurl : "https://via.placeholder.com/50"
          }
          alt={uploader ? uploader.username : "Uploader"}
          className="rounded-circle"
          width="50"
          height="50"
        />
        <span className="ms-2">
          {uploader ? uploader.username : "Loading..."}
        </span>
      </Link>
      {uploader && (
        <div className="mt-2">
          <small>Followers: {uploader.followercount}</small>
        </div>
      )}
      {uploader && (
        <div className="mt-2">
          <FollowButton
            profileUserId={uploader.useruuid}
            onFollowStatusChange={onFollowStatusChange}
          />
        </div>
      )}
    </div>
  );
};

export default UploaderInfo;
