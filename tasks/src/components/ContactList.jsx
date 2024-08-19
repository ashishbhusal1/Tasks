import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import "./ContactList.css";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        console.log("Attempting to fetch contacts...");
        const contactsQuery = query(
          collection(db, "contacts"),
          orderBy("name")
        );
        const querySnapshot = await getDocs(contactsQuery);
        const fetchedContacts = querySnapshot.docs.map((doc) => doc.data());

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
