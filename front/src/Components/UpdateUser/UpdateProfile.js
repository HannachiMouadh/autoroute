import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUser,
  updateUser,
  updatePhoto,
} from "../../JS/userSlice/userSlice";
import Swal from "sweetalert2";
import { FiEdit } from "react-icons/fi";
import { useRef } from "react";

export const UpdateProfile = ({ dataId }) => {
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [User, setUser] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    image: "",
    password: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUser({
        name: user.name || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        image: user.image || "",
        password: "",
      });

      // Handle preview image if available
      if (typeof user.image === "string") {
        setPreview(user.image);
      } else if (Array.isArray(user.image) && user.image.length > 0) {
        setPreview(user.image[0]);
      }
    }
  }, [user]);

  const handleUpdate = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let imageUrl = preview;

      // ✅ If new image selected, upload and get URL
if (selectedImage) {
  const formData = new FormData();
  formData.append("file", selectedImage);

  const res = await dispatch(uploadSingle(formData)).unwrap();
  imageUrl = res.imageUrl || res.url;
}

      const updatedUser = {
        ...User,
        image: imageUrl, // save as string
      };

      await dispatch(updateUser({ _id: dataId, user: updatedUser })).unwrap();
      await dispatch(currentUser());

      setShowModal(false);
      Swal.fire("تم التحديث", "تم التحديث بنجاح", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("خطأ", "فشل التحديث", "error");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!User.name) newErrors.name = "الاسم اجباري";
    if (!User.lastName) newErrors.lastName = "اللقب اجباري";
    if (!User.email) newErrors.email = "البريد الالكتروني اجباري";
    if (!User.phone) newErrors.phone = "الهاتف اجباري";
    if (!User.password) newErrors.password = "كلمة العبور اجبارية";
    return newErrors;
  };


  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        style={{
          backgroundColor: "white",
          borderColor: "white",
          color: "black",
        }}
      >
        <FiEdit color="black" />
        Modifier le profil
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>تحديث البيانات</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>الاسم :</Form.Label>
            <Form.Control
              type="text"
              value={User.name}
              onChange={(e) => setUser({ ...User, name: e.target.value })}
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>اللقب :</Form.Label>
            <Form.Control
              type="text"
              value={User.lastName}
              onChange={(e) => setUser({ ...User, lastName: e.target.value })}
            />
            {errors.lastName && (
              <p style={{ color: "red" }}>{errors.lastName}</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>البريد الإلكتروني :</Form.Label>
            <Form.Control
              type="email"
              value={User.email}
              onChange={(e) => setUser({ ...User, email: e.target.value })}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>رقم الهاتف :</Form.Label>
            <Form.Control
              type="text"
              value={User.phone}
              onChange={(e) => setUser({ ...User, phone: e.target.value })}
            />
            {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>صورة المستخدم</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedImage(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
            {preview && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={preview}
                  alt="Preview"
                  width={100}
                  style={{ borderRadius: 8 }}
                />
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>كلمة المرور :</Form.Label>
            <Form.Control
              type="password"
              value={User.password}
              onChange={(e) => setUser({ ...User, password: e.target.value })}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password}</p>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            الغاء
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
