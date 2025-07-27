import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEntData,
  deleteEntData,
} from "../../JS/entretientSlice/EntretientSlice";
import AddEntretient from "./AddEntretient";
import UpdateEntretient from "./UpdateEntretient";
import { Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import "./DisplayEntretient.css";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { getAllUsers } from "../../JS/userSlice/userSlice";
import moment from "moment";
import DatePicker from "react-datepicker";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import PhotoPreviewModal from "./PhotoPreviewModal";
import { useMediaQuery } from "react-responsive";
import ShowDataRow from "./ShowDataRow";

const DisplayEntretient = ({ShowRowData}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const dispatch = useDispatch();

  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers()); // get all users at mount
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEntData());
  }, [dispatch]);
  const entDatass = useSelector((state) => state.entData.entDatas);
  const users = useSelector((state) => state.user.users);
  const user = useSelector((state) => state.user.user);
  //console.log("usersss!:",user);
  const handleDelete = (id) => {
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
          dispatch(deleteEntData(id))
            .then(() => {
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Votre donnée est suprimé.",
                "succès"
              );
              dispatch(fetchEntData());
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

  const autorouteDistrictMap = {
    a1: ["oudhref", "mahres", "jem", "hergla", "turki"],
    a3: ["mdjazbab", "baja"],
    a4: ["bizerte"],
  };

  const entUserDistrict = user?.district;
  const entUserAutonum = user?.autonum;

  const filterData = (entDatass, userAutonum) => {
    if (!entDatass || !users) {
      return [];
    }

    const validUserIds = new Set(users.map((user) => user._id.toString()));

    const usersFromTargetRegionAndRole = users
      .filter(
        (user) =>
          (user.district || "") === entUserDistrict &&
          (user.role === "securite" || user.role === "entretient")
      )
      .map((user) => user._id.toString());

    return entDatass.filter((form) => {
      const createdById = form.createdBy?.toString(); // normalize to string
      const isCreatedByValid =
        usersFromTargetRegionAndRole.includes(createdById) &&
        validUserIds.has(createdById);
      console.log("form.createdBy:", createdById);
      console.log("isCreated!!!:", isCreatedByValid);

      if (!isCreatedByValid) return false;

      if (!entUserAutonum) return true;

      const allowedDistricts = autorouteDistrictMap[entUserAutonum] || [];
      const creator = users.find((u) => u._id.toString() === createdById);
      const formAutonum = creator?.autonum;
      const formDistrict = creator?.district;

      return (
        formAutonum === entUserAutonum &&
        allowedDistricts.includes(formDistrict)
      );
    });
  };

  // Modify filteredData to include the updated filterData function
  const filteredData = (entDatass, start, end, userAutonum = null) => {
    const baseFiltered = filterData(entDatass, userAutonum);

    if (!start && !end) {
      return baseFiltered;
    }

    return baseFiltered.filter((form) => {
      const formDate = moment(form.ddate, "YYYY-MM-DD");
      const isAfterOrSameStart =
        !start || formDate.isSameOrAfter(moment(start, "YYYY-MM-DD"));
      const isBeforeOrSameEnd =
        !end || formDate.isSameOrBefore(moment(end, "YYYY-MM-DD"));
      return isAfterOrSameStart && isBeforeOrSameEnd;
    });
  };

  // Format dates
  const formatStartDate = startDate
    ? moment(startDate).format("YYYY-MM-DD")
    : null;
  const formatEndDate = endDate ? moment(endDate).format("YYYY-MM-DD") : null;

  // Filter data and calculate sums
  const filteredDataArray = filteredData(
    entDatass,
    formatStartDate,
    formatEndDate,
    entUserAutonum
  );
  console.log("ent:::::", filteredDataArray);

  const sortedDataArray = filteredDataArray.sort(
    (a, b) =>
      new Date(b.ddate) - new Date(a.ddate) ||
      b.hours - a.hours ||
      b.minutes - a.minutes
  );

  const exportToExcel = async (filteredDataArray) => {
    if (!filteredDataArray || filteredDataArray.length === 0) return;

    const groupedByDay = {};

    // Group by ddate
    filteredDataArray.forEach((entry) => {
      const day = entry.ddate;
      if (!groupedByDay[day]) groupedByDay[day] = [];
      groupedByDay[day].push(entry);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("تقرير شهري");

    // Column widths
    worksheet.columns = [
      { header: "#", key: "index", width: 5 },
      { header: "المهمة", key: "tache", width: 30 },
      { header: "عدد الأعوان", key: "nbOuvrier", width: 15 },
      { header: "عدد الساعات", key: "time", width: 15 },
      { header: "الوضعية", key: "status", width: 15 },
    ];

    let currentRow = 1;
    let globalIndex = 1;

    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const days = Object.keys(groupedByDay).sort();

    for (const day of days) {
      const dayData = groupedByDay[day];

      // Add date header row (merged)
      const headerCell = worksheet.getCell(`A${currentRow}`);
      headerCell.value = `⏱️ التاريخ: ${day}`;
      headerCell.font = { bold: true };
      worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
      currentRow++;

      // Add table headers
      const tableHeaders = [
        "#",
        "المهمة",
        "عدد الأعوان",
        "عدد الساعات",
        "الوضعية",
      ];
      tableHeaders.forEach((text, i) => {
        const cell = worksheet.getCell(currentRow, i + 1);
        cell.value = text;
        cell.font = { bold: true };
        cell.border = borderStyle;
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
      currentRow++;

      const tacheMap = {};

      dayData.forEach((entry) => {
        const tache = entry.tache || "غير محددة";
        if (!tacheMap[tache]) {
          tacheMap[tache] = { nbOuvrier: 0, time: 0 };
        }

        const nbOuv = parseInt(entry.nbOuvrier || "0", 10);
        const hours = parseFloat(entry.time || "0");

        tacheMap[tache].nbOuvrier += isNaN(nbOuv) ? 0 : nbOuv;
        tacheMap[tache].time += isNaN(hours) ? 0 : hours;
      });

      for (const [tache, data] of Object.entries(tacheMap)) {
        const row = worksheet.getRow(currentRow);
        row.getCell(1).value = globalIndex++;
        row.getCell(2).value = tache;
        row.getCell(3).value = data.nbOuvrier;
        row.getCell(4).value = data.time;
        row.getCell(5).value = "✔️";

        for (let i = 1; i <= 5; i++) {
          row.getCell(i).border = borderStyle;
          row.getCell(i).alignment = {
            vertical: "middle",
            horizontal: "center",
          };
        }

        currentRow++;
      }

      // Add an empty row after each day
      currentRow++;
    }

    // Generate buffer and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "rapport_mensuel_entretient.xlsx");
  };
   const isMobileView = useMediaQuery({ query: "(max-width: 760px)" });

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
        <Button
          variant="primary"
          onClick={() => exportToExcel(filteredDataArray)}
          className="fas fa-download"
        >
          تصدير إلى Excel
        </Button>
      </div>
      <div className="entretien-header">
        <h2>Liste des entretiens</h2>
        <Button variant="success" onClick={() => setShowAdd(true)}>
          Ajouter
        </Button>
      </div>
{isMobileView ? (
        <>
      <div className="entretien-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Tache</th>
              <th>Nbr ouvrier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {startDate && endDate && sortedDataArray.length === 0 ? (
                                <tr>
                                  <td style={{ textAlign: "center" }} colSpan={9}>
                                    <h4>لا توجد بيانات في هذا التاريخ</h4>
                                  </td>
                                </tr>
                            ) : sortedDataArray.length === 0 ? (
                                <tr>
                                  <td style={{ textAlign: "center" }} colSpan={9}>
                                    <l-tail-chase
                                      size="40"
                                      speed="1.75"
                                      color="black"
                                    ></l-tail-chase>
                                    <h4>!الرجاء تعمير الجدول</h4>
                                  </td>
                                </tr>
                            ) : ( sortedDataArray.map((item) => (
                <tr key={item._id}>
                  <td>{item.ddate}</td>
                  <td className="truncated-cell">{item.tache}</td>
                  <td>{item.pointKilo}</td>

                  <td className="entretien-actions">
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => {
                        setSelected(item);
                        setShowUpdate(true);
                      }}
                    >
                      <FaRegEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      <MdDeleteOutline />
                    </Button>
                    <ShowDataRow ShowRowData={item} />
                  </td>
                </tr>
              )))}
          </tbody>
        </Table>
      </div>

      <AddEntretient show={showAdd} handleClose={() => setShowAdd(false)} />
      <UpdateEntretient
        show={showUpdate}
        handleClose={() => setShowUpdate(false)}
        selectedData={selected}
      />
      <PhotoPreviewModal
  show={showPreview}
  handleClose={() => setShowPreview(false)}
  imageUrl={previewUrl}
/></>
      ) : (
        <>
      <div className="entretien-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>Date</th>
              <th>Nbr Heure</th>
              <th>Tache</th>
              <th>Point Kilo</th>
              <th>Nbr ouvrier</th>
              <th>Materiel</th>
              <th>Observation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {startDate && endDate && sortedDataArray.length === 0 ? (
                                <tr>
                                  <td style={{ textAlign: "center" }} colSpan={9}>
                                    <h4>لا توجد بيانات في هذا التاريخ</h4>
                                  </td>
                                </tr>
                            ) : sortedDataArray.length === 0 ? (
                                <tr>
                                  <td style={{ textAlign: "center" }} colSpan={9}>
                                    <l-tail-chase
                                      size="40"
                                      speed="1.75"
                                      color="black"
                                    ></l-tail-chase>
                                    <h4>!الرجاء تعمير الجدول</h4>
                                  </td>
                                </tr>
                            ) : ( sortedDataArray.map((item) => (
                <tr key={item._id}>
                  <td>
                    {Array.isArray(item.image) && item.image.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "3px",
                          flexWrap: "wrap",
                        }}
                      >
                        {item.image.map((imgPath, index) => {
                          return (
                            <img
                              key={index}
                              src={imgPath}
                              alt={`entretien-${index}`}
                              style={{
                                maxWidth: "40px",
                                maxHeight: "40px",
                                margin: "5px",
                                borderRadius: 3,
                                cursor: "pointer",
                                border: "1px solid #ccc",
                              }}
                              onClick={() => {
                                setPreviewUrl(imgPath);
                                setShowPreview(true);
                              }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <p>No images available</p>
                    )}
                  </td>

                  <td>{item.ddate}</td>
                  <td>{item.time}</td>
                  <td className="truncated-cell">{item.tache}</td>
                  <td>{item.pointKilo}</td>
                  <td>{item.nbOuvrier}</td>
                  <td className="truncated-cell">{item.materiel}</td>
                  <td className="truncated-cell">{item.observation}</td>

                  <td className="entretien-actions">
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => {
                        setSelected(item);
                        setShowUpdate(true);
                      }}
                    >
                      <FaRegEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      <MdDeleteOutline />
                    </Button>
                  </td>
                </tr>
              )))}
          </tbody>
        </Table>
      </div>

      <AddEntretient show={showAdd} handleClose={() => setShowAdd(false)} />
      <UpdateEntretient
        show={showUpdate}
        handleClose={() => setShowUpdate(false)}
        selectedData={selected}
      />
      <PhotoPreviewModal
  show={showPreview}
  handleClose={() => setShowPreview(false)}
  imageUrl={previewUrl}
/></>
      )}
      
    </div>
  );
};

export default DisplayEntretient;
