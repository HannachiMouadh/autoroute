// Patrouille.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePatData,
  fetchPatrouilles,
} from "../../JS/patrouilleSlice/PatrouilleSlice";
import { getAllUsers } from "../../JS/userSlice/userSlice";
import { useMediaQuery } from "react-responsive";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import UpdatePatrouille from "./UpdatePatrouille";
import moment from "moment";
import DatePicker from "react-datepicker";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { deleteMatriculeData, fetchMatricule } from "../../JS/matriculePatrouilleSlice/MatriculePatrouilleSlice";
import AddMatricule from "./AddMatricule";
import UpdateMatricule from "./UpdateMatricule";

const Patrouille = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
  const [showAddMatricule, setShowAddMatricule] = useState(false);
  const [showUpdateMatricule, setShowUpdateMatricule] = useState(false);
    const [showUpdatePatrouille, setShowUpdatePatrouille] = useState(false);
  const [selectedMatricule, setSelectedMatricule] = useState(null);
    const [selectedPatrouille, setSelectedPatrouille] = useState(null);
  const isMobileView = useMediaQuery({ query: "(max-width: 760px)" });
  const dispatch = useDispatch();
  const patrouilles= useSelector((state) => state.patrouille.patrouilles);
    const matricules= useSelector((state) => state.matricule.matricules);

  useEffect(() => {
    dispatch(fetchPatrouilles());
  }, [dispatch]);
    useEffect(() => {
    dispatch(fetchMatricule());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getAllUsers()); // get all users at mount
  }, [dispatch]);

  const users = useSelector((state) => state.user.users);
    const user = useSelector((state) => state.user.user);

    const autorouteDistrictMap = {
    a1: ['oudhref', 'mahres', 'jem', 'hergla', 'turki'],
    a3: ['mdjazbab', 'baja'],
    a4: ['bizerte'],
  };
 const patUserDistrict = user?.district;
 const patUserAutonum = user?.autonum;

 

   const filterDataMatricule = (matricules, userAutonum) => {
  if (!matricules || !users) {
    return [];
  }

  // Get valid user IDs
  const validUserIds = new Set(users.map((user) => user._id));

  // Filter users by district and role
  const usersFromTargetRegionAndRole = users
    .filter(
      (user) =>
        (user.district || "") === patUserDistrict &&
        (user.role || "") === "securite"
    )
    .map((user) => user._id);

return matricules.filter((form) => {
  const isCreatedByValid =
    usersFromTargetRegionAndRole.includes(form.createdBy) &&
    validUserIds.has(form.createdBy);

  if (!isCreatedByValid) return false;

  if (!patUserAutonum) return true;

  const allowedDistricts = autorouteDistrictMap[patUserAutonum] || [];

  // 🔁 New: infer from user instead of form
  const creator = users.find((u) => u._id === form.createdBy);
  const formAutonum = creator?.autonum;
  const formDistrict = creator?.district;

  return (
    formAutonum === patUserAutonum &&
    allowedDistricts.includes(formDistrict)
  );
});
};


