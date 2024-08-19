import React, { useEffect, useState, useRef } from 'react'
import { deleteForm, fetchForms, updateForm } from '../../JS/formSlice/FormSlice';
import { useDispatch, useSelector } from 'react-redux';
import Add from '../Forms/Add';
import Table from 'react-bootstrap/Table';
import './HomeSens.css';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getAllUsers } from '../../JS/userSlice/userSlice';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);



const StyledTable = styled(Table)`
  margin-top: 20px;
  padding: 30px;
  ${({ isMobile }) => isMobile && `
    font-size: 70%;
    & th, & td {
      padding: 8px;
    }
  `}
`;


const HomeSens = ({userSens}) => {
  const dispatch = useDispatch();
  const chartAccRef = useRef(null);
  const chartInjurRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const data = useSelector((state) => state.data.data);
  //console.log("kkkkkkkkk data: ", data);
  useEffect(() => {
    dispatch(fetchForms());
  }, [dispatch]);

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = 2020; i <= currentYear; i++) {
    years.push(i.toString());
  }


  const userRedux = useSelector((state) => state.user.users);
  const [User, setUser] = useState({ name: "", lastName: "", email: "", phone: "", region:"" });
  useEffect(() => {
    dispatch(getAllUsers());
}, [dispatch]);
  useEffect(() => {
    setUser(userRedux);
  }, [userRedux]);

  const isMobile = useMediaQuery({ query: '(max-width: 400px)' });

  const formatStartDate = startDate ? moment(startDate).format("yyyy-MM-DD") : null;
  const formatEndDate = endDate ? moment(endDate).format("yyyy-MM-DD") : null;


 


  const filterData = (data) => {
    if (!data || !userRedux) {
      return [];
    }

    const usersFromTargetRegion = userRedux
      .filter((user) => user.region === userSens)
      .map((user) => user._id);

    const filteredDatas = data.filter((form) => usersFromTargetRegion.includes(form.createdBy));

    return filteredDatas;
  };
  console.log(filterData(data));

  const filteredData = (data, start, end) => {
    if (!start && !end) {
      return filterData(data)
    }
    return filterData(data).filter((form) => {
      const formDate = moment(form.ddate, "YYYY-MM-DD");
      const isAfterOrSameStart = !start || formDate.isSameOrAfter(moment(start, "YYYY-MM-DD"));
      const isBeforeOrSameEnd = !end || formDate.isSameOrBefore(moment(end, "YYYY-MM-DD"));
      return isAfterOrSameStart && isBeforeOrSameEnd ;
    });
  };
  const filteredDataArray = userRedux ? filteredData(data, formatStartDate, formatEndDate) : [];


  const injurGabes = filteredDataArray
    .filter((form) => form.sens == 'اتجاه قابس')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSfax = filteredDataArray
    .filter((form) => form.sens == 'اتجاه صفاقس')
    .reduce((acc, form) => acc + form.nbrblesse, 0);

  const accGabes = filteredDataArray
    .filter((form) => form.sens == 'اتجاه قابس')
    .reduce((acc, form) => acc + 1, 0);
  const accSfax = filteredDataArray
    .filter((form) => form.sens == 'اتجاه صفاقس')
    .reduce((acc, form) => acc + 1, 0);

  const deadGabes = filteredDataArray
    .filter((form) => form.sens == 'اتجاه قابس')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSfax = filteredDataArray
    .filter((form) => form.sens == 'اتجاه صفاقس')
    .reduce((acc, form) => acc + form.nbrmort, 0);


  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };


  const sumInjur = injurGabes + injurSfax;
  const sumAcc = accGabes + accSfax;
  const sumDead = deadGabes + deadSfax;

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Statistics');

    worksheet.columns = [
      { header: '%جرحى', key: 'iinjuries', width: 20 },
      { header: 'جرحى', key: 'injuries', width: 20 },
      { header: '%موتى', key: 'ddeaths', width: 20 },
      { header: 'موتى', key: 'deaths', width: 20 },
      { header: '%حوادث', key: 'aaccidents', width: 20 },
      { header: 'عدد حوادث', key: 'accidents', width: 20 },
      { header: 'الاتجاه', key: 'direction', width: 20 },
    ];

    const tableHeaderRow = worksheet.getRow(2);
    tableHeaderRow.values = worksheet.columns.map(col => col.header);
    tableHeaderRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    worksheet.mergeCells('A1:G1');
    const headerRow = worksheet.getRow(1);
    const headerCell = headerRow.getCell(1);
    headerCell.value = `Rapport Statistique Par Sense: ${formatStartDate} - ${formatEndDate}`;
    headerCell.font = { bold: true };
    headerCell.alignment = { horizontal: 'center', vertical: 'middle' };


    worksheet.addRow({ injuries: injurGabes, iinjuries: (injurGabes * 100 / sumInjur).toFixed(2) + '%', deaths: deadGabes, ddeaths: (deadGabes * 100 / sumDead).toFixed(2) + '%', accidents: accGabes, aaccidents: (accGabes * 100 / sumAcc).toFixed(2) + '%', direction: 'اتجاه قابس' });
    worksheet.addRow({ injuries: injurSfax, iinjuries: (injurSfax * 100 / sumInjur).toFixed(2) + '%', deaths: deadSfax, ddeaths: (deadSfax * 100 / sumDead).toFixed(2) + '%', accidents: accSfax, aaccidents: (accSfax * 100 / sumAcc).toFixed(2) + '%', direction: 'اتجاه صفاقس' });
    worksheet.addRow({ injuries: sumInjur, iinjuries: '', deaths: sumDead, ddeaths: '', accidents: sumAcc, aaccidents: '', direction: '' });

    const borderStyle = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = borderStyle;
      });
    });


    const chartAccCanvas = await html2canvas(chartAccRef.current);
    const chartAccImage = chartAccCanvas.toDataURL('image/png');
    const chartInjurCanvas = await html2canvas(chartInjurRef.current);
    const chartInjurImage = chartInjurCanvas.toDataURL('image/png');

    const accImageId = workbook.addImage({
      base64: chartAccImage,
      extension: 'png',
    });

    const injurImageId = workbook.addImage({
      base64: chartInjurImage,
      extension: 'png',
    });

    worksheet.addImage(accImageId, 'A8:H35');
    worksheet.addImage(injurImageId, 'A37:H70');

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Traffic_Statistiques_ParSense.xlsx');
    });
  };


  return (
    <div>
      {isMobile ? (<StyledTable><h1 className="title"> إحصائيات حوادث المرور حسب الإتجاه </h1>
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
                className="custom-datepicker"
              />
            </div>
          </div>
        </div>
        <div>
          <Button variant="secondary" onClick={resetFilters}>
            إعادة تعيين المرشحات
          </Button>
        </div>
        {(!startDate || !endDate) ? (<div><Button variant="primary" disabled>تصدير إلى Excel</Button></div>) : (<div>
          <Button variant="primary" onClick={exportToExcel}>تصدير إلى Excel</Button>
        </div>)}
        <div>
          <p>You are viewing on a mobile.</p>
          <Table className="margin" striped bordered hover >
            <thead >
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
            {filterData(data).length === 0  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="7"><h5>الرجاء تعمير الجدول و اختيار التاريخ</h5></td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7"><h5>الرجاء اختيار التاريخ</h5></td></tr></tbody>) : startDate && endDate != null && filteredData(data,startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7"><h5>لا توجد بيانات في هذا التاريخ</h5></td></tr></tbody>) : (<tbody >
              <tr>
                <td>%{(injurGabes * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurGabes}</td>
                <td>%{(deadGabes * 100 / sumDead).toFixed(2)}</td>
                <td>{deadGabes}</td>
                <td>%{(accGabes * 100 / sumAcc).toFixed(2)}</td>
                <td>{accGabes}</td>
                <td>اتجاه قابس</td>
              </tr>
              <tr>
                <td>%{(injurSfax * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurSfax}</td>
                <td>%{(deadSfax * 100 / sumDead).toFixed(2)}</td>
                <td>{deadSfax}</td>
                <td>%{(accSfax * 100 / sumAcc).toFixed(2)}</td>
                <td>{accSfax}</td>
                <td>اتجاه صفاقس</td>
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
            </tbody>)}

          </Table>
          <div> {(!startDate || !endDate) ? (<h3 style={{backgroundColor:"burlywood"}}>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(data,startDate,endDate).length === 0 ? (<h3 style={{backgroundColor:"burlywood"}}>لا توجد بيانات في هذا التاريخ</h3>) : (
            <div>
              <div ref={chartAccRef}>
                <Bar
                  data={{
                    labels: ['اتجاه قابس', 'اتجاه صفاقس'],
                    datasets: [
                      {
                        label: 'عدد الحوادث',
                        data: [accGabes, accSfax],
                        backgroundColor: 'dark grey',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'عدد الحوادث حسب الاتجاه', font: { size: 60 } },
                    },
                  }}
                />
              </div>
              <div ref={chartInjurRef}>
                <Bar
                  data={{
                    labels: ['اتجاه قابس', 'اتجاه صفاقس'],
                    datasets: [
                      {
                        label: 'عدد الجرحى',
                        data: [injurGabes, injurSfax],
                        backgroundColor: 'blue',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 1,
                      },
                      {
                        label: 'عدد الموتى',
                        data: [deadGabes, deadSfax],
                        backgroundColor: 'red',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'عدد الجرحى و الموتى حسب الاتجاه', font: { size: 60 } },
                    },
                  }}
                />
              </div>
            </div>
          )}</div>
        </div></StyledTable>) : (
        <StyledTable>
          <h1 className="title"> إحصائيات حوادث المرور حسب الإتجاه </h1>

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
                  className="custom-datepicker"
                />
              </div>
            </div>
          </div>
          <div>
            <Button variant="secondary" onClick={resetFilters}>
              إعادة تعيين المرشحات
            </Button>
          </div>
          {(!startDate || !endDate) ? (<div><Button variant="primary" disabled>تصدير إلى Excel</Button></div>) : (<div>
            <Button variant="primary" onClick={exportToExcel}>تصدير إلى Excel</Button>
          </div>)}
          <div>
            <p>You are viewing on a larger screen.</p>
            <Table className="margin" striped bordered hover >
              <thead >
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
              {filterData(data).length === 0  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="7"><h5>الرجاء تعمير الجدول و اختيار التاريخ</h5></td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7"><h5>الرجاء اختيار التاريخ</h5></td></tr></tbody>) : startDate && endDate != null && filteredData(data,startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7"><h5>لا توجد بيانات في هذا التاريخ</h5></td></tr></tbody>) : (<tbody >
                <tr>
                  <td>%{(injurGabes * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurGabes}</td>
                  <td>%{(deadGabes * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadGabes}</td>
                  <td>%{(accGabes * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accGabes}</td>
                  <td>اتجاه قابس</td>
                </tr>
                <tr>
                  <td>%{(injurSfax * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurSfax}</td>
                  <td>%{(deadSfax * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadSfax}</td>
                  <td>%{(accSfax * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accSfax}</td>
                  <td>اتجاه صفاقس</td>
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
              </tbody>)}

            </Table>
            <div> {(!startDate || !endDate) ? (<h3 style={{backgroundColor:"burlywood"}}>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(data,startDate,endDate).length === 0 ? (<h3 style={{backgroundColor:"burlywood"}}>لا توجد بيانات في هذا التاريخ</h3>) : (
              <div>
                <div ref={chartAccRef}>
                  <Bar
                    data={{
                      labels: ['اتجاه قابس', 'اتجاه صفاقس'],
                      datasets: [
                        {
                          label: 'عدد الحوادث',
                          data: [accGabes, accSfax],
                          backgroundColor: 'grey',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'عدد الحوادث حسب الاتجاه', font: { size: 60 } },
                      },
                    }}
                  />
                </div>
                <div ref={chartInjurRef}>
                  <Bar
                    data={{
                      labels: ['اتجاه قابس', 'اتجاه صفاقس'],
                      datasets: [
                        {
                          label: 'عدد الجرحى',
                          data: [injurGabes, injurSfax],
                          backgroundColor: 'blue',
                          borderColor: 'rgba(255, 206, 86, 1)',
                          borderWidth: 1,
                        },
                        {
                          label: 'عدد الموتى',
                          data: [deadGabes, deadSfax],
                          backgroundColor: 'red',
                          borderColor: 'rgba(255, 99, 132, 1)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'عدد الجرحى و الموتى حسب الاتجاه', font: { size: 60 } },
                      },
                    }}
                  />
                </div>
              </div>
            )}
            </div>
          </div></StyledTable>)}
    </div>

  );
};
export default HomeSens;