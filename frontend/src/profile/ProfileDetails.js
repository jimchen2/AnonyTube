import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import FollowButton from "./FollowButton";
import BlockButton from "./BlockButton";

function ProfileDetails({ user, blockStatusUpdated, onBlockStatusChange }) {
  const [bio, setBio] = useState("");
  const [socialMediaLinks, setSocialMediaLinks] = useState(null);
  const [joinedDate, setJoinedDate] = useState("");

  useEffect(() => {
    if (user) {
      setBio(user.bio || "No bio available");

      if (user.socialMediaLinks && user.socialMediaLinks.length > 0) {
        const links = user.socialMediaLinks.map((link) => (
          <div key={link.url}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.name}
            </a>
          </div>
        ));
        setSocialMediaLinks(links);
      } else {
        setSocialMediaLinks(null);
      }

      setJoinedDate(
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"
      );
    }
  }, [user]);

  return (
    <>
      <Image
        src={user.userimageurl}
        alt="User Profile"
        roundedCircle
        className="mb-3"
        style={{ width: "100px", height: "100px" }}
      />
      <h3>{user.username}</h3>
      <div>
        <p>{bio}</p>
        {socialMediaLinks && (
          <div>
            <h5>Social Media Links</h5>
            {socialMediaLinks}
          </div>
        )}
        <div>Joined: {joinedDate}</div>
      </div>
      <FollowButton
        profileUserId={user.useruuid}
        onFollowStatusChange={() => onBlockStatusChange(false)}
        blockStatusUpdated={blockStatusUpdated}
      />{" "}
      <BlockButton
        profileUserId={user.useruuid}
        onBlockStatusChange={onBlockStatusChange}
      />
    </>
  );
}

export default ProfileDetails;
