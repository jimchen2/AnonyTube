import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
} from "darkreader";
import { BooleanContext } from "../global/global";
import { useContext } from "react";

function ComputerHeader({ user, handleSearch }) {
  const [mode, setMode] = useState("light");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const { boolValue, toggleBoolValue } = useContext(BooleanContext);

  const toggleColorMode = () => {
    toggleBoolValue();
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    if (newMode === "dark") {
      enableDarkMode({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
    } else {
      disableDarkMode();
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{ marginLeft: "20px", fontSize: "16px" }}
        >
          AnonyTube
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-between"
        >
          <Nav className="align-items-center">
            {user && (
              <>
                <Nav.Link
                  as={Link}
                  to="/upload"
                  className="mr-3"
                  style={{ fontSize: "16px" }}
                >
                  Upload
                </Nav.Link>
                <Nav.Link as={Link} to="/edit" style={{ fontSize: "16px" }}>
                  Edit
                </Nav.Link>
              </>
            )}
            <Nav.Link as={Link} to="/about" style={{ fontSize: "16px" }}>
              About
            </Nav.Link>
          </Nav>
          <Form
            inline
            onSubmit={handleSearch}
            className="d-flex"
            style={{ marginTop: "17px" }}
          >
            <FormControl
              type="text"
              name="search"
              className="mr-sm-2 flex-grow-1"
              style={{ fontSize: "16px", maxHeight: "33px" }}
            />
            <Button
              variant="outline-success"
              type="submit"
              size="sm"
              style={{ fontSize: "16px", maxHeight: "33px" }}
            >
              Search
            </Button>
          </Form>
          <Nav className="ml-auto align-items-center">
            <Nav.Link
              onClick={toggleColorMode}
              className="d-flex align-items-center mr-2"
            >
              {mode === "dark" ? <>Dark</> : <>Light</>}
            </Nav.Link>
            <div style={{ margin: "20px" }}></div>
            {user ? (
              <>
                <Navbar.Brand
                  as={Link}
                  to={`/profile/${user.username}`}
                  className="d-flex align-items-center"
                >
                  <div style={{ marginRight: "10px" }}></div>
                  <Image
                    src={user.userimageurl}
                    roundedCircle
                    width="30"
                    height="30"
                    className="mr-2"
                  />
                  <div style={{ fontSize: "16px" }}>Hello, {user.username}</div>
                  <div style={{ marginRight: "10px" }}></div>
                </Navbar.Brand>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="ml-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="mr-3"
                  style={{ fontSize: "16px" }}
                >
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" style={{ fontSize: "16px" }}>
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ComputerHeader;
