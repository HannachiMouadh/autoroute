import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit } from "react-icons/fi";
import { updateUser } from '../../JS/userSlice/userSlice';
import Swal from 'sweetalert2';


export const UpdateUser = ({ rowData, dataId }) => {
    const dispatch = useDispatch();
    const userRedux = useSelector((state) => state.user.user);
    const [showModal, setShowModal] = useState(false);
    const [User, setUser] = useState({
        name: rowData.name || "",
        lastName: rowData.lastName || "",
        email: rowData.email || "",
        phone: rowData.phone || "",
        password: "",
    });
    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});

    const handleClose = () => setShowModal(false);
  const handleShow = () => {
    setUser({
      name: rowData.name || "",
      lastName: rowData.lastName || "",
      email: rowData.email || "",
      phone: rowData.phone || "",
      password: "",
    });
    setShowModal(true);
  };

  const handleUpdate = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      dispatch(updateUser({ _id: dataId, user: User }))
        .unwrap()
        .then(response => {
          Swal.fire('!تم التحديث', '!تم التحديث بنجاح', 'success');
          setShowModal(false);
        })
        .catch(error => {
          Swal.fire('!لم يتم التحديث', '!فشلت عملية التحديث', 'error');
          console.error('Error updating user:', error);
        });
    } else {
      setErrors(newErrors);
    }
  };

    const validateForm = () => {
        const newErrors = {};
        if (!User.name) newErrors.name = 'الاسم اجباري';
        if (!User.lastName) newErrors.lastName = 'اللقب اجباري';
        if (!User.email) newErrors.email = 'البريد الالكتروني اجباري';
        if (!User.phone) newErrors.phone = 'الهاتف اجباري';
        if (!User.password) newErrors.password = 'كلمة العبور اجبارية';
        return newErrors;
    };


    return (
        <>
            <Button variant="primary" onClick={() => setShowModal(true)} style={{ width: "40px" }}>
                <FiEdit />
            </Button>
            <Modal show={showModal} onHide={() => setShowModal(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>تحديث البيانات</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Form.Group className="mb-3">
                        <Form.Label>Nom : <b>*</b></Form.Label>
                        <Form.Control
                            className="form-control"
                            name="name"
                            value={User?.name}
                            type="text"
                            onChange={(e) => setUser({ ...User, name: e.target.value })}
                        />
                        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Prenom : <b>*</b></Form.Label>
                        <Form.Control
                            className="form-control"
                            type="text"
                            value={User?.lastName}
                            onChange={(e) => setUser({ ...User, lastName: e.target.value })}
                        />
                        {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Addresse email : <b>*</b></Form.Label>
                        <Form.Control
                            className="form-control"
                            type="email"
                            value={User?.email}
                            onChange={(e) => setUser({ ...User, email: e.target.value })}
                        />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Numero de téléphone : <b>*</b></Form.Label>
                        <Form.Control
                            className="form-control"
                            type="text"
                            value={User?.phone}
                            onChange={(e) => setUser({ ...User, phone: e.target.value })}
                        />
                        {errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>mot de pass : <b>*</b></Form.Label>
                        <Form.Control
                            className="form-control"
                            type="password"
                            value={User?.password}
                            onChange={(e) => setUser({ ...User, password: e.target.value })}
                        />
                        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        الغاء العملية
                    </Button>
                    <Button variant="primary" onClick={(e) => { handleUpdate(e) }}>
                        حفظ التغييرات
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
