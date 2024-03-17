import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import VideoPage from './VideoPage'; // Ensure VideoPage is implemented with pagination
import { BACKEND_URL } from '../config';
function VideoList() {
    const [videos, setVideos] = useState([]);
    const [users, setUsers] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const itemsPerPage = 50; // Set the number of videos per page

    useEffect(() => {
        // Fetch all users (only once)
        fetch(`${BACKEND_URL}/users`)
            .then(response => response.json())
            .then(usersData => {
                const usersById = usersData.reduce((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {});
                setUsers(usersById);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []); // Empty dependency array to run this effect only once
    
    useEffect(() => {
        // Fetch videos for the current page
        fetch(`${BACKEND_URL}/videos?page=${currentPage}&limit=${itemsPerPage}`)
            .then(response => response.json())
            .then(videosData => {
                const videosWithUser = videosData.map(video => {
                    return { ...video, user: users[video.user_id] };
                });
    
                setVideos(videosWithUser);
                setPageCount(Math.ceil(videosData.total / itemsPerPage));
            })
            .catch(error => console.error('Error fetching videos:', error));
    }, [currentPage, users]); // Depend on currentPage and users
    
    // Calculate the videos to display on the current page
    const indexOfLastVideo = currentPage * itemsPerPage;
    const indexOfFirstVideo = indexOfLastVideo - itemsPerPage;
    const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

    return (
        <Container>
            <h2 className="my-4">Video List</h2>
            <VideoPage
                videos={currentVideos}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageCount={pageCount}
            />
        </Container>
    );
}

export default VideoList;
