// EditVideosForm.js
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { fetchUserVideos } from "../profile/utils";
import EditVideoCard from "./EditVideoCard";

function EditVideosForm() {
  const [userVideos, setUserVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${API_BASE_URL}/user/getUserbyToken`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const uploaderUuid = response.data.useruuid;
          await fetchUserVideos(uploaderUuid, setUserVideos);
        } else {
          console.error("Token not found in local storage");
        }
      } catch (error) {
        console.error("Error fetching current user or user videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <h5>My Videos</h5>
      <br/>
      <Row>
        {userVideos.map((video) => (
          <Col key={video.uuid} xs={12} sm={6} md={4} lg={4}>
            <EditVideoCard video={video} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default EditVideosForm;