import React, { useEffect, useRef, useState } from 'react'
import { deleteForm, fetchForms, updateForm } from '../../JS/formSlice/FormSlice';
import { useDispatch, useSelector } from 'react-redux';
import Add from '../Forms/Add';
import Table from 'react-bootstrap/Table';
import './HomeHoraire.css';
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


const HomeHoraire = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const chartAccRef = useRef(null);
  const chartInjurRef = useRef(null);
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
  const isMobile = useMediaQuery({ query: '(max-width: 400px)' });
  const sum = data.reduce((acc, form) => acc + form.nbrblesse, 0);

  const formatStartDate = startDate ? moment(startDate).format("yyyy-MM-DD") : null;
  const formatEndDate = endDate ? moment(endDate).format("yyyy-MM-DD") : null;

  console.log(data.hours);

  const filteredData = (start, end) => {
    return data.filter((form) => {
      const formDate = moment(form.ddate, "yyyy-MM-DD");
      return formDate.isSameOrAfter(start) && formDate.isSameOrBefore(end);
    });
  };


  const injurOne = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 0 && form.hours < 1)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwo = filteredData(formatStartDate, formatEndDate)
  .filter((form)=>form.hours >= 1 && form.hours < 2)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurThree = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 2 && form.hours < 3)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurFour = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 3 && form.hours < 4)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurFive = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 4 && form.hours < 5)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSix = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 5 && form.hours < 6)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSeven = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 6 && form.hours < 7)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurEight = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 7 && form.hours < 8)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurNine = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 8 && form.hours < 9)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 9 && form.hours < 10)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurEleven = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 10 && form.hours < 11)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwelve = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 11 && form.hours < 12)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurThirteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 12 && form.hours < 13)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurForteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 13 && form.hours < 14)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurFifteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 14 && form.hours < 15)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSixteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 15 && form.hours < 16)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSeventeen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 16 && form.hours < 17)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurEighteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 17 && form.hours < 18)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurNineteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 18 && form.hours < 19)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwenty = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 19 && form.hours < 20)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwentyone = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 20 && form.hours < 21)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwentytwo = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 21 && form.hours < 22)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwentythree = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 22 && form.hours < 23)
  .reduce((acc, form) => acc + form.nbrblesse, 0);


  const deadOne = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 0 && form.hours < 1)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwo = filteredData(formatStartDate, formatEndDate)
  .filter((form)=>form.hours >= 1 && form.hours < 2)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadThree = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 2 && form.hours < 3)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadFour = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 3 && form.hours < 4)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadFive = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 4 && form.hours < 5)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSix = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 5 && form.hours < 6)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSeven = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 6 && form.hours < 7)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadEight = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 7 && form.hours < 8)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadNine = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 8 && form.hours < 9)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 9 && form.hours < 10)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadEleven = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 10 && form.hours < 11)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwelve = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 11 && form.hours < 12)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadThirteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 12 && form.hours < 13)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadForteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 13 && form.hours < 14)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadFifteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 14 && form.hours < 15)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSixteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 15 && form.hours < 16)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSeventeen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 16 && form.hours < 17)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadEighteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 17 && form.hours < 18)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadNineteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 18 && form.hours < 19)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwenty = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 19 && form.hours < 20)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwentyone = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 20 && form.hours < 21)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwentytwo = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 21 && form.hours < 22)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwentythree = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 22 && form.hours < 23)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  

  const accOne = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 0 && form.hours < 1)
  .reduce((acc, form) => acc + 1, 0);
  const accTwo = filteredData(formatStartDate, formatEndDate)
  .filter((form)=>form.hours >= 1 && form.hours < 2)
  .reduce((acc, form) => acc + 1, 0);
  const accThree = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 2 && form.hours < 3)
  .reduce((acc, form) => acc + 1, 0);
  const accFour = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 3 && form.hours < 4)
  .reduce((acc, form) => acc + 1, 0);
  const accFive = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 4 && form.hours < 5)
  .reduce((acc, form) => acc + 1, 0);
  const accSix = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 5 && form.hours < 6)
  .reduce((acc, form) => acc + 1, 0);
  const accSeven = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 6 && form.hours < 7)
  .reduce((acc, form) => acc + 1, 0);
  const accEight = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 7 && form.hours < 8)
  .reduce((acc, form) => acc + 1, 0);
  const accNine = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 8 && form.hours < 9)
  .reduce((acc, form) => acc + 1, 0);
  const accTen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 9 && form.hours < 10)
  .reduce((acc, form) => acc + 1, 0);
  const accEleven = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 10 && form.hours < 11)
  .reduce((acc, form) => acc + 1, 0);
  const accTwelve = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 11 && form.hours < 12)
  .reduce((acc, form) => acc + 1, 0);
  const accThirteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 12 && form.hours < 13)
  .reduce((acc, form) => acc + 1, 0);
  const accForteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 13 && form.hours < 14)
  .reduce((acc, form) => acc + 1, 0);
  const accFifteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 14 && form.hours < 15)
  .reduce((acc, form) => acc + 1, 0);
  const accSixteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 15 && form.hours < 16)
  .reduce((acc, form) => acc + 1, 0);
  const accSeventeen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 16 && form.hours < 17)
  .reduce((acc, form) => acc + 1, 0);
  const accEighteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 17 && form.hours < 18)
  .reduce((acc, form) => acc + 1, 0);
  const accNineteen = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 18 && form.hours < 19)
  .reduce((acc, form) => acc + 1, 0);
  const accTwenty = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 19 && form.hours < 20)
  .reduce((acc, form) => acc + 1, 0);
  const accTwentyone = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 20 && form.hours < 21)
  .reduce((acc, form) => acc + 1, 0);
  const accTwentytwo = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 21 && form.hours < 22)
  .reduce((acc, form) => acc + 1, 0);
  const accTwentythree = filteredData(formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 22 && form.hours < 23)
  .reduce((acc, form) => acc + 1, 0);
  
  
  
  

  const sumInjur= injurOne+injurTwo+injurThree+injurFour+injurFive+injurSix+injurSeven+injurEight+injurNine+injurTen+injurEleven+injurTwelve+injurThirteen+injurForteen+injurFifteen+injurSixteen+injurSeventeen+injurEighteen+injurNineteen+injurTwenty+injurTwentyone+injurTwentytwo+injurTwentythree;
  const sumAcc= accOne+accTwo+accThree+accFour+accFive+accSix+accSeven+accEight+accNine+accTen+accEleven+accTwelve+accThirteen+accForteen+accFifteen+accSixteen+accSeventeen+accEighteen+accNineteen+accTwenty+accTwentyone+accTwentytwo+accTwentythree;
  const sumDead=deadOne+deadTwo+deadThree+deadFour+deadFive+deadSix+deadSeven+deadEight+deadNine+deadTen+deadEleven+deadTwelve+deadThirteen+deadForteen+deadFifteen+deadSixteen+deadSeventeen+deadEighteen+deadNineteen+deadTwenty+deadTwentyone+deadTwentytwo+deadTwentythree;

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
      { header: 'الساعة', key: 'cause', width: 20 },
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
headerCell.value = `Rapport Statistique Par Horaire: ${formatStartDate} - ${formatEndDate}`;
headerCell.font = { bold: true };
headerCell.alignment = { horizontal: 'center', vertical: 'middle' };


    worksheet.addRow({ injuries: injurOne, iinjuries: (injurOne * 100 / sumInjur).toFixed(2) + '%', deaths: deadOne, ddeaths: (deadOne * 100 / sumDead).toFixed(2) + '%', accidents: accOne, aaccidents: (accOne * 100 / sumAcc).toFixed(2) + '%', cause: '0h00 - 1h00' });
    worksheet.addRow({ injuries: injurTwo, iinjuries: (injurTwo * 100 / sumInjur).toFixed(2) + '%', deaths: deadTwo, ddeaths: (deadTwo * 100 / sumDead).toFixed(2) + '%', accidents: accTwo, aaccidents: (accTwo * 100 / sumAcc).toFixed(2) + '%', cause: '1h00 - 2h00' });
    worksheet.addRow({ injuries: injurThree, iinjuries: (injurThree * 100 / sumInjur).toFixed(2) + '%', deaths: deadThree, ddeaths: (deadThree * 100 / sumDead).toFixed(2) + '%', accidents: accThree, aaccidents: (accThree * 100 / sumAcc).toFixed(2) + '%', cause: '2h00 - 3h00' });
    worksheet.addRow({ injuries: injurFour, iinjuries: (injurFour * 100 / sumInjur).toFixed(2) + '%', deaths: deadFour, ddeaths: (deadFour * 100 / sumDead).toFixed(2) + '%', accidents: accFour, aaccidents: (accFour * 100 / sumAcc).toFixed(2) + '%', cause: '3h00 - 4h00' });
    worksheet.addRow({ injuries: injurFive, iinjuries: (injurFive * 100 / sumInjur).toFixed(2) + '%', deaths: deadFive, ddeaths: (deadFive * 100 / sumDead).toFixed(2) + '%', accidents: accFive, aaccidents: (accFive * 100 / sumAcc).toFixed(2) + '%', cause: '4h00 - 5h00' });
    worksheet.addRow({ injuries: injurSix, iinjuries: (injurSix * 100 / sumInjur).toFixed(2) + '%', deaths: deadSix, ddeaths: (deadSix * 100 / sumDead).toFixed(2) + '%', accidents: accSix, aaccidents: (accSix * 100 / sumAcc).toFixed(2) + '%', cause: '5h00 - 6h00' });
    worksheet.addRow({ injuries: injurSeven, iinjuries: (injurSeven * 100 / sumInjur).toFixed(2) + '%', deaths: deadSeven, ddeaths: (deadSeven * 100 / sumDead).toFixed(2) + '%', accidents: accSeven, aaccidents: (accSeven * 100 / sumAcc).toFixed(2) + '%', cause: '6h00 - 7h00' });
    worksheet.addRow({ injuries: injurEight, iinjuries: (injurEight * 100 / sumInjur).toFixed(2) + '%', deaths: deadEight, ddeaths: (deadEight * 100 / sumDead).toFixed(2) + '%', accidents: accEight, aaccidents: (accEight * 100 / sumAcc).toFixed(2) + '%', cause: '7h00 - 8h00' });
    worksheet.addRow({ injuries: injurNine, iinjuries: (injurNine * 100 / sumInjur).toFixed(2) + '%', deaths: deadNine, ddeaths: (deadNine * 100 / sumDead).toFixed(2) + '%', accidents: accNine, aaccidents: (accNine * 100 / sumAcc).toFixed(2) + '%', cause: '8h00 - 9h00' });
    worksheet.addRow({ injuries: injurTen, iinjuries: (injurTen * 100 / sumInjur).toFixed(2) + '%', deaths: deadTen, ddeaths: (deadTen * 100 / sumDead).toFixed(2) + '%', accidents: accTen, aaccidents: (accTen * 100 / sumAcc).toFixed(2) + '%', cause: '9h00 - 10h00' });
    worksheet.addRow({ injuries: injurEleven, iinjuries: (injurEleven * 100 / sumInjur).toFixed(2) + '%', deaths: deadEleven, ddeaths: (deadEleven * 100 / sumDead).toFixed(2) + '%', accidents: accEleven, aaccidents: (accEleven * 100 / sumAcc).toFixed(2) + '%', cause: '10h00 - 11h00' });
    worksheet.addRow({ injuries: injurTwelve, iinjuries: (injurTwelve * 100 / sumInjur).toFixed(2) + '%', deaths: deadTwelve, ddeaths: (deadTwelve * 100 / sumDead).toFixed(2) + '%', accidents: accTwelve, aaccidents: (accTwelve * 100 / sumAcc).toFixed(2) + '%', cause: '11h00 - 12h00' });
    worksheet.addRow({ injuries: injurThirteen, iinjuries: (injurThirteen * 100 / sumInjur).toFixed(2) + '%', deaths: deadThirteen, ddeaths: (deadThirteen * 100 / sumDead).toFixed(2) + '%', accidents: accThirteen, aaccidents: (accThirteen * 100 / sumAcc).toFixed(2) + '%', cause: '12h00 - 13h00' });
    worksheet.addRow({ injuries: injurForteen, iinjuries: (injurForteen * 100 / sumInjur).toFixed(2) + '%', deaths: deadForteen, ddeaths: (deadForteen * 100 / sumDead).toFixed(2) + '%', accidents: accForteen, aaccidents: (accForteen * 100 / sumAcc).toFixed(2) + '%', cause: '13h00 - 14h00' });
    worksheet.addRow({ injuries: injurFifteen, iinjuries: (injurFifteen * 100 / sumInjur).toFixed(2) + '%', deaths: deadFifteen, ddeaths: (deadFifteen * 100 / sumDead).toFixed(2) + '%', accidents: accFifteen, aaccidents: (accFifteen * 100 / sumAcc).toFixed(2) + '%', cause: '14h00 - 15h00' });
    worksheet.addRow({ injuries: injurSixteen, iinjuries: (injurSixteen * 100 / sumInjur).toFixed(2) + '%', deaths: deadSixteen, ddeaths: (deadSixteen * 100 / sumDead).toFixed(2) + '%', accidents: accSixteen, aaccidents: (accSixteen * 100 / sumAcc).toFixed(2) + '%', cause: '15h00 - 16h00' });
    worksheet.addRow({ injuries: injurSeventeen, iinjuries: (injurSeventeen * 100 / sumInjur).toFixed(2) + '%', deaths: deadSeventeen, ddeaths: (deadSeventeen * 100 / sumDead).toFixed(2) + '%', accidents: accSeventeen, aaccidents: (accSeventeen * 100 / sumAcc).toFixed(2) + '%', cause: '16h00 - 17h00' });
    worksheet.addRow({ injuries: injurEighteen, iinjuries: (injurEighteen * 100 / sumInjur).toFixed(2) + '%', deaths: deadEighteen, ddeaths: (deadEighteen * 100 / sumDead).toFixed(2) + '%', accidents: accEighteen, aaccidents: (accEighteen * 100 / sumAcc).toFixed(2) + '%', cause: '17h00 - 18h00' });
    worksheet.addRow({ injuries: injurNineteen, iinjuries: (injurNineteen * 100 / sumInjur).toFixed(2) + '%', deaths: deadNineteen, ddeaths: (deadNineteen * 100 / sumDead).toFixed(2) + '%', accidents: accNineteen, aaccidents: (accNineteen * 100 / sumAcc).toFixed(2) + '%', cause: '18h00 - 19h00' });
    worksheet.addRow({ injuries: injurTwenty, iinjuries: (injurTwenty * 100 / sumInjur).toFixed(2) + '%', deaths: deadTwenty, ddeaths: (deadTwenty * 100 / sumDead).toFixed(2) + '%', accidents: accTwenty, aaccidents: (accTwenty * 100 / sumAcc).toFixed(2) + '%', cause: '19h00 - 20h00' });
    worksheet.addRow({ injuries: injurTwentyone, iinjuries: (injurTwentyone * 100 / sumInjur).toFixed(2) + '%', deaths: deadTwentyone, ddeaths: (deadTwentyone * 100 / sumDead).toFixed(2) + '%', accidents: accTwentyone, aaccidents: (accTwentyone * 100 / sumAcc).toFixed(2) + '%', cause: '20h00 - 21h00' });
    worksheet.addRow({ injuries: injurTwentytwo, iinjuries: (injurTwentytwo * 100 / sumInjur).toFixed(2) + '%', deaths: deadTwentytwo, ddeaths: (deadTwentytwo * 100 / sumDead).toFixed(2) + '%', accidents: accTwentytwo, aaccidents: (accTwentytwo * 100 / sumAcc).toFixed(2) + '%', cause: '21h00 - 22h00' });
    worksheet.addRow({ injuries: injurTwentythree, iinjuries: (injurTwentythree * 100 / sumInjur).toFixed(2) + '%', deaths: deadTwentythree, ddeaths: (deadTwentythree * 100 / sumDead).toFixed(2) + '%', accidents: accTwentythree, aaccidents: (accTwentythree * 100 / sumAcc).toFixed(2) + '%', cause: '22h00 - 23h00' });
    worksheet.addRow({ injuries: sumInjur, iinjuries: '', deaths: sumDead, ddeaths: '', accidents: sumAcc, aaccidents: '', cause: 'الاجمالي' });
    
    

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

    worksheet.addImage(accImageId, 'A27:J63');
    worksheet.addImage(injurImageId, 'A64:J100');

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Traffic_Statistique_ParHoraire.xlsx');
    });
  };

