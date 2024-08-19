import React from "react";
import "./Header.css";

const Header = ({onAddContact}) => {
  return (
    <div className="header">
      <h1 className="text">Contacts List</h1>
      <button className="button" onClick={onAddContact}>
        Add Contact
      </button>
    </div>
  );
};

export default Header;
