import React, { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showModal && user) {
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
      setSelectedFile(null);
    }
  }, [showModal, user]);

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
    setIsLoading(true);
    
    try {
      let imageUrl = userData.image;

      // 1. Upload new photo if selected
      if (selectedFile) {
        console.log("Uploading photo...");
        const resultAction = await dispatch(updatePhoto({ userId: dataId, file: selectedFile }));
        
        if (updatePhoto.fulfilled.match(resultAction)) {
          console.log("Photo uploaded successfully:", resultAction.payload);
          const response = resultAction.payload;
          
          // Backend returns imageUrl and user object
          if (response.imageUrl) {
            imageUrl = response.imageUrl;
          } else if (response.user?.image) {
            imageUrl = response.user.image;
          } else if (response.image && Array.isArray(response.image) && response.image.length > 0) {
            imageUrl = response.image[0];
          } else if (response.image && typeof response.image === "string") {
            imageUrl = response.image;
          }
          console.log("Updated image URL:", imageUrl);
        } else {
          setIsLoading(false);
          Swal.fire("Erreur", "Échec du téléchargement de l'image", "error");
          return;
        }
      }

      // 2. Update text data
      console.log("Updating user data...");
      const finalData = {
        ...userData,
        image: imageUrl
      };

      const updateResult = await dispatch(updateUser({ _id: dataId, formData: finalData })).unwrap();
      console.log("User data updated:", updateResult);

      // 3. Refresh current user
      const refreshResult = await dispatch(currentUser()).unwrap();
      console.log("Current user refreshed:", refreshResult);
      
      setIsLoading(false);
      
      // 4. Show success message
      await Swal.fire("Succès", "Profil mis à jour avec succès", "success");
      
      // 5. Reset form state
      setSelectedFile(null);
      setPreview(null);
      
      // 6. Close modal
      onHide();

    } catch (error) {
      setIsLoading(false);
      console.error("Update error:", error);
      Swal.fire("Erreur", error?.message || "Une erreur est survenue lors de la mise à jour", "error");
    }
  };

  const handleCancel = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedFile(null);
    setPreview(null);
    onHide();
  };

  return (
    <Modal 
      show={showModal} 
      onHide={handleCancel}
      size="lg"
    >
      <Modal.Header 
        closeButton
        onHide={handleCancel}
      >
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
                        <input 
                          type="file" 
                          style={{ display: 'none' }} 
                          onChange={handleFileChange} 
                          accept="image/*"
                          disabled={isLoading}
                        />
                    </label>
                </div>
             </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              value={userData.name} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Prénom</Form.Label>
            <Form.Control 
              type="text" 
              name="lastName" 
              value={userData.lastName} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              value={userData.email} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
            />
          </Form.Group>

           <Form.Group className="mb-3">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control 
              type="number" 
              name="phone" 
              value={userData.phone} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end gap-2">
             <Button 
               variant="secondary" 
               onClick={handleCancel}
               disabled={isLoading}
               className="me-2">
               Annuler
             </Button>
             <Button 
               variant="primary" 
               type="submit" 
               disabled={isLoading}>
               {isLoading ? "Enregistrement..." : "Enregistrer"}
             </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
