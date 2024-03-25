// EditProfileForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UpdateUsername from "./UpdateUsername";
import UpdateProfileImage from "./UpdateProfileImage";
import UpdateSocialLinks from "./UpdateSocialLinks";
import UpdatePassword from "./UpdatePassword";
import UpdateBio from "./UpdateBio";
import DeleteAccountModal from "./DeleteAccountModal";
import AuthModal from "./AuthModal";
import "./EditProfileForm.css";

function EditProfileForm() {
  const [user, setUser] = useState({
    username: "",
    userimageurl: "",
    socialMediaLinks: [],
    bio: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.get(
          `${API_BASE_URL}/user/getUserbyToken`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = response.data;

        console.log(userData.bio);
        setUser((prevUser) => ({
          ...prevUser,
          username: userData.username || "",
          userimageurl: userData.userimageurl || "",
          socialMediaLinks: userData.socialMediaLinks || [],
          bio: userData.bio || "",
        }));
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setShowModal(true);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleUpdateSuccess = () => {
    fetchUserProfile();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteSuccess = () => {
    handleCloseModal();
    window.location.href = "/";
  };

  return (
    <Container className="edit-profile-form">
      <Row>
        <Col md={3}>
          <UpdateProfileImage
            userimageurl={user.userimageurl}
            placeholder={user.userimageurl}
            onUpdateSuccess={handleUpdateSuccess}
          />
        </Col>
        <Col md={9}>
          <Row>
            <Col>
              <UpdateUsername
                username={user.username}
                placeholder={user.username}
                onUpdateSuccess={handleUpdateSuccess}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <UpdateBio
                bio={user.bio}
                placeholder={user.bio}
                onUpdateSuccess={handleUpdateSuccess}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <UpdateSocialLinks
                socialMediaLinks={user.socialMediaLinks}
                onUpdateSuccess={handleUpdateSuccess}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <UpdatePassword onUpdateSuccess={handleUpdateSuccess} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Col>
      </Row>

      <AuthModal show={showModal} onHide={handleCloseModal} />
      <DeleteAccountModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onDeleteSuccess={handleDeleteSuccess}
      />
      <br/>
    </Container>
  );
}

export default EditProfileForm;