const filteredDataArrayMatricule = filterDataMatricule(matricules,patUserAutonum);


  
  const filterDataPatrouille = (patrouilles, userAutonum) => {
  if (!patrouilles || !users) {
    return [];
  }

  // Get valid user IDs
  const validUserIds = new Set(users.map((user) => user._id));

  // Filter users by district and role
  const usersFromTargetRegionAndRole = users
    .filter(
      (user) =>
        (user.district || "") === patUserDistrict &&
        (user.role || "") === "patrouille"
    )
    .map((user) => user._id);

return patrouilles.filter((form) => {
  const isCreatedByValid =
    usersFromTargetRegionAndRole.includes(form.createdBy) &&
    validUserIds.has(form.createdBy);

  if (!isCreatedByValid) return false;

  if (!patUserAutonum) return true;

  const allowedDistricts = autorouteDistrictMap[patUserAutonum] || [];

  // 🔁 New: infer from user instead of form
  const creator = users.find((u) => u._id === form.createdBy);
  const formAutonum = creator?.autonum;
  const formDistrict = creator?.district;

  return (
    formAutonum === patUserAutonum &&
    allowedDistricts.includes(formDistrict)
  );
});
};

  
  
    // Modify filteredpatrouilles to include the updated filterpatrouilles function
  const filteredDataPatrouille = (patrouilles, start, end, userAutonum = null) => {
    const baseFiltered = filterDataPatrouille(patrouilles, userAutonum);
  
    if (!start && !end) {
      return baseFiltered;
    }
  
    return baseFiltered.filter((form) => {
      const formDate = moment(form.createdAt, "YYYY-MM-DD");
      const isAfterOrSameStart =
        !start || formDate.isSameOrAfter(moment(start, "YYYY-MM-DD"));
      const isBeforeOrSameEnd =
        !end || formDate.isSameOrBefore(moment(end, "YYYY-MM-DD"));
      return isAfterOrSameStart && isBeforeOrSameEnd;
    });
  };

  
  
    // Format dates
    const formatStartDate = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    const formatEndDate = endDate ? moment(endDate).format("YYYY-MM-DD") : null;
    const filteredDataArrayPatrouille = filteredDataPatrouille(patrouilles,formatStartDate,formatEndDate,patUserAutonum);

  const handleDeleteMatricule = (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Voulez-vous supprimer cette donnée ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Annuler",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          console.log(`Deleting data with id: ${id}`);
          dispatch(deleteMatriculeData(id))
            .then(() => {
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Votre donnée est suprimé.",
                "succès"
              );
              dispatch(fetchMatricule());
            })
            .catch((error) => {
              console.error("Error deleting data:", error);
              swalWithBootstrapButtons.fire(
                "Error!",
                "Il y a un problem lors de la supression.",
                "error"
              );
            });
        }
      });
  };

  const handleDeletePatrouille = (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Voulez-vous supprimer cette donnée ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Annuler",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          console.log(`Deleting data with id: ${id}`);
          dispatch(deletePatData(id))
            .then(() => {
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Votre donnée est suprimé.",
                "succès"
              );
              dispatch(fetchPatrouilles());
            })
            .catch((error) => {
              console.error("Error deleting data:", error);
              swalWithBootstrapButtons.fire(
                "Error!",
                "Il y a un problem lors de la supression.",
                "error"
              );
            });
        }
      });
  };

  console.log("Users from Redux:", users);



  let sessionCounter = 0;
  let isSessionOpen = false;
  let currentSessionDate = "";
  const getSessionDate = (date) => {
    const d = new Date(date);
    if (d.getHours() < 6) {
      d.setDate(d.getDate() - 1);
    }
    return d.toISOString().split("T")[0]; // e.g. "2025-05-08"
  };



  // Count tasks


