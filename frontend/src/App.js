import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./static/Header";

const LoginPage = lazy(() => import("./login/LoginPage"));
const SignupPage = lazy(() => import("./signup/SignupPage"));
const PublicProfilePage = lazy(() => import("./profile/PublicProfilePage"));
const EditPage = lazy(() => import("./editpersonal/EditPage"));
const UploadVideoPage = lazy(() => import("./uploadvideo/UploadVideo"));
const SingleVideoPage = lazy(() => import("./singlevideo/SingleVideosPage"));
const About = lazy(() => import("./static/About"));
const HomePage = lazy(() => import("./homepage/HomePage"));
const SearchPage = lazy(() => import("./search/SearchPage"));
const VideoIframe = lazy(() => import("./videoutil/Videoiframe"));
const EditVideoPage = lazy(() => import("./editsinglevideo/EditVideoPage"));
const OAuthSuccess = lazy(() => import("./Oauth/OAuthSuccess"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </Router>
  );
}

export default App;
