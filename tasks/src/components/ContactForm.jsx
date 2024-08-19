import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./ContactForm.css";

const ContactForm = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setPicture(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    noClick: true,
    noKeyboard: true,
  });

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
        setPicture(items[i].getAsFile());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!name || !email || !phoneNumber || !picture) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      // Upload the picture to Firebase Storage
      const storageRef = ref(storage, `pictures/${picture.name}`);
      await uploadBytes(storageRef, picture);
      const pictureUrl = await getDownloadURL(storageRef);

      // Save contact details in Firestore
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        phoneNumber,
        picture: pictureUrl,
      });

      // Clear the form
      setName("");
      setEmail("");
      setPhoneNumber("");
      setPicture(null);
      setError("");
      alert("Contact added successfully!");
      closeModal();
      window.location.reload();
    } catch (err) {
      console.error("Error adding contact: ", err);
      setError("Failed to add contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form" onPaste={handlePaste}>
      <h2>Add New Contact</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="picture">Picture</label>
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #ccc",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the picture here...</p>
            ) : (
              <p>Drag & drop a picture here, or paste a picture</p>
            )}
          </div>
          <input
            type="file"
            id="picture"
            onChange={(e) => setPicture(e.target.files[0])}
            style={{ display: "none" }}
          />
          {picture && <p>Selected file: {picture.name}</p>}
        </div>
        <button type="submit" className="buttonAdd" disabled={loading}>
          {loading ? "Adding..." : "Add Contact"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
