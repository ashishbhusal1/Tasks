import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./ContactList.css";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        console.log("Attempting to fetch contacts...");
        const querySnapshot = await getDocs(collection(db, "contacts"));
        let fetchedContacts = querySnapshot.docs.map((doc) => doc.data());

        fetchedContacts = fetchedContacts.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        console.log("Fetched contacts:", fetchedContacts);
        setContacts(fetchedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="contact-div">
      {contacts.length > 0 ? (
        contacts.map((contact, index) => (
          <div key={index} className="contact-card">
            <img src={contact.picture} />
            <div className="card-content">
              <h3>{contact.name}</h3>
              <p>{contact.email}</p>
              <p>{contact.phoneNumber}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No contacts available.</p>
      )}
    </div>
  );
};

export default ContactList;
