import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import {
  currentUser,
  updatePhoto,
  updateUser,
  getAllUsers
} from "../../JS/userSlice/userSlice";
import Swal from "sweetalert2";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

export const UpdateUserData = ({ rowData, dataId, isProfileMode = false }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // Get current user to check if they are super admin
  const currentUserData = useSelector((state) => state.user.user);
  const isSuper = currentUserData?.isSuper;

  const [userForm, setUserForm] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    autonum: "",
    district: "",
    role: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (showModal && rowData) {
      setUserForm({
        name: rowData.name || "",
        lastName: rowData.lastName || "",
        email: rowData.email || "",
        phone: rowData.phone || "",
        password: "", // Empty to not trigger update unless typed
        autonum: rowData.autonum || "",
        district: rowData.district || "",
        role: rowData.role || "",
        isAdmin: rowData.isAdmin || false,
      });

      if (rowData.image && Array.isArray(rowData.image) && rowData.image.length > 0) {
        setPreview(rowData.image[0]);
      } else if (typeof rowData.image === "string" && rowData.image) {
        setPreview(rowData.image);
      } else {
        setPreview(null);
      }
      setSelectedImage(null);
    }
  }, [showModal, rowData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm({ 
      ...userForm, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = rowData.image;

      // 1. Upload new photo if selected
      if (selectedImage) {
        const resultAction = await dispatch(updatePhoto({ userId: dataId, file: selectedImage }));
        if (updatePhoto.fulfilled.match(resultAction)) {
           const updatedUserFromBackend = resultAction.payload;
           if(updatedUserFromBackend.image && updatedUserFromBackend.image.length > 0) {
               imageUrl = updatedUserFromBackend.image; 
           } else if (typeof updatedUserFromBackend.image === "string") {
               imageUrl = updatedUserFromBackend.image;
           } else if (updatedUserFromBackend.url) { 
               imageUrl = updatedUserFromBackend.url;
           }
        } else {
             Swal.fire("Erreur", "Echec du téléchargement de l'image", "error");
             return; 
        }
      }

      // 2. Update text data (only include password if typed)
      const { password, ...restData } = userForm;
      const finalData = {
          ...restData,
          image: imageUrl
      };
      
      if (password && password.trim() !== "") {
          finalData.password = password;
      }

      await dispatch(updateUser({ _id: dataId, formData: finalData })).unwrap();
      
      // Refresh current user and list
      dispatch(currentUser());
      dispatch(getAllUsers());
      
      setShowModal(false);
      Swal.fire("Succès", "Mise à jour effectuée avec succès", "success");

    } catch (error) {
      console.error(error);
      Swal.fire("Erreur", "Une erreur est survenue lors de la mise à jour", "error");
    }
  };

  const closeModal = (e) => {
      if (e) e.stopPropagation();
      setShowModal(false);
  };

  return (
    <>
      {isProfileMode ? (
         <span onClick={(e) => { e.stopPropagation(); setShowModal(true); }} style={{cursor: "pointer", width: "100%", display: "block"}}>Modifier Profile</span>
      ) : (
        <Button
          variant="primary"
          onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
          style={{ width: "40px" }}
        >
          <FiEdit />
        </Button>
      )}

      <Modal show={showModal} onHide={closeModal} onClick={(e) => e.stopPropagation()} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Mettre à jour les données</Modal.Title>
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
                          <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                  if (file.size > 10 * 1024 * 1024) {
                                    Swal.fire("Erreur", "La taille de l'image ne doit pas dépasser 10MB", "error");
                                    e.target.value = null;
                                    return;
                                  }
                                  setSelectedImage(file);
                                  setPreview(URL.createObjectURL(file));
                              }
                          }} />
                      </label>
                  </div>
               </div>
            </div>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control type="text" name="name" value={userForm.name} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control type="text" name="lastName" value={userForm.lastName} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={userForm.email} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control type="number" name="phone" value={userForm.phone} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            {!isProfileMode && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Choix autoroute</Form.Label>
                      <Form.Select name="autonum" value={userForm.autonum} onChange={handleChange} required>
                        <option value="" disabled>Select autoroute</option>
                        <option value="a1">A1</option>
                        <option value="a3">A3</option>
                        <option value="a4">A4</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>District</Form.Label>
                      <Form.Select name="district" value={userForm.district} onChange={handleChange} required>
                        <option value="" disabled>Select district</option>
                        {userForm.autonum === "a1" && (
                          <>
                            <option value="oudhref">Oudhref</option>
                            <option value="mahres">Mahres</option>
                            <option value="jem">Jem</option>
                            <option value="hergla">Hergla</option>
                            <option value="turki">Turki</option>
                          </>
                        )}
                        {userForm.autonum === "a3" && (
                          <>
                            <option value="mdjazbab">Mdjaz Bab</option>
                            <option value="baja">Baja</option>
                          </>
                        )}
                        {userForm.autonum === "a4" && (
                          <option value="bizerte">Bizerte</option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rôle</Form.Label>
                      <Form.Select name="role" value={userForm.role} onChange={handleChange} required>
                        <option value="" disabled>Select Role</option>
                        <option value="entretient">Entretient</option>
                        <option value="patrouille">Patrouille</option>
                        <option value="securite">Sécurité</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    {isSuper && userForm.role === "securite" && (
                      <Form.Group className="mb-3 d-flex align-items-end h-100 pb-2">
                        <Form.Check 
                          type="checkbox" 
                          name="isAdmin" 
                          label="Administrateur" 
                          checked={userForm.isAdmin} 
                          onChange={handleChange} 
                        />
                      </Form.Group>
                    )}
                  </Col>
                </Row>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Mot de passe (laisser vide si inchangé)</Form.Label>
              <Form.Control type="password" name="password" value={userForm.password} onChange={handleChange} />
            </Form.Group>

            <div className="d-flex justify-content-end">
               <Button variant="secondary" onClick={closeModal} className="me-2">Annuler</Button>
               <Button variant="primary" type="submit">Enregistrer</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