console.log(filteredData(startDate,endDate).length);


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
                  <th>الساعة</th>
                </tr>
              </thead>
              {data == ""  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="7">الرجاء تعمير الجدول و اختيار التاريخ</td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7">الرجاء اختيار التاريخ</td></tr></tbody>) : startDate && endDate != null && filteredData(startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7">لا توجد بيانات في هذا التاريخ</td></tr></tbody>) : (<tbody >
                <tr>
                <td>%{(injurOne * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurOne}</td>
                <td>%{(deadOne * 100 / sumDead).toFixed(2)}</td>
                <td>{deadOne}</td>
                <td>%{(accOne * 100 / sumAcc).toFixed(2)}</td>
                <td>{accOne}</td>
                    <td>0h00 - 1h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwo * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwo}</td>
                <td>%{(deadTwo * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwo}</td>
                <td>%{(accTwo * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwo}</td>
                    <td>1h00 - 2h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurThree * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurThree}</td>
                <td>%{(deadThree * 100 / sumDead).toFixed(2)}</td>
                <td>{deadThree}</td>
                <td>%{(accThree * 100 / sumAcc).toFixed(2)}</td>
                <td>{accThree}</td>
                    <td>2h00 - 3h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurFour * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurFour}</td>
                <td>%{(deadFour * 100 / sumDead).toFixed(2)}</td>
                <td>{deadFour}</td>
                <td>%{(accFour * 100 / sumAcc).toFixed(2)}</td>
                <td>{accFour}</td>
                    <td>3h00 - 4h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurFive * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurFive}</td>
                <td>%{(deadFive * 100 / sumDead).toFixed(2)}</td>
                <td>{deadFive}</td>
                <td>%{(accFive * 100 / sumAcc).toFixed(2)}</td>
                <td>{accFive}</td>
                    <td>4h00 - 5h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSix * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurFive}</td>
                <td>%{(deadSix * 100 / sumDead).toFixed(2)}</td>
                <td>{deadSix}</td>
                <td>%{(accSix * 100 / sumAcc).toFixed(2)}</td>
                <td>{accSix}</td>
                    <td>5h00 - 6h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSeven * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurSeven}</td>
                <td>%{(deadSeven * 100 / sumDead).toFixed(2)}</td>
                <td>{deadSeven}</td>
                <td>%{(accSeven * 100 / sumAcc).toFixed(2)}</td>
                <td>{accSeven}</td>
                    <td>6h00 - 7h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurEight * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurEight}</td>
                <td>%{(deadEight * 100 / sumDead).toFixed(2)}</td>
                <td>{deadEight}</td>
                <td>%{(accEight * 100 / sumAcc).toFixed(2)}</td>
                <td>{accEight}</td>
                    <td>7h00 - 8h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurNine * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurNine}</td>
                <td>%{(deadNine * 100 / sumDead).toFixed(2)}</td>
                <td>{deadNine}</td>
                <td>%{(accNine * 100 / sumAcc).toFixed(2)}</td>
                <td>{accNine}</td>
                    <td>8h00 - 9h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTen}</td>
                <td>%{(deadTen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTen}</td>
                <td>%{(accTen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTen}</td>
                    <td>9h00 - 10h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurEleven * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurEleven}</td>
                <td>%{(deadEleven * 100 / sumDead).toFixed(2)}</td>
                <td>{deadEleven}</td>
                <td>%{(accEleven * 100 / sumAcc).toFixed(2)}</td>
                <td>{accEleven}</td>
                    <td>10h00 - 11h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwelve * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwelve}</td>
                <td>%{(deadTwelve * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwelve}</td>
                <td>%{(accTwelve * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwelve}</td>
                    <td>11h00 - 12h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurThirteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurThirteen}</td>
                <td>%{(deadThirteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadThirteen}</td>
                <td>%{(accThirteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accThirteen}</td>
                    <td>12h00 - 13h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurForteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurForteen}</td>
                <td>%{(deadForteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadForteen}</td>
                <td>%{(accForteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accForteen}</td>
                    <td>13h00 - 14h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurFifteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurFifteen}</td>
                <td>%{(deadFifteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadFifteen}</td>
                <td>%{(accFifteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accFifteen}</td>
                    <td>14h00 - 15h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSixteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurSixteen}</td>
                <td>%{(deadSixteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadSixteen}</td>
                <td>%{(accSixteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accSixteen}</td>
                    <td>15h00 - 16h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSeventeen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurSeventeen}</td>
                <td>%{(deadSeventeen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadSeventeen}</td>
                <td>%{(accSeventeen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accSeventeen}</td>
                    <td>16h00 - 17h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurEighteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurEighteen}</td>
                <td>%{(deadEighteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadEighteen}</td>
                <td>%{(accEighteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accEighteen}</td>
                    <td>17h00 - 18h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurNineteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurNineteen}</td>
                <td>%{(deadNineteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadNineteen}</td>
                <td>%{(accNineteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accNineteen}</td>
                    <td>18h00 - 19h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwenty * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwenty}</td>
                <td>%{(deadTwenty * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwenty}</td>
                <td>%{(accTwenty * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwenty}</td>
                    <td>19h00 - 20h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwentyone * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwentyone}</td>
                <td>%{(deadTwentyone * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwentyone}</td>
                <td>%{(accTwentyone * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwentyone}</td>
                    <td>20h00 - 21h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwentytwo * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwentytwo}</td>
                <td>%{(deadTwentytwo * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwentytwo}</td>
                <td>%{(accTwentytwo * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwentytwo}</td>
                    <td>21h00 - 22h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwentythree * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwentythree}</td>
                <td>%{(deadTwentythree * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwentythree}</td>
                <td>%{(accTwentythree * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwentythree}</td>
                    <td>22h00 - 23h00</td>
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
            <div>
            {(!startDate || !endDate) ? (<h3>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(startDate,endDate).length === 0 ? (<h3>لا توجد بيانات في هذا التاريخ</h3>) : (
            <div>
              <div ref={chartAccRef}>
                <Bar
                  data={{
                    labels: ['0h00 - 1h00', '1h00 - 2h00','2h00 - 3h00','3h00 - 4h00','4h00 - 5h00','5h00 - 6h00','6h00 - 7h00','7h00 - 8h00','8h00 - 9h00','9h00 - 10h00','10h00 - 11h00','11h00 - 12h00','12h00 - 13h00','13h00 - 14h00','14h00 - 15h00','15h00 - 16h00','16h00 - 17h00','17h00 - 18h00','18h00 - 19h00','19h00 - 20h00','20h00 - 21h00','21h00 - 22h00','22h00 - 23h00'],
                    datasets: [
                      {
                        label: ' الحوادث',
                        data: [accOne, accTwo,accThree,accFour,accFive,accSix,accSeven,accEight,accNine,accTen,accEleven,accTwelve,accThirteen,accForteen,accFifteen,accSixteen,accSeventeen,accEighteen,accNineteen,accTwenty,accTwentyone,accTwentytwo,accTwentythree],
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
                      title: { display: true, text: 'عدد الحوادث حسب ساعات اليوم',font: { size: 60 }  },
                    },
                  }}
                />
              </div>
              <div ref={chartInjurRef}>
                <Bar
                  data={{
                    labels: ['0h00 - 1h00', '1h00 - 2h00','2h00 - 3h00','3h00 - 4h00','4h00 - 5h00','5h00 - 6h00','6h00 - 7h00','7h00 - 8h00','8h00 - 9h00','9h00 - 10h00','10h00 - 11h00','11h00 - 12h00','12h00 - 13h00','13h00 - 14h00','14h00 - 15h00','15h00 - 16h00','16h00 - 17h00','17h00 - 18h00','18h00 - 19h00','19h00 - 20h00','20h00 - 21h00','21h00 - 22h00','22h00 - 23h00'],
                    datasets: [
                      {
                        label: 'جرحى',                       
                        data: [deadOne, deadTwo,deadThree,deadFour,deadFive,deadSix,deadSeven,deadEight,deadNine,deadTen,deadEleven,deadTwelve,deadThirteen,deadForteen,deadFifteen,deadSixteen,deadSeventeen,deadEighteen,deadNineteen,deadTwenty,deadTwentyone,deadTwentytwo,deadTwentythree],
                        backgroundColor: 'blue',
                        borderColor: 'grey',
                        borderWidth: 1,
                      },
                      {
                        label: 'موتى',
                        data: [injurOne, injurTwo,injurThree,injurFour,injurFive,injurSix,injurSeven,injurEight,injurNine,injurTen,injurEleven,injurTwelve,injurThirteen,injurForteen,injurFifteen,injurSixteen,injurSeventeen,injurEighteen,injurNineteen,injurTwenty,injurTwentyone,injurTwentytwo,injurTwentythree],
                        backgroundColor: 'red',
                        borderColor: 'grey',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'عدد الجرحى و الموتى حسب ساعات اليوم',font: { size: 60 }  },
                    },
                  }}
                />
              </div>
            </div>
          )}
            </div>
          </div></StyledTable>) : (
        <StyledTable>
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
                  <th>الساعة</th>
                </tr>
              </thead>
              {data == ""  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="7">الرجاء تعمير الجدول و اختيار التاريخ</td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7">الرجاء اختيار التاريخ</td></tr></tbody>) : startDate && endDate != null && filteredData(startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7">لا توجد بيانات في هذا التاريخ</td></tr></tbody>) : (<tbody >
                <tr>
                <td>%{(injurOne * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurOne}</td>
                <td>%{(deadOne * 100 / sumDead).toFixed(2)}</td>
                <td>{deadOne}</td>
                <td>%{(accOne * 100 / sumAcc).toFixed(2)}</td>
                <td>{accOne}</td>
                    <td>0h00 - 1h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwo * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwo}</td>
                <td>%{(deadTwo * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwo}</td>
                <td>%{(accTwo * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwo}</td>
                    <td>1h00 - 2h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurThree * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurThree}</td>
                <td>%{(deadThree * 100 / sumDead).toFixed(2)}</td>
                <td>{deadThree}</td>
                <td>%{(accThree * 100 / sumAcc).toFixed(2)}</td>
                <td>{accThree}</td>
                    <td>2h00 - 3h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurFour * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurFour}</td>
                <td>%{(deadFour * 100 / sumDead).toFixed(2)}</td>
                <td>{deadFour}</td>
                <td>%{(accFour * 100 / sumAcc).toFixed(2)}</td>
                <td>{accFour}</td>
                    <td>3h00 - 4h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurFive * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurFive}</td>
                <td>%{(deadFive * 100 / sumDead).toFixed(2)}</td>
                <td>{deadFive}</td>
                <td>%{(accFive * 100 / sumAcc).toFixed(2)}</td>
                <td>{accFive}</td>
                    <td>4h00 - 5h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSix * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurFive}</td>
                <td>%{(deadSix * 100 / sumDead).toFixed(2)}</td>
                <td>{deadSix}</td>
                <td>%{(accSix * 100 / sumAcc).toFixed(2)}</td>
                <td>{accSix}</td>
                    <td>5h00 - 6h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSeven * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurSeven}</td>
                <td>%{(deadSeven * 100 / sumDead).toFixed(2)}</td>
                <td>{deadSeven}</td>
                <td>%{(accSeven * 100 / sumAcc).toFixed(2)}</td>
                <td>{accSeven}</td>
                    <td>6h00 - 7h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurEight * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurEight}</td>
                <td>%{(deadEight * 100 / sumDead).toFixed(2)}</td>
                <td>{deadEight}</td>
                <td>%{(accEight * 100 / sumAcc).toFixed(2)}</td>
                <td>{accEight}</td>
                    <td>7h00 - 8h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurNine * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurNine}</td>
                <td>%{(deadNine * 100 / sumDead).toFixed(2)}</td>
                <td>{deadNine}</td>
                <td>%{(accNine * 100 / sumAcc).toFixed(2)}</td>
                <td>{accNine}</td>
                    <td>8h00 - 9h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTen}</td>
                <td>%{(deadTen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTen}</td>
                <td>%{(accTen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTen}</td>
                    <td>9h00 - 10h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurEleven * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurEleven}</td>
                <td>%{(deadEleven * 100 / sumDead).toFixed(2)}</td>
                <td>{deadEleven}</td>
                <td>%{(accEleven * 100 / sumAcc).toFixed(2)}</td>
                <td>{accEleven}</td>
                    <td>10h00 - 11h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwelve * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwelve}</td>
                <td>%{(deadTwelve * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwelve}</td>
                <td>%{(accTwelve * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwelve}</td>
                    <td>11h00 - 12h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurThirteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurThirteen}</td>
                <td>%{(deadThirteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadThirteen}</td>
                <td>%{(accThirteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accThirteen}</td>
                    <td>12h00 - 13h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurForteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurForteen}</td>
                <td>%{(deadForteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadForteen}</td>
                <td>%{(accForteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accForteen}</td>
                    <td>13h00 - 14h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurFifteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurFifteen}</td>
                <td>%{(deadFifteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadFifteen}</td>
                <td>%{(accFifteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accFifteen}</td>
                    <td>14h00 - 15h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSixteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurSixteen}</td>
                <td>%{(deadSixteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadSixteen}</td>
                <td>%{(accSixteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accSixteen}</td>
                    <td>15h00 - 16h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSeventeen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurSeventeen}</td>
                <td>%{(deadSeventeen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadSeventeen}</td>
                <td>%{(accSeventeen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accSeventeen}</td>
                    <td>16h00 - 17h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurEighteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurEighteen}</td>
                <td>%{(deadEighteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadEighteen}</td>
                <td>%{(accEighteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accEighteen}</td>
                    <td>17h00 - 18h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurNineteen * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurNineteen}</td>
                <td>%{(deadNineteen * 100 / sumDead).toFixed(2)}</td>
                <td>{deadNineteen}</td>
                <td>%{(accNineteen * 100 / sumAcc).toFixed(2)}</td>
                <td>{accNineteen}</td>
                    <td>18h00 - 19h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwenty * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwenty}</td>
                <td>%{(deadTwenty * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwenty}</td>
                <td>%{(accTwenty * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwenty}</td>
                    <td>19h00 - 20h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwentyone * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwentyone}</td>
                <td>%{(deadTwentyone * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwentyone}</td>
                <td>%{(accTwentyone * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwentyone}</td>
                    <td>20h00 - 21h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwentytwo * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwentytwo}</td>
                <td>%{(deadTwentytwo * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwentytwo}</td>
                <td>%{(accTwentytwo * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwentytwo}</td>
                    <td>21h00 - 22h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwentythree * 100 / sumInjur).toFixed(2)}</td>
                <td>{injurTwentythree}</td>
                <td>%{(deadTwentythree * 100 / sumDead).toFixed(2)}</td>
                <td>{deadTwentythree}</td>
                <td>%{(accTwentythree * 100 / sumAcc).toFixed(2)}</td>
                <td>{accTwentythree}</td>
                    <td>22h00 - 23h00</td>
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
            <div>{(!startDate || !endDate) ? (<h3>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(startDate,endDate).length === 0 ? (<h3>لا توجد بيانات في هذا التاريخ</h3>) : (
            <div>
              <div ref={chartAccRef}>
              <Bar
                  data={{
                    labels: ['0h00 - 1h00', '1h00 - 2h00','2h00 - 3h00','3h00 - 4h00','4h00 - 5h00','5h00 - 6h00','6h00 - 7h00','7h00 - 8h00','8h00 - 9h00','9h00 - 10h00','10h00 - 11h00','11h00 - 12h00','12h00 - 13h00','13h00 - 14h00','14h00 - 15h00','15h00 - 16h00','16h00 - 17h00','17h00 - 18h00','18h00 - 19h00','19h00 - 20h00','20h00 - 21h00','21h00 - 22h00','22h00 - 23h00'],
                    datasets: [
                      {
                        label: ' الحوادث',
                        data: [accOne, accTwo,accThree,accFour,accFive,accSix,accSeven,accEight,accNine,accTen,accEleven,accTwelve,accThirteen,accForteen,accFifteen,accSixteen,accSeventeen,accEighteen,accNineteen,accTwenty,accTwentyone,accTwentytwo,accTwentythree],
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
                      title: { display: true, text: 'عدد الحوادث حسب ساعات اليوم',font: { size: 60 }  },
                    },
                  }}
                />
              </div>
              <div ref={chartInjurRef}>
                <Bar
                  data={{
                    labels: ['0h00 - 1h00', '1h00 - 2h00','2h00 - 3h00','3h00 - 4h00','4h00 - 5h00','5h00 - 6h00','6h00 - 7h00','7h00 - 8h00','8h00 - 9h00','9h00 - 10h00','10h00 - 11h00','11h00 - 12h00','12h00 - 13h00','13h00 - 14h00','14h00 - 15h00','15h00 - 16h00','16h00 - 17h00','17h00 - 18h00','18h00 - 19h00','19h00 - 20h00','20h00 - 21h00','21h00 - 22h00','22h00 - 23h00'],
                    datasets: [
                      {
                        label: 'جرحى',
                        
                        data: [deadOne, deadTwo,deadThree,deadFour,deadFive,deadSix,deadSeven,deadEight,deadNine,deadTen,deadEleven,deadTwelve,deadThirteen,deadForteen,deadFifteen,deadSixteen,deadSeventeen,deadEighteen,deadNineteen,deadTwenty,deadTwentyone,deadTwentytwo,deadTwentythree],
                        backgroundColor: 'blue',
                        borderColor: 'grey',
                        borderWidth: 1,
                      },
                      {
                        label: 'موتى',
                        data: [injurOne, injurTwo,injurThree,injurFour,injurFive,injurSix,injurSeven,injurEight,injurNine,injurTen,injurEleven,injurTwelve,injurThirteen,injurForteen,injurFifteen,injurSixteen,injurSeventeen,injurEighteen,injurNineteen,injurTwenty,injurTwentyone,injurTwentytwo,injurTwentythree],
                        backgroundColor: 'red',
                        borderColor: 'grey',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'عدد الجرحى و الموتى حسب ساعات اليوم',font: { size: 60 }  },
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
export default HomeHoraire;