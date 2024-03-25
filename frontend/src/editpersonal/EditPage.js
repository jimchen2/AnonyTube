// EditPage.js
import React, { useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import EditProfileForm from "./EditProfileForm";
import EditVideosForm from "../editvideos/EditVideosForm";

function EditPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Container>
      <Tabs activeKey={activeTab} onSelect={handleTabChange} className="mb-3">
        <Tab eventKey="profile" title="Edit Profile">
          <EditProfileForm />
        </Tab>
        <Tab eventKey="videos" title="Edit Videos">
          <EditVideosForm />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default EditPage;