import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "./authService";
import ComputerHeader from "./ComputerHeader";
import MobileHeader from "./MobileHeader";

function Header( {toggleiframetheme}) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser(setUser);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = e.target.elements.search.value;
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      <div className="d-none d-lg-block">
        <ComputerHeader user={user} handleSearch={handleSearch} toggleiframetheme={toggleiframetheme}  />
      </div>
      <div className="d-lg-none">
        <MobileHeader user={user} handleSearch={handleSearch} />
      </div>
    </>
  );
}

export default Header;
