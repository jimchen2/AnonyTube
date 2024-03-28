import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import ProfileDetails from "./ProfileDetails";
import { Link } from "react-router-dom";
import {
  fetchUserProfile,
  fetchFollowers,
  fetchFollowing,
  fetchUserVideos,
} from "./utils";
import VideoCard from "./VideoCard";

function PublicProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [blockStatusUpdated, setBlockStatusUpdated] = useState(false);

  useEffect(() => {
    fetchUserProfile(username, setUser);
  }, [username]);

  useEffect(() => {
    if (user) {
      fetchFollowers(user.followers, setFollowers);
      fetchFollowing(user.following, setFollowing);
      fetchUserVideos(user.useruuid, setUserVideos);
    }
  }, [user]);

  const handleFollowStatusChange = (isBlocked) => {
    setBlockStatusUpdated(true);
    fetchUserProfile(username, setUser);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const maxListItems = 10;
  const followerListHeight = followers.length > maxListItems ? "200px" : "auto";
  const followingListHeight =
    following.length > maxListItems ? "200px" : "auto";

  return (
    <Container className="my-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <ProfileDetails
                user={user}
                blockStatusUpdated={blockStatusUpdated}
                onBlockStatusChange={handleFollowStatusChange}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Row>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <h5>Followers</h5>
                  <ListGroup
                    style={{ maxHeight: followerListHeight, overflowY: "auto" }}
                  >
                    {followers.map((follower) => (
                      <ListGroup.Item key={follower.useruuid}>
                        <Link to={`/profile/${follower.username}`}>
                          {follower.username}
                        </Link>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <h5>Following</h5>
                  <ListGroup
                    style={{
                      maxHeight: followingListHeight,
                      overflowY: "auto",
                    }}
                  >
                    {following.map((followedUser) => (
                      <ListGroup.Item key={followedUser.useruuid}>
                        <Link to={`/profile/${followedUser.username}`}>
                          {followedUser.username}
                        </Link>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h4>Videos</h4>
              {userVideos.length === 0 ? (
                <p>No videos uploaded yet.</p>
              ) : (
                <Row>
                  {userVideos.map((video) => (
                    <Col key={video._id} sm={6} md={4} lg={4}>
                      <VideoCard video={video} />
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>{" "}
    </Container>
  );
}

export default PublicProfilePage;
