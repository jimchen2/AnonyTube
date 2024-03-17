import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import VideoCard from './SingleVideoCard.js';
import { BACKEND_URL } from '../config.js';

function VideoDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, videosResponse] = await Promise.all([
          fetch(`${BACKEND_URL}/users`),
          fetch(`${BACKEND_URL}/videos`),
        ]);

        const usersData = await usersResponse.json();
        const videosData = await videosResponse.json();

        const usersById = usersData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        const foundVideo = videosData.find((v) => v.id === id);
        if (foundVideo) {
          foundVideo.user = usersById[foundVideo.user_id];
          setVideo(foundVideo);
        } else {
          setVideo(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (!video) {
    return <Container>No video found.</Container>;
  }

  return (
    <Container>
      <VideoCard video={video} />
    </Container>
  );
}

export default VideoDetail;