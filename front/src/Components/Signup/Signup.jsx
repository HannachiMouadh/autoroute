import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, uploadSingle } from "../../JS/userSlice/userSlice";
import { Alert, Button, Form, Row, Col, Container, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

const Signup = () => {
  const dispatch = useDispatch();
  const currentUserData = useSelector((state) => state.user.user);
  const isSuper = currentUserData?.isSuper;
  const isAyman = currentUserData?.name === "ayman";

  const [register, setRegister] = useState({
    name: "",
    lastName: "",
    email: "",
    matricule: "",
    password: "",
    phone: "",
    autonum: "",
    district: "",
    role: "",
    image: [], // Initialize as empty array, even though we use single for now
    isAdmin: false,
  });

  const [preview, setPreview] = useState(null);

  // Set default district if not super admin
  useEffect(() => {
    if (!isSuper && currentUserData?.district) {
      setRegister((prev) => ({ ...prev, district: currentUserData.district }));
    }
  }, [isSuper, currentUserData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegister((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const uploadSingleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file); // Must match backend 'uploadUser.single("file")'

    try {
      const resultAction = await dispatch(uploadSingle(formData));
      if (uploadSingle.fulfilled.match(resultAction)) {
        const uploadedUrl = resultAction.payload.url; 
        console.log("Uploaded URL:", uploadedUrl);
        setRegister((prev) => ({
          ...prev,
          image: [uploadedUrl], // Store as array of strings to match user schema usually
        }));
        toast.success("Photo téléchargée !");
      } else {
         toast.error("Échec du téléchargement");
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !register.name ||
      !register.lastName ||
      !register.email ||
      !register.matricule ||
      !register.password ||
      !register.phone ||
      !register.autonum ||
      !register.district ||
      !register.role
    ) {
      return toast.error("Tous les champs sont obligatoires !");
    }

    try {
      const registerPayload = {
        ...register,
        isAdmin: isSuper ? Boolean(register.isAdmin) : false,
      };

      const resultAction = await dispatch(registerUser(registerPayload));
      
      if (registerUser.fulfilled.match(resultAction)) {
          toast.success("Utilisateur créé avec succès !");
          setRegister({
            name: "",
            lastName: "",
            email: "",
            matricule: "",
            password: "",
            phone: "",
            autonum: "",
            district: isSuper ? "" : currentUserData?.district || "",
            role: "",
            image: [],
            isAdmin: false,
          });
          setPreview(null);
      } else {
           toast.error("Erreur lors de la création.");
      }

    } catch (error) {
      toast.error("Erreur technique.");
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <h2 style={{textAlign: "center", marginBottom: "20px"}}>انشاء حساب جديد</h2>
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
        <Form.Label className="form-label">المعرف (Matricule):</Form.Label>
        <Form.Control
          className="form-control"
          variant="outlined"
          required
          fullWidth
          id="matricule"
          label="Matricule"
          name="matricule"
          onChange={(e) =>
            setRegister({ ...register, matricule: e.target.value })
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
                  !isSuper && !isAyman &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "oudhref"
                }
              >
                Oudhref
              </option>
              <option
                value="mahres"
                disabled={
                  !isSuper && !isAyman &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "mahres"
                }
              >
                Mahres
              </option>
              <option
                value="jem"
                disabled={
                  !isSuper && !isAyman &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "jem"
                }
              >
                Jem
              </option>
              <option
                value="hergla"
                disabled={
                  !isSuper && !isAyman &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "hergla"
                }
              >
                Hergla
              </option>
              <option
                value="turki"
                disabled={
                  !isSuper && !isAyman &&
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
                  !isSuper && !isAyman &&
                  currentUserData?.isAdmin &&
                  currentUserData.district !== "mdjazbab"
                }
              >
                Mdjaz Bab
              </option>
              <option
                value="baja"
                disabled={
                  !isSuper && !isAyman &&
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
                !isSuper && !isAyman &&
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
        <Form.Group className="mb-4">
                <Form.Label>Photo de profil</Form.Label>
                 <div className="d-flex align-items-center">
                    <div className="file-upload-wrapper" style={{ position: 'relative', overflow: 'hidden', marginRight: '15px' }}>
                        <Button variant="outline-primary">
                            <img src={uploadImg} alt="upload" style={{ width: "24px", marginRight: "8px" }} />
                            Charger une photo
                        </Button>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={uploadSingleFile}
                            style={{
                                fontSize: '100px',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                opacity: 0,
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                    {preview && (
                        <img 
                            src={preview} 
                            alt="preview" 
                            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }} 
                        />
                    )}
                 </div>
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