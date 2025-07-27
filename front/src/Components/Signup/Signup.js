import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, uploadSingle } from "../../JS/userSlice/userSlice";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form, Row } from "react-bootstrap";
import "./Signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

const Signup = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [register, setRegister] = useState({});
  const dispatch = useDispatch();
  const currentUserData = useSelector((state) => state.user.user);
  const isSuper = currentUserData?.isSuper;

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation basique
    if (
      !register.name ||
      !register.lastName ||
      !register.email ||
      !register.password ||
      !register.phone ||
      !register.autonum ||
      !register.district ||
      !register.role
    ) {
      return toast.error("Tous les champs doivent être remplis !", {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    // Soumission des données
    try {
      
     const registerPayload = {
      ...register,
      isAdmin: isSuper ? Boolean(register.isAdmin) : false, // ✅ Force to boolean
        };
        console.log("Submitted register data:", registerPayload);
      await dispatch(registerUser(registerPayload));

      setRegister({
        name: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        autonum: "",
        district: isSuper ? "" : currentUserData?.district || "",
        role: "",
        image: "",
        isAdmin: false,
      });
      toast.success("Utilisateur créé avec succès !", {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // setTimeout(function () {
      //   window.location.reload();
      // }, 1200);
    } catch (error) {
      toast.error("Erreur lors de la création de l’utilisateur.", {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // still use 'files' because backend uses multer.array

    try {
      const resultAction = await dispatch(uploadSingle(formData));
      if (uploadSingle.fulfilled.match(resultAction)) {
        const uploadedUrl = resultAction.payload.url; // get first file URL
        setRegister((prev) => ({
          ...prev,
          image: uploadedUrl, // ✅ store single URL, not an array
        }));
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="signup-container">
      <p>انشاء حساب جديد</p>
      <form className="signup-form">
        <Form.Label className="form-label">الاسم:</Form.Label>
        <Form.Control
          className="form-control"
          autoComplete="fname"
          name="name"
          variant="outlined"
          required
          fullWidth
          id="firstName"
          label="Nom de la famille"
          autoFocus
          onChange={(e) => setRegister({ ...register, name: e.target.value })}
        />
        <Form.Label className="form-label">اللقب:</Form.Label>
        <Form.Control
          className="form-control"
          variant="outlined"
          required
          fullWidth
          id="lastName"
          label="Prenom"
          name="lastName"
          autoComplete="lname"
          onChange={(e) =>
            setRegister({ ...register, lastName: e.target.value })
          }
        />
        <Form.Label className="form-label">بريد إلكتروني:</Form.Label>
        <Form.Control
          className="form-control"
          variant="outlined"
          required
          fullWidth
          id="email"
          label="Addresse email"
          name="email"
          autoComplete="email"
          onChange={(e) => setRegister({ ...register, email: e.target.value })}
        />
        <Form.Label className="form-label">Choix autoroute :</Form.Label>
        <Form.Select
          className="form-control"
          required
          id="autonum"
          name="autonum"
          value={register.autonum || ""}
          onChange={(e) =>
            setRegister({ ...register, autonum: e.target.value })
          }
        >
          <option value="" disabled>
            Select autoroute
          </option>
          <option value="a1">A1</option>
          <option value="a3">A3</option>
          <option value="a4">A4</option>
        </Form.Select>
        <Form.Label className="form-label">District:</Form.Label>
        <Form.Select
          className="form-control"
          required
          id="district"
          name="district"
          value={register.district || ""}
          onChange={(e) =>
            setRegister({ ...register, district: e.target.value })
          }
        >
          <option value="" disabled>
            Select district
          </option>
          {register.autonum === "a1" && (
            <>
              <option
                value="oudhref"
                disabled={
                  !isSuper &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "oudhref"
                }
              >
                Oudhref
              </option>
              <option
                value="mahres"
                disabled={
                  !isSuper &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "mahres"
                }
              >
                Mahres
              </option>
              <option
                value="jem"
                disabled={
                  !isSuper &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "jem"
                }
              >
                Jem
              </option>
              <option
                value="hergla"
                disabled={
                  !isSuper &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "hergla"
                }
              >
                Hergla
              </option>
              <option
                value="turki"
                disabled={
                  !isSuper &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "turki"
                }
              >
                Turki
              </option>
            </>
          )}
          {register.autonum === "a3" && (
            <>
              <option
                value="mdjazbab"
                disabled={
                  !isSuper &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "mdjazbab"
                }
              >
                Mdjaz Bab
              </option>
              <option
                value="baja"
                disabled={
                  !isSuper &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "baja"
                }
              >
                Baja
              </option>
            </>
          )}
          {register.autonum === "a4" && (
            <option
              value="bizerte"
              disabled={
                !isSuper &&
                currentUserData?.isAdmin &&
                currentUserData.district !== "bizerte"
              }
            >
              Bizerte
            </option>
          )}
        </Form.Select>
        <Form.Label className="form-label">Role:</Form.Label>
        <Form.Select
          className="form-control"
          required
          id="role"
          name="role"
          value={register.role || ""}
          onChange={(e) => setRegister({ ...register, role: e.target.value })}
        >
          <option value="" disabled >
            Select Role
          </option>
          <option value="entretient">Entretient</option>
          <option value="patrouille">Patrouille</option>
          <option value="securite">Sécurité</option>
        </Form.Select>
        <Form.Label className="form-label">الهاتف:</Form.Label>
        <Form.Control
          className="form-control"
          variant="outlined"
          required
          fullWidth
          id="phone"
          label="Numero de telephone"
          name="phone"
          autoComplete="phone"
          onChange={(e) => setRegister({ ...register, phone: e.target.value })}
        />

        <Form.Label className="form-label">كلمة السر:</Form.Label>
        <Form.Control
          className="form-control"
          variant="outlined"
          required
          fullWidth
          name="password"
          label="Mot de passe"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) =>
            setRegister({ ...register, password: e.target.value })
          }
        />
        <Form.Group className="mt-4">
          <Form.Label className="rtl-text">:صور الحادث</Form.Label>
          <label
            htmlFor="imageUploadInput"
            className="drop-file-input__label text-center"
          >
            <img
              src={uploadImg}
              alt="Upload"
              style={{ width: 40, height: 40 }}
            />
            <p>اختر صور</p>
          </label>
          <Form.Control
            id="imageUploadInput" // ✅ used to link the custom label
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              console.log("Selected file:", e.target.files[0]);
              uploadSingleFile(e.target.files[0]);
            }}
            style={{ display: "none" }} // ✅ hidden file input
          />
          {register?.image && (
            <img
              src={register.image}
              alt="Uploaded preview"
              className="avatar"
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                margin: "5px",
                borderRadius: 8,
              }}
            />
          )}
        </Form.Group>
        {isSuper && register.role === "securite" ? (
          <Form.Check
            style={{ marginBottom: "30px", marginTop: "30px" }}
            type="checkbox"
            id="isAdmin"
            name="isAdmin"
            label="Is Admin"
            checked={register.isAdmin}
            onChange={(e) =>
              setRegister({
                ...register,
                isAdmin: e.target.checked,
              })
            }
          />
        ) : (
          <Form.Text className="text-muted" style={{ marginBottom: "30px", marginTop: "30px", display: "block" }}>
    Patrouille ou entretient ne peuvent pas être administrateurs
  </Form.Text>
        )}
        <Button fullWidth variant="primary" onClick={handleRegister}>
          تسجيل
        </Button>
      </form>
    </div>
  );
};
export default Signup;
