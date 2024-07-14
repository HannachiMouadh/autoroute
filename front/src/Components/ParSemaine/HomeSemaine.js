import React, { useEffect, useState, useRef } from 'react'
import { fetchForms } from '../../JS/formSlice/FormSlice';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import './HomeSemaine.css';
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


const HomeSemaine = () => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const chartAccRef = useRef(null);
  const chartInjurRef = useRef(null);
  const data = useSelector((state) => state.data.data);

  useEffect(() => {
    dispatch(fetchForms());
  }, [dispatch]);

  const isMobile = useMediaQuery({ query: '(max-width: 400px)' });

  const formatStartDate = moment(startDate).format("yyyy-MM-DD");
  const formatEndDate = moment(endDate).format("yyyy-MM-DD");

  const filteredData = (start, end) => {
    return data.filter((form) => {
      const formDate = moment(form.ddate, "yyyy-MM-DD");
      return formDate.isSameOrAfter(start) && formDate.isSameOrBefore(end);
    });
  };


  const injurMonday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الأثنين')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTuesday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الثلاثاء')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurWednesday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الأربعاء')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurThursday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الخميس')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurFriday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الجمعه')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSaturday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'السبت')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSunday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الأحد')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const deadMonday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الأثنين')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTuesday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الثلاثاء')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadWednesday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الأربعاء')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadThursday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الخميس')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadFriday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الجمعه')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSaturday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'السبت')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSunday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الأحد')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const accMonday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الأثنين')
    .reduce((acc, form) => acc + 1, 0);
  const accTuesday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الثلاثاء')
    .reduce((acc, form) => acc + 1, 0);
  const accWednesday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الأربعاء')
    .reduce((acc, form) => acc + 1, 0);
  const accThursday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الخميس')
    .reduce((acc, form) => acc + 1, 0);
  const accFriday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الجمعه')
    .reduce((acc, form) => acc + 1, 0);
  const accSaturday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'السبت')
    .reduce((acc, form) => acc + 1, 0);
  const accSunday = filteredData(formatStartDate, formatEndDate)
    .filter((form) => form.day == 'الأحد')
    .reduce((acc, form) => acc + 1, 0);

  const sumInjur = injurMonday + injurTuesday + injurWednesday + injurThursday + injurFriday + injurSaturday + injurSunday;
  const sumAcc = accMonday + accTuesday + accWednesday + accThursday + accFriday + accSaturday + accSunday;
  const sumDead = deadMonday + deadTuesday + deadWednesday + deadThursday + deadFriday + deadSaturday + deadSunday;

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };


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
      { header: 'أيام', key: 'days', width: 20 },
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
    headerCell.value = `Rapport Statistique Par Semaine: ${formatStartDate} - ${formatEndDate}`;
    headerCell.font = { bold: true };
    headerCell.alignment = { horizontal: 'center', vertical: 'middle' };


    worksheet.addRow({ injuries: injurMonday, iinjuries: (injurMonday * 100 / sumInjur).toFixed(2) + '%', deaths: deadMonday, ddeaths: (deadMonday * 100 / sumDead).toFixed(2) + '%', accidents: accMonday, aaccidents: (accMonday * 100 / sumAcc).toFixed(2) + '%', days: 'الأثنين' });
    worksheet.addRow({ injuries: injurTuesday, iinjuries: (injurTuesday * 100 / sumInjur).toFixed(2) + '%', deaths: deadTuesday, ddeaths: (deadTuesday * 100 / sumDead).toFixed(2) + '%', accidents: accTuesday, aaccidents: (accTuesday * 100 / sumAcc).toFixed(2) + '%', days: 'الثلاثاء' });
    worksheet.addRow({ injuries: injurWednesday, iinjuries: (injurWednesday * 100 / sumInjur).toFixed(2) + '%', deaths: deadWednesday, ddeaths: (deadWednesday * 100 / sumDead).toFixed(2) + '%', accidents: accWednesday, aaccidents: (accWednesday * 100 / sumAcc).toFixed(2) + '%', days: 'الأربعاء' });
    worksheet.addRow({ injuries: injurThursday, iinjuries: (injurThursday * 100 / sumInjur).toFixed(2) + '%', deaths: deadThursday, ddeaths: (deadThursday * 100 / sumDead).toFixed(2) + '%', accidents: accThursday, aaccidents: (accThursday * 100 / sumAcc).toFixed(2) + '%', days: 'الخميس' });
    worksheet.addRow({ injuries: injurFriday, iinjuries: (injurFriday * 100 / sumInjur).toFixed(2) + '%', deaths: deadFriday, ddeaths: (deadFriday * 100 / sumDead).toFixed(2) + '%', accidents: accFriday, aaccidents: (accFriday * 100 / sumAcc).toFixed(2) + '%', days: 'الجمعه' });
    worksheet.addRow({ injuries: injurSaturday, iinjuries: (injurSaturday * 100 / sumInjur).toFixed(2) + '%', deaths: deadSaturday, ddeaths: (deadSaturday * 100 / sumDead).toFixed(2) + '%', accidents: accSaturday, aaccidents: (accSaturday * 100 / sumAcc).toFixed(2) + '%', days: 'السبت' });
    worksheet.addRow({ injuries: injurSunday, iinjuries: (injurSunday * 100 / sumInjur).toFixed(2) + '%', deaths: deadSunday, ddeaths: (deadSunday * 100 / sumDead).toFixed(2) + '%', accidents: accSunday, aaccidents: (accSunday * 100 / sumAcc).toFixed(2) + '%', days: 'الأحد' });
    worksheet.addRow({ injuries: sumInjur, iinjuries: '', deaths: sumDead, ddeaths: '', accidents: sumAcc, aaccidents: '', days: 'الاجمالي' });



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

    const accImageId = workbook.addImage({
      base64: chartAccImage,
      extension: 'png',
    });

    worksheet.addImage(accImageId, 'A13:I42');

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Traffic_Statistique_ParSemaine.xlsx');
    });
  };




  return (
    <div>
      {isMobile ? (<StyledTable>
        <h1 className="title">احصائيات حوادث المرور حسب ساعات اليوم</h1>
        <div className="datepickers-container">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="custom-datepicker"
          />
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
                <th>أيام</th>
              </tr>
            </thead>
            {data == ""  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="7">الرجاء تعمير الجدول و اختيار التاريخ</td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7"><h5>الرجاء اختيار التاريخ</h5></td></tr></tbody>) : startDate && endDate != null && filteredData(startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7">لا توجد بيانات في هذا التاريخ</td></tr></tbody>) : (<tbody >
              <tr>
                <td>%{(injurMonday * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurMonday}</td>
                <td>%{(deadMonday * 100 / sumDead).toFixed(2)}</td>
                <td>{deadMonday}</td>
                <td>%{(accMonday * 100 / sumAcc).toFixed(2)}</td>
                <td>{accMonday}</td>
                <td>الأثنين</td>
              </tr>
              <tr>
                <td>%{(injurTuesday * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTuesday}</td>
                <td>%{(deadTuesday * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTuesday}</td>
                <td>%{(accTuesday * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTuesday}</td>
                <td>الثلاثاء</td>
              </tr>
              <tr>
                <td>%{(injurWednesday * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurWednesday}</td>
                <td>%{(deadWednesday * 100 / sumDead).toFixed(2)}</td>
                <td>{deadWednesday}</td>
                <td>%{(accWednesday * 100 / sumAcc).toFixed(2)}</td>
                <td>{accWednesday}</td>
                <td>الأربعاء</td>
              </tr>
              <tr>
                <td>%{(injurThursday * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurThursday}</td>
                <td>%{(deadThursday * 100 / sumDead).toFixed(2)}</td>
                <td>{deadThursday}</td>
                <td>%{(accThursday * 100 / sumAcc).toFixed(2)}</td>
                <td>{accThursday}</td>
                <td>الخميس</td>
              </tr>
              <tr>
                <td>%{(injurFriday * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurFriday}</td>
                <td>%{(deadFriday * 100 / sumDead).toFixed(2)}</td>
                <td>{deadFriday}</td>
                <td>%{(accFriday * 100 / sumAcc).toFixed(2)}</td>
                <td>{accFriday}</td>
                <td>الجمعه</td>
              </tr>
              <tr>
                <td>%{(injurSaturday * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurSaturday}</td>
                <td>%{(deadSaturday * 100 / sumDead).toFixed(2)}</td>
                <td>{deadSaturday}</td>
                <td>%{(accSaturday * 100 / sumAcc).toFixed(2)}</td>
                <td>{accSaturday}</td>
                <td>السبت</td>
              </tr>
              <tr>
                <td>%{(injurSunday * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurSunday}</td>
                <td>%{(deadSunday * 100 / sumDead).toFixed(2)}</td>
                <td>{deadSunday}</td>
                <td>%{(accSunday * 100 / sumAcc).toFixed(2)}</td>
                <td>{accSunday}</td>
                <td>الأحد</td>
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
          <div> {(!startDate || !endDate) ? (<h3>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(startDate,endDate).length === 0 ? (<h3>لا توجد بيانات في هذا التاريخ</h3>) : (
            <div>
              <div ref={chartAccRef}>
                <Bar
                  data={{
                    labels: ['الأثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعه', 'السبت', 'الأحد'],
                    datasets: [

                      {
                        label: ['جرحى'],
                        data: [injurMonday, injurTuesday, injurWednesday, injurThursday, injurFriday, injurSaturday, injurSunday],
                        backgroundColor: 'blue',
                        borderColor: 'grey',
                        borderWidth: 1,
                      },
                      {
                        label: ['موتى'],
                        data: [deadMonday, deadTuesday, deadWednesday, deadThursday, deadFriday, deadSaturday, deadSunday],
                        backgroundColor: 'red',
                        borderColor: 'grey',
                        borderWidth: 1,
                      },
                      {
                        label: ['حوادث'],
                        data: [accMonday, accTuesday, accWednesday, accThursday, accFriday, accSaturday, accSunday],
                        backgroundColor: 'dark grey',
                        borderColor: 'grey',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'عدد الحوادث حسب ايام الاسبوع', font: { size: 60 } },
                    },
                  }}
                />
              </div>
            </div>
          )}</div>
        </div></StyledTable>) : (
        <StyledTable>
          <h1 className="title">إحصائيات حوادث المرور حسب أيام الاسبوع</h1>
          <div className="datepickers-container">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="custom-datepicker"
            />
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
                  <th>أيام</th>
                </tr>
              </thead>
              {data == ""  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="7">الرجاء تعمير الجدول و اختيار التاريخ</td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7"><h5>الرجاء اختيار التاريخ</h5></td></tr></tbody>) : startDate && endDate != null && filteredData(startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7">لا توجد بيانات في هذا التاريخ</td></tr></tbody>) : (<tbody >
                <tr>
                  <td>%{(injurMonday * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurMonday}</td>
                  <td>%{(deadMonday * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadMonday}</td>
                  <td>%{(accMonday * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accMonday}</td>
                  <td>الأثنين</td>
                </tr>
                <tr>
                  <td>%{(injurTuesday * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurTuesday}</td>
                  <td>%{(deadTuesday * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadTuesday}</td>
                  <td>%{(accTuesday * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accTuesday}</td>
                  <td>الثلاثاء</td>
                </tr>
                <tr>
                  <td>%{(injurWednesday * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurWednesday}</td>
                  <td>%{(deadWednesday * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadWednesday}</td>
                  <td>%{(accWednesday * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accWednesday}</td>
                  <td>الأربعاء</td>
                </tr>
                <tr>
                  <td>%{(injurThursday * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurThursday}</td>
                  <td>%{(deadThursday * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadThursday}</td>
                  <td>%{(accThursday * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accThursday}</td>
                  <td>الخميس</td>
                </tr>
                <tr>
                  <td>%{(injurFriday * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurFriday}</td>
                  <td>%{(deadFriday * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadFriday}</td>
                  <td>%{(accFriday * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accFriday}</td>
                  <td>الجمعه</td>
                </tr>
                <tr>
                  <td>%{(injurSaturday * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurSaturday}</td>
                  <td>%{(deadSaturday * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadSaturday}</td>
                  <td>%{(accSaturday * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accSaturday}</td>
                  <td>السبت</td>
                </tr>
                <tr>
                  <td>%{(injurSunday * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurSunday}</td>
                  <td>%{(deadSunday * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadSunday}</td>
                  <td>%{(accSunday * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accSunday}</td>
                  <td>الأحد</td>
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
            <div> {(!startDate || !endDate) ? (<h3>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(startDate,endDate).length === 0 ? (<h3>لا توجد بيانات في هذا التاريخ</h3>) : (
              <div>
                <div ref={chartAccRef}>
                  <Bar
                    data={{
                      labels: ['الأثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعه', 'السبت', 'الأحد'],
                      datasets: [

                        {
                          label: ['جرحى'],
                          data: [injurMonday, injurTuesday, injurWednesday, injurThursday, injurFriday, injurSaturday, injurSunday],
                          backgroundColor: 'blue',
                          borderColor: 'grey',
                          borderWidth: 1,
                        },
                        {
                          label: ['موتى'],
                          data: [deadMonday, deadTuesday, deadWednesday, deadThursday, deadFriday, deadSaturday, deadSunday],
                          backgroundColor: 'red',
                          borderColor: 'grey',
                          borderWidth: 1,
                        },
                        {
                          label: ['حوادث'],
                          data: [accMonday, accTuesday, accWednesday, accThursday, accFriday, accSaturday, accSunday],
                          backgroundColor: 'dark grey',
                          borderColor: 'grey',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'عدد الحوادث حسب ايام الاسبوع', font: { size: 60 } },
                      },
                    }}
                  />
                </div>
              </div>
            )}</div>
          </div></StyledTable>)}


    </div>

  );
};
export default HomeSemaine;