import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  Image,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUpload,
  FaSignInAlt,
  FaArrowLeft,
  FaQuestionCircle,
  FaEdit,
  FaSignOutAlt,
  FaUserPlus,
} from "react-icons/fa";

function MobileHeader({ user, handleSearch }) {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Navbar bg="light" className="justify-content-between">
      <Container className="d-flex align-items-center">
        {showSearch ? (
          <Form inline onSubmit={handleSearch} className="d-flex flex-grow-1">
            <Button
              variant="outline-secondary"
              onClick={toggleSearch}
              className="mr-2"
            >
              <FaArrowLeft />
            </Button>
            <FormControl
              type="text"
              name="search"
              placeholder="Search"
              className="mr-2 flex-grow-1"
            />
            <Button variant="outline-success" type="submit">
              <FaSearch />
            </Button>
          </Form>
        ) : (
          <>
            <Navbar.Brand as={Link} to="/" className="mr-auto">
              AnonyTube
            </Navbar.Brand>
            <Nav className="ml-auto">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Search</Tooltip>}
              >
                <Button
                  variant="outline-success"
                  onClick={toggleSearch}
                  className="mr-2"
                  style={{maxHeight:"30",marginTop:"4"}}
              
                >
                  <FaSearch size={15} />
                </Button>
              </OverlayTrigger>
              {user && (
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Upload</Tooltip>}
                >
                  <Nav.Link as={Link} to="/upload" className="mr-2">
                    <FaUpload size={20} />
                  </Nav.Link>
                </OverlayTrigger>
              )}
              {user ? (
                <>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Profile</Tooltip>}
                  >
                    <Nav.Link
                      as={Link}
                      to={`/profile/${user.username}`}
                      className="mr-2"
                    >
                      <Image
                        src={user.userimageurl}
                        roundedCircle
                        width="25"
                        height="25"
                      />
                    </Nav.Link>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Logout</Tooltip>}
                  >
                    <Nav.Link onClick={handleLogout}>
                      <FaSignOutAlt size={20} />
                    </Nav.Link>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Edit</Tooltip>}
                  >
                    <Nav.Link as={Link} to="/edit" className="ml-2">
                      <FaEdit size={20} />
                    </Nav.Link>
                  </OverlayTrigger>
                </>
              ) : (
                <>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Login</Tooltip>}
                  >
                    <Nav.Link as={Link} to="/login" className="mr-2">
                      <FaSignInAlt size={20} />
                    </Nav.Link>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Sign Up</Tooltip>}
                  >
                    <Nav.Link as={Link} to="/signup">
                      <FaUserPlus size={20} />
                    </Nav.Link>
                  </OverlayTrigger>
                </>
              )}
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>About</Tooltip>}
              >
                <Nav.Link as={Link} to="/about" className="ml-2">
                  <FaQuestionCircle size={20} />
                </Nav.Link>
              </OverlayTrigger>
            </Nav>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default MobileHeader;
