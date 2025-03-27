import React, { useEffect, useState, useRef } from "react";
import { fetchForms } from "../../JS/formSlice/FormSlice";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "./HomeSens.css";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getAllUsers } from "../../JS/userSlice/userSlice";
import { useLocation } from "react-router-dom";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const StyledTable = styled(Table)`
  margin-top: 20px;
  padding: 30px;
  ${({ isMobile }) =>
    isMobile &&
    `
    font-size: 70%;
    & th, & td {
      padding: 8px;
    }
  `}
`;

const HomeSens = ({ userSens }) => {
  const dispatch = useDispatch();
  const chartAccRef = useRef(null);
  const chartInjurRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const data = useSelector((state) => state.data.data);

  useEffect(() => {
    dispatch(fetchForms());
  }, [dispatch]);

  const userRedux = useSelector((state) => state.user.users);
  const [User, setUser] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    region: "",
  });
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  useEffect(() => {
    setUser(userRedux);
  }, [userRedux]);

  const location = useLocation();

  const isMobile = useMediaQuery({ query: "(max-width: 400px)" });

  const formatStartDate = startDate
    ? moment(startDate).format("yyyy-MM-DD")
    : null;
  const formatEndDate = endDate ? moment(endDate).format("yyyy-MM-DD") : null;

  const filterData = (data) => {
    if (!data || !userRedux) {
      return [];
    }

    // Get valid user IDs from the current userRedux state
    const validUserIds = new Set(userRedux.map((user) => user._id));

    // Filter data based on valid user IDs and target region
    const usersFromTargetRegion = userRedux
      .filter((user) => (user.region || "") === userSens)
      .map((user) => user._id);

    return data.filter(
      (form) =>
        usersFromTargetRegion.includes(form.createdBy) &&
        validUserIds.has(form.createdBy) // Ensure `createdBy` is still valid
    );
  };

  const filteredData = (data, start, end) => {
    if (!start && !end) {
      return filterData(data);
    }

    return filterData(data).filter((form) => {
      const formDate = moment(form.ddate, "YYYY-MM-DD");
      const isAfterOrSameStart =
        !start || formDate.isSameOrAfter(moment(start, "YYYY-MM-DD"));
      const isBeforeOrSameEnd =
        !end || formDate.isSameOrBefore(moment(end, "YYYY-MM-DD"));
      return isAfterOrSameStart && isBeforeOrSameEnd;
    });
  };

  // Filter data and calculate sums
  const filteredDataArray = filteredData(data, formatStartDate, formatEndDate);

  const regionDirections = (userSens) => {
    switch (userSens) {
      case "sfax":
        return ["اتجاه تونس", "اتجاه صخيرة"];
      case "gabes":
        return ["اتجاه قابس", "اتجاه صفاقس"];
      default:
        return "";
    }
  };

  const sense = regionDirections(userSens);
  if (Array.isArray(sense)) {
    var injurGabes = filteredDataArray
      .filter((form) => form.sens == sense[0])
      .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurSfax = filteredDataArray
      .filter((form) => form.sens == sense[1])
      .reduce((acc, form) => acc + form.nbrblesse, 0);

    var accGabes = filteredDataArray
      .filter((form) => form.sens == sense[0])
      .reduce((acc, form) => acc + 1, 0);
    var accSfax = filteredDataArray
      .filter((form) => form.sens == sense[1])
      .reduce((acc, form) => acc + 1, 0);

    var deadGabes = filteredDataArray
      .filter((form) => form.sens == sense[0])
      .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadSfax = filteredDataArray
      .filter((form) => form.sens == sense[1])
      .reduce((acc, form) => acc + form.nbrmort, 0);
  } else {
    console.log("Directions non disponibles");
  }

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const sumInjur = injurGabes + injurSfax;
  const sumAcc = accGabes + accSfax;
  const sumDead = deadGabes + deadSfax;

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Statistics");

    worksheet.columns = [
      { header: "%جرحى", key: "iinjuries", width: 20 },
      { header: "جرحى", key: "injuries", width: 20 },
      { header: "%موتى", key: "ddeaths", width: 20 },
      { header: "موتى", key: "deaths", width: 20 },
      { header: "%حوادث", key: "aaccidents", width: 20 },
      { header: "عدد حوادث", key: "accidents", width: 20 },
      { header: "الاتجاه", key: "direction", width: 20 },
    ];

    const tableHeaderRow = worksheet.getRow(2);
    tableHeaderRow.values = worksheet.columns.map((col) => col.header);
    tableHeaderRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    worksheet.mergeCells("A1:G1");
    const headerRow = worksheet.getRow(1);
    const headerCell = headerRow.getCell(1);
    headerCell.value = `Rapport Statistique Par Sense: ${formatStartDate} - ${formatEndDate}`;
    headerCell.font = { bold: true };
    headerCell.alignment = { horizontal: "center", vertical: "middle" };

    worksheet.addRow({
      injuries: injurGabes,
      iinjuries: ((injurGabes * 100) / sumInjur).toFixed(2) + "%",
      deaths: deadGabes,
      ddeaths: ((deadGabes * 100) / sumDead).toFixed(2) + "%",
      accidents: accGabes,
      aaccidents: ((accGabes * 100) / sumAcc).toFixed(2) + "%",
      direction: "اتجاه قابس",
    });
    worksheet.addRow({
      injuries: injurSfax,
      iinjuries: ((injurSfax * 100) / sumInjur).toFixed(2) + "%",
      deaths: deadSfax,
      ddeaths: ((deadSfax * 100) / sumDead).toFixed(2) + "%",
      accidents: accSfax,
      aaccidents: ((accSfax * 100) / sumAcc).toFixed(2) + "%",
      direction: "اتجاه صفاقس",
    });
    worksheet.addRow({
      injuries: sumInjur,
      iinjuries: "",
      deaths: sumDead,
      ddeaths: "",
      accidents: sumAcc,
      aaccidents: "",
      direction: "",
    });

    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = borderStyle;
      });
    });

    const chartAccCanvas = await html2canvas(chartAccRef.current);
    const chartAccImage = chartAccCanvas.toDataURL("image/png");
    const chartInjurCanvas = await html2canvas(chartInjurRef.current);
    const chartInjurImage = chartInjurCanvas.toDataURL("image/png");

    const accImageId = workbook.addImage({
      base64: chartAccImage,
      extension: "png",
    });

    const injurImageId = workbook.addImage({
      base64: chartInjurImage,
      extension: "png",
    });

    worksheet.addImage(accImageId, "A8:H35");
    worksheet.addImage(injurImageId, "A37:H70");

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Traffic_Statistiques_ParSense.xlsx");
    });
  };

  return (
    <div className="left-right-gap">
      <StyledTable>
        <h1 className="title-layout"> إحصائيات حوادث المرور حسب الإتجاه </h1>

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
        {!startDate || !endDate ? (
          <div className="centerbtn">
            <Button variant="primary" onClick={resetFilters}>
              إعادة تعيين المرشحات
            </Button>
            <Button variant="primary" disabled>
              تصدير إلى Excel
            </Button>
          </div>
        ) : (
          <div className="centerbtn">
            <Button variant="primary" onClick={resetFilters}>
              إعادة تعيين المرشحات
            </Button>
            <Button variant="primary" onClick={exportToExcel}>
              تصدير إلى Excel
            </Button>
          </div>
        )}
        <div>
          <Table className="margin" striped bordered hover>
            <thead>
              <tr>
                <th>%</th>
                <th>جرحى </th>
                <th>%</th>
                <th>موتى</th>
                <th>%</th>
                <th>حوادث</th>
                <th>الاتجاه</th>
              </tr>
            </thead>
            {filterData(data).length === 0 &&
            (!startDate || !endDate) &&
            Array.isArray(sense) ? (
              <tbody>
                <tr>
                  <td colSpan="7">
                    <h5>الرجاء تعمير الجدول و اختيار التاريخ</h5>
                  </td>
                </tr>
              </tbody>
            ) : !startDate || !endDate ? (
              <tbody>
                <tr>
                  <td colSpan="7">
                    <h5>الرجاء اختيار التاريخ</h5>
                  </td>
                </tr>
              </tbody>
            ) : startDate &&
              endDate != null &&
              filteredData(data, startDate, endDate).length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="7">
                    <h5>لا توجد بيانات في هذا التاريخ</h5>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td>%{((injurGabes * 100) / sumInjur).toFixed(2)}</td>
                  <td>{injurGabes}</td>
                  <td>%{((deadGabes * 100) / sumDead).toFixed(2)}</td>
                  <td>{deadGabes}</td>
                  <td>%{((accGabes * 100) / sumAcc).toFixed(2)}</td>
                  <td>{accGabes}</td>
                  <td>{sense[0]}</td>
                </tr>
                <tr>
                  <td>%{((injurSfax * 100) / sumInjur).toFixed(2)}</td>
                  <td>{injurSfax}</td>
                  <td>%{((deadSfax * 100) / sumDead).toFixed(2)}</td>
                  <td>{deadSfax}</td>
                  <td>%{((accSfax * 100) / sumAcc).toFixed(2)}</td>
                  <td>{accSfax}</td>
                  <td>{sense[1]}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>{sumInjur}</td>
                  <td></td>
                  <td>{sumDead}</td>
                  <td></td>
                  <td>{sumAcc}</td>
                  <td>الاجمالي</td>
                </tr>
              </tbody>
            )}
          </Table>
          <div>
            {" "}
            {!startDate || !endDate ? (
              <h3 style={{ backgroundColor: "rgb(160, 206, 209)" }}>
                الرجاء اختيار التاريخ لرؤية الاحصائيات
              </h3>
            ) : filteredData(data, startDate, endDate).length === 0 ? (
              <h3 style={{ backgroundColor: "rgb(160, 206, 209)" }}>
                لا توجد بيانات في هذا التاريخ
              </h3>
            ) : (
              <div>
                <div ref={chartAccRef}>
                  <Bar
                    data={{
                      labels: [sense[0], sense[1]],
                      datasets: [
                        {
                          label: "Nombre d’accidents",
                          data: [accGabes, accSfax],
                          backgroundColor: "grey",
                          borderColor: "rgba(75, 192, 192, 1)",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        title: {
                          display: true,
                          text: "Nombre d’accidents par direction",
                          font: { size: 30 },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true, // Commence l’axe Y à zéro
                          title: {
                            display: true,
                            text: "Nombre d’accidents", // Titre de l’axe Y
                          },
                          ticks: {
                            stepSize: 1, // Intervalle entre les valeurs de l’axe Y
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "Direction", // Titre de l’axe X
                          },
                        },
                      },
                    }}
                    height={400}
                  />
                </div>
                <div ref={chartInjurRef}>
                  <Bar
                    data={{
                      labels: [sense[0], sense[1]],
                      datasets: [
                        {
                          label: "عدد الجرحى",
                          data: [injurGabes, injurSfax],
                          backgroundColor: "blue",
                          borderColor: "rgba(255, 206, 86, 1)",
                          borderWidth: 1,
                        },
                        {
                          label: "عدد الموتى",
                          data: [deadGabes, deadSfax],
                          backgroundColor: "red",
                          borderColor: "rgba(255, 99, 132, 1)",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        title: {
                          display: true,
                          text: "عدد الجرحى و الموتى حسب الاتجاه",
                          font: { size: 30 },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Nombre des victimes",
                          },
                          ticks: {
                            stepSize: 1,
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "Direction",
                          },
                        },
                      },
                    }}
                    height={400}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </StyledTable>
    </div>
  );
};
export default HomeSens;
