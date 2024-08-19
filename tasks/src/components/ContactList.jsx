import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import "./ContactList.css";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const fetchContacts = async () => {
    try {
      console.log("Fetching initial contacts...");
      const contactsQuery = query(
        collection(db, "contacts"),
        orderBy("name"),
        limit(10)
      );
      const querySnapshot = await getDocs(contactsQuery);
      const fetchedContacts = querySnapshot.docs.map((doc) => doc.data());

      console.log("Initial contacts fetched:", fetchedContacts);
      setContacts(fetchedContacts);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(fetchedContacts.length === 10);
    } catch (error) {
      console.error("Error fetching initial contacts:", error);
      setHasMore(false);
    }
  };

  const fetchMoreContacts = async () => {
    if (!lastVisible) {
      console.log("No more contacts to fetch.");
      setHasMore(false);
      return;
    }

    try {
      console.log("Fetching more contacts...");
      const contactsQuery = query(
        collection(db, "contacts"),
        orderBy("name"),
        startAfter(lastVisible),
        limit(10) // Adjust limit as needed
      );
      const querySnapshot = await getDocs(contactsQuery);
      const fetchedContacts = querySnapshot.docs.map((doc) => doc.data());

      console.log("More contacts fetched:", fetchedContacts);
      if (fetchedContacts.length === 0) {
        console.log("No more contacts available.");
        setHasMore(false);
      } else {
        setContacts((prevContacts) => [...prevContacts, ...fetchedContacts]);
        setLastVisible(
          querySnapshot.docs[querySnapshot.docs.length - 1] || null
        );
      }
    } catch (error) {
      console.error("Error fetching more contacts:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Loading more contacts...");
          fetchMoreContacts();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, lastVisible]);

  return (
    <div className="contact-div">
      {contacts.length > 0 ? (
        contacts.map((contact, index) => (
          <div key={index} className="contact-card">
            <img src={contact.picture} alt={contact.name} />
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
      <div ref={loaderRef} className="loader">
        {hasMore ? (
          <p className="loading">Loading more contacts...</p>
        ) : (
          <p className="no-more-contacts">No more contacts to display.</p>
        )}
      </div>
    </div>
  );
};

export default ContactList;
