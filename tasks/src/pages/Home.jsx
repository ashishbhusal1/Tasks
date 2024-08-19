import React, { useState } from "react";
import ContactList from "../components/ContactList";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import { IoMdClose } from "react-icons/io";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="contacts-page">
      <Header onAddContact={handleOpenModal} /> <ContactList />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <IoMdClose onClick={handleCloseModal} className="close" />
            <ContactForm closeModal={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
