import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./static/Header";
import LoginPage from "./login/LoginPage";
import SignupPage from "./signup/SignupPage";
import PublicProfilePage from "./profile/PublicProfilePage";
import EditPage from "./editpersonal/EditPage";
import UploadVideoPage from "./uploadvideo/UploadVideo";
import SingleVideoPage from "./singlevideo/SingleVideosPage";
import About from "./static/About";
import HomePage from "./homepage/HomePage";
import SearchPage from "./search/SearchPage";
import VideoIframe from "./videoutil/Videoiframe";
import EditVideoPage from "./editsinglevideo/EditVideoPage";
import OAuthSuccess from './Oauth/OAuthSuccess';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/static/embed/:uuid" element={<VideoIframe />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route
          path="*"
          element={
            <>
              <Header />

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />

                <Route
                  path="/login"
                  element={
                    <Container style={{ maxWidth: "800px" }}>
                      <LoginPage />
                    </Container>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <Container style={{ maxWidth: "800px" }}>
                      <SignupPage />
                    </Container>
                  }
                />
                <Route
                  path="/profile/:username"
                  element={
                    <Container style={{ maxWidth: "800px" }}>
                      <PublicProfilePage />
                    </Container>
                  }
                />
                <Route
                  path="/edit"
                  element={
                    <Container style={{ maxWidth: "800px" }}>
                      <EditPage />
                    </Container>
                  }
                />
                <Route
                  path="/upload"
                  element={
                    <Container style={{ maxWidth: "800px" }}>
                      <UploadVideoPage />
                    </Container>
                  }
                />
                <Route
                  path="/video/:videoUuid"
                  element={
                    <Container style={{ maxWidth: "800px" }}>
                      <SingleVideoPage />
                    </Container>
                  }
                />
                <Route
                  path="/edit/video/:videoUuid"
                  element={
                    <Container style={{ maxWidth: "800px" }}>
                      <EditVideoPage />
                    </Container>
                  }
                />
                <Route
                  path="/about/"
                  element={
                    <Container style={{ maxWidth: "800px" }}>
                      <About />
                    </Container>
                  }
                />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