const exportToExcel = (filteredDataArrayPatrouille) => {
  const tacheList = [
    "عطب ميكانيكي", "عطب كهربائي", "حاجة الى ماء او بنزين", "انفلاق عجلة",
    "سيارة رابظة", "مستعمل الطريق يطلب وسيلة جر", "مستعمل الطريق يطلب ارشادات",
    "وضع علامات", "وضع رمل علي زيت او بنزين", "جمع عساكر", "نقص في الإشارات العاكسة",
    "الوحة الضوئية متعددة الشارات", "زلقات الأمان", "سياج الحديدي", "الإشارات العمودية",
    "هاتف النجدة", "اشارات عاكسة", "غلق منعرج", "منعرج مغلق", "منعرج يجب غلقه",
    "تنظيف المعبد", "تنظيف جوانب المعبد", "رفع اطارات عجلة من المعبد", "كلب", "قط", "عنز",
    "حيوان آخر", "ابعاد حيوانات", "أمطار", "رياح", "طقس عادي و طريق مبلل", "نقل أعوان",
    "عون دورية متوقف", "حالة عادية"
  ];

  const stats = {};
  let total = 0;

  tacheList.forEach((tache) => {
    const count = filteredDataArrayPatrouille.filter((form) => form.tache === tache).length;
    stats[tache] = count;
    total += count;
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("إحصائيات المهام");

  // Set columns
  worksheet.columns = [
    { header: "النسبة المئوية", key: "percent", width: 15 },
    { header: "العدد", key: "count", width: 10 },
    { header: "تسمية المهمة", key: "task", width: 40 },
  ];

  // Add data rows
  tacheList.forEach((tache) => {
    const count = stats[tache];
    const percent = total > 0 ? `${((count / total) * 100).toFixed(2)}%` : "0.00%";
    worksheet.addRow({ task: tache, count, percent });
  });
    worksheet.mergeCells("A1:C1");
    const headerRow = worksheet.getRow(1);
    const headerCell = headerRow.getCell(1);
    headerCell.value =
      startDate && endDate
        ? `Rapport Statistique des patrouilles : ${formatStartDate} - ${formatEndDate}`
        : "Rapport Statistique des patrouilles pour touts les données";
    headerCell.font = { bold: true };
    headerCell.alignment = { horizontal: "center", vertical: "middle" };

  // Add total row
  worksheet.addRow({
    percent: "100.00%",
    count: total,
    task: "المجموع"
  });

  // Apply border to all rows
  worksheet.eachRow({ includeEmpty: false }, (row) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Export to Excel file
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "statistiques_des_taches.xlsx");
  });
};







        console.log("FilteredPatrouilles:", filteredDataArrayPatrouille);
  console.log("Patrouilles count:", patrouilles?.length);
  console.log("Users count:", users?.length);
  console.log("District filter:", patUserDistrict);
  console.log("Autonum filter:", patUserAutonum);
  console.log("start",formatStartDate);
    console.log("end",formatEndDate);
    console.log("Connected user:", user);

  


  return (
    <div>
      <div className="custom-form-container">
              <div className="datepickers-container">
                <div>
                  <label className="datepicker-label">:بداية التاريخ</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={new Date()}
                    placeholderText="Start Date"
                    className="custom-datepicker"
                  />
                </div>
                <div>
                  <label className="datepicker-label">:نهاية التاريخ</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="End Date"
                    minDate={startDate}
                    maxDate={new Date()}
                    className="custom-datepicker"
                  />
                </div>
              </div>
            </div>
            <div className="centerbtn">
              <Button
                variant="primary"
                onClick={() => setStartDate(null) || setEndDate(null)}
              >
                إعادة تعيين المرشحات
              </Button>
              <Button variant="primary" onClick={() => exportToExcel(filteredDataArrayPatrouille)}>
                تصدير إلى Excel
              </Button>
            </div>
      {isMobileView ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <table
            border="1"
            cellPadding="8"
            style={{ width: "100%", textAlign: "left", marginBottom : "40px"}}
          >
            <thead>
              <tr>
                <th>Matricule</th>
                <th>endKilometrage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataArrayMatricule.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Aucun résultat trouvé.
                  </td>
                </tr>
              ) : (
                filteredDataArrayMatricule.map((p, i) => (
                  <tr key={i}>
                    <td>{p.matricule}</td>
                    <td>{p.endKilometrage || "-"}</td>
                    <td>
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={() => {
                          setSelectedMatricule(p);
                          setShowUpdateMatricule(true);
                        }}
                      >
                        <FaRegEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteMatricule(p._id)}
                      >
                        <MdDeleteOutline />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {Array.isArray(filteredDataArrayPatrouille) &&
            Array.isArray(users) &&
            filteredDataArrayPatrouille.map((p, i) => {
              const dateObj = new Date(p.createdAt);
              const userName =
                users.find((u) => String(u._id) === String(p.createdBy))
                  ?.name || "Unknown";
              const isEndRow = p.endKilometrage;
              const sessionDate = new Date(p.createdAt).toLocaleDateString(); // e.g., '4/10/2025'

              // Reset session count if the date changes
              if (currentSessionDate !== sessionDate) {
                sessionCounter = 0;
                currentSessionDate = sessionDate;
                isSessionOpen = false;
              }

              // Start new session if startKilometrage exists and no session is currently open
              if (p.startKilometrage && !isSessionOpen) {
                sessionCounter++;
                isSessionOpen = true;
              }

              // Close session when endKilometrage is present
              if (p.endKilometrage) {
                isSessionOpen = false;
              }

              return (
                <div
                  key={i}
                  style={{
                    border: isEndRow ? "3px solid black" : "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "15px",
                    backgroundColor: isEndRow ? "#f9f9f9" : "#fff",
                    fontWeight: isEndRow ? "bold" : "normal",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <p>
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => {
                        setSelectedPatrouille(p);
                        setShowUpdatePatrouille(true);
                      }}
                    >
                      <FaRegEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeletePatrouille(p._id)}
                    >
                      <MdDeleteOutline />
                    </Button>
                  </p>
                  <p>
                    <strong>Poste numéro:</strong>
                    {sessionCounter}
                  </p>
                  <p>
                    <strong>Date:</strong>
                    {currentSessionDate}
                  </p>
                  <p>
                    <strong>Heure:</strong> {dateObj.toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>Matricule:</strong> {p.matricule}
                  </p>
                  <p>
                    <strong>Start Km:</strong> {p.startKilometrage}
                  </p>
                  <p>
                    <strong>Point Km:</strong> {p.pointKilo || "-"}
                  </p>
                  <p>
                    <strong>Tâche:</strong> {p.tache || "-"}
                  </p>
                  <p>
                    <strong>Observation:</strong> {p.observation || "-"}
                  </p>
                  <p>
                    <strong>End Km:</strong> {p.endKilometrage || "-"}
                  </p>
                  <p>
                    <strong>Créé par:</strong> {userName}
                  </p>
                </div>
              );
            })}
        </div>
      ) : (
        <div>
          <Button variant="success" onClick={() => setShowAddMatricule(true)}>
            Ajouter
          </Button>
          <table
            border="1"
            cellPadding="8"
            style={{ width: "100%", textAlign: "left", marginBottom : "40px"}}
          >
            <thead>
              <tr>
                <th>Matricule</th>
                <th>endKilometrage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataArrayMatricule.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Aucun résultat trouvé.
                  </td>
                </tr>
              ) : (
                filteredDataArrayMatricule.map((p, i) => (
                  <tr key={i}>
                    <td>{p.matricule}</td>
                    <td>{p.endKilometrage || "-"}</td>
                    <td>
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={() => {
                          setSelectedMatricule(p);
                          setShowUpdateMatricule(true);
                        }}
                      >
                        <FaRegEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteMatricule(p._id)}
                      >
                        <MdDeleteOutline />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <table
            border="1"
            cellPadding="8"
            style={{ width: "100%", textAlign: "left" }}
          >
            <thead>
              <tr>
                <th>Poste numéro</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Matricule</th>
                <th>Start Km</th>
                <th>Point Km</th>
                <th>Tâche</th>
                <th>Observation</th>
                <th>End Km</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataArrayPatrouille.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Aucun résultat trouvé.
                  </td>
                </tr>
              ) : (
                filteredDataArrayPatrouille.map((p) => {
                  const dateObj = new Date(p.createdAt);
                  const userName =
                    users.find((u) => String(u._id) === String(p.createdBy))
                      ?.name || "Unknown";
                  const isEndRow = p.endKilometrage;
                  const sessionDate = getSessionDate(dateObj);

                  if (currentSessionDate !== sessionDate) {
                    sessionCounter = 0;
                    currentSessionDate = sessionDate;
                    isSessionOpen = false;
                  }

                  if (p.startKilometrage && !isSessionOpen) {
                    sessionCounter++;
                    isSessionOpen = true;
                  }

                  if (p.endKilometrage) {
                    isSessionOpen = false;
                  }

                  return (
                    <tr
                      key={p._id}
                      style={{
                        borderBottom: isEndRow
                          ? "3px solid black"
                          : "1px solid lightgray",
                        fontWeight: isEndRow ? "bold" : "normal",
                      }}
                    >
                      <td>{`Poste ${sessionCounter}`}</td>
                      <td>{currentSessionDate}</td>
                      <td>{dateObj.toLocaleTimeString()}</td>
                      <td>{p.matricule}</td>
                      <td>{p.startKilometrage}</td>
                      <td>{p.pointKilo || "-"}</td>
                      <td>{p.tache || "-"}</td>
                      <td>{p.observation || "-"}</td>
                      <td>{p.endKilometrage || "-"}</td>
                      <td>{userName}</td>
                      <td>
                        <Button
                          variant="warning"
                          className="me-2"
                          onClick={() => {
                            setSelectedPatrouille(p);
                            setShowUpdatePatrouille(true);
                          }}
                        >
                          <FaRegEdit />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeletePatrouille(p._id)}
                        >
                          <MdDeleteOutline />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
      <AddMatricule show={showAddMatricule} handleClose={() => setShowAddMatricule(false)} />
      <UpdatePatrouille
        show={showUpdatePatrouille}
        handleClose={() => setShowUpdatePatrouille(false)}
        selectedData={selectedPatrouille}
      />
      <UpdateMatricule
        show={showUpdateMatricule}
        handleClose={() => setShowUpdateMatricule(false)}
        selectedData={selectedMatricule}
      />
    </div>
  );
};

export default Patrouille;
