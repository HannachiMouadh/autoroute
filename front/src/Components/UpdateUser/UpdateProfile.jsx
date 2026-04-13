import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUser,
  updateUser,
  updatePhoto,
} from "../../JS/userSlice/userSlice";
import Swal from "sweetalert2";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

export const UpdateProfile = ({ showModal, onHide, dataId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    image: "", // Expecting string or array
  });
  
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      setUserData({
            name: user.name || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            image: user.image || "",
      });

      // Handle existing image for preview
      if (user.image && Array.isArray(user.image) && user.image.length > 0) {
        setPreview(user.image[0]);
      } else if (typeof user.image === "string" && user.image) {
        setPreview(user.image);
      } else {
        setPreview(null);
      }
    }
  }, [user, showModal]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = userData.image;

      // 1. Upload new photo if selected
      if (selectedFile) {
        // Dispatch updatePhoto action
        // Note: updatePhoto expects { userId, file }
        const resultAction = await dispatch(updatePhoto({ userId: dataId, file: selectedFile }));
        
        if (updatePhoto.fulfilled.match(resultAction)) {
           // The backend returns the updated user object with the new image array
           const updatedUserFromBackend = resultAction.payload;
           // Extract new image URL if needed, but the backend updated the DB already for the image
           // However, we still want to update the other text fields below
           if(updatedUserFromBackend.image && updatedUserFromBackend.image.length > 0) {
               imageUrl = updatedUserFromBackend.image; 
           }
        } else {
             Swal.fire("Erreur", "Echec du téléchargement de l'image", "error");
             return; 
        }
      }

      // 2. Update text data
      const finalData = {
          ...userData,
          image: imageUrl
      };

      await dispatch(updateUser({ _id: dataId, formData: finalData })).unwrap();
      
      // Refresh current user
      dispatch(currentUser());
      
      onHide();
      Swal.fire("Succès", "Profil mis à jour avec succès", "success");

    } catch (error) {
      console.error(error);
      Swal.fire("Erreur", "Une erreur est survenue", "error");
    }
  };

  return (
    <Modal show={showModal} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier le profil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdate}>
          <div className="text-center mb-4">
             <div style={{ position: 'relative', display: 'inline-block' }}>
                <img 
                    src={preview || "https://via.placeholder.com/150"} 
                    alt="Profile" 
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #dee2e6' }}
                />
                <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'white', borderRadius: '50%', padding: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                    <label style={{ cursor: 'pointer', margin: 0 }}>
                        <img src={uploadImg} alt="upload" style={{ width: '20px' }} />
                        <input type="file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
                    </label>
                </div>
             </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control type="text" name="name" value={userData.name} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Prénom</Form.Label>
            <Form.Control type="text" name="lastName" value={userData.lastName} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={userData.email} onChange={handleChange} required />
          </Form.Group>

           <Form.Group className="mb-3">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control type="number" name="phone" value={userData.phone} onChange={handleChange} required />
          </Form.Group>
          
          <div className="d-flex justify-content-end">
             <Button variant="secondary" onClick={onHide} className="me-2">Annuler</Button>
             <Button variant="primary" type="submit">Enregistrer</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
