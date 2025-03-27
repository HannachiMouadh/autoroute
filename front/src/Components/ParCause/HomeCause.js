import React, { useEffect, useState, useRef } from 'react'
import { fetchForms } from '../../JS/formSlice/FormSlice';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import './HomeCause.css';
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
import { currentUser, getAllUsers } from '../../JS/userSlice/userSlice';

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


const HomeSemaine = ({ userCause }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const chartAccRef = useRef(null);
  const chartInjurRef = useRef(null);
  const data = useSelector((state) => state.data.data);
  const isAuth = localStorage.getItem("token");
    useEffect(() => {
        dispatch(fetchForms());
    }, [dispatch]);

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
    
      // Get valid user IDs from the current userRedux state
      const validUserIds = new Set(userRedux.map((user) => user._id));
    
      // Filter data based on valid user IDs and target region
      const usersFromTargetRegion = userRedux
        .filter((user) => (user.region || "") === userCause)
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
        const isAfterOrSameStart = !start || formDate.isSameOrAfter(moment(start, "YYYY-MM-DD"));
        const isBeforeOrSameEnd = !end || formDate.isSameOrBefore(moment(end, "YYYY-MM-DD"));
        return isAfterOrSameStart && isBeforeOrSameEnd;
      });
    };
    
    
    // Filter data and calculate sums
    const filteredDataArray = filteredData(data, formatStartDate, formatEndDate);

  const injurVitesse = filteredDataArray
    .filter((form) => form.cause == 'سرعة فائقة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurEclat = filteredDataArray
    .filter((form) => form.cause == 'انشطار اطار العجلة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSleep = filteredDataArray
    .filter((form) => form.cause == 'نعاس')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurDouble = filteredDataArray
    .filter((form) => form.cause == 'مجاوزة فجئية')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurDrunk = filteredDataArray
    .filter((form) => form.cause == 'سياقة في حالة سكر')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurWet = filteredDataArray
    .filter((form) => form.cause == 'طريق مبلل')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurAtt = filteredDataArray
    .filter((form) => form.cause == 'عدم انتباه')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurHole = filteredDataArray
    .filter((form) => form.cause == 'وجود حفرة وسط الطريق')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTruck = filteredDataArray
    .filter((form) => form.cause == 'انقلاب الشاحنة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurAnimal = filteredDataArray
    .filter((form) => form.cause == 'حيوان على الطريق السيارة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurMan = filteredDataArray
    .filter((form) => form.cause == 'مترجل على الطريق السيارة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTurn = filteredDataArray
    .filter((form) => form.cause == 'الدوران في الإتجاه المعاكس')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurOut = filteredDataArray
    .filter((form) => form.cause == 'الخروج من فتحة عشوائية ')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurCar = filteredDataArray
    .filter((form) => form.cause == 'اصطدام سيارة باخرى رابظة على طرف الطريق')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurPanne = filteredDataArray
    .filter((form) => form.cause == 'عطب مكانيكي/ عطب كهربائي')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurBehind = filteredDataArray
    .filter((form) => form.cause == 'مضايقة من الخلف')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurMoto = filteredDataArray
    .filter((form) => form.cause == 'اصطدام السيارة بالدراجة النارية')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurLeft = filteredDataArray
    .filter((form) => form.cause == 'وجود عجلة او بقايا عجلة على الطريق')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurHerb = filteredDataArray
    .filter((form) => form.cause == 'سقوط قرط على الطريق')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurAcc = filteredDataArray
    .filter((form) => form.cause == 'اصطدام سيارتان او اكثر ')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurControl = filteredDataArray
    .filter((form) => form.cause == 'عدم التحكم في السيارة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTired = filteredDataArray
    .filter((form) => form.cause == 'السياقة تحت تأثير التعب و الإرهاق')
    .reduce((acc, form) => acc + form.nbrblesse, 0);


  const deadVitesse = filteredDataArray
    .filter((form) => form.cause == 'سرعة فائقة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadEclat = filteredDataArray
    .filter((form) => form.cause == 'انشطار اطار العجلة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSleep = filteredDataArray
    .filter((form) => form.cause == 'نعاس')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadDouble = filteredDataArray
    .filter((form) => form.cause == 'مجاوزة فجئية')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadDrunk = filteredDataArray
    .filter((form) => form.cause == 'سياقة في حالة سكر')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadWet = filteredDataArray
    .filter((form) => form.cause == 'طريق مبلل')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadAtt = filteredDataArray
    .filter((form) => form.cause == 'عدم انتباه')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadHole = filteredDataArray
    .filter((form) => form.cause == 'وجود حفرة وسط الطريق')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTruck = filteredDataArray
    .filter((form) => form.cause == 'انقلاب الشاحنة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadAnimal = filteredDataArray
    .filter((form) => form.cause == 'حيوان على الطريق السيارة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadMan = filteredDataArray
    .filter((form) => form.cause == 'مترجل على الطريق السيارة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTurn = filteredDataArray
    .filter((form) => form.cause == 'الدوران في الإتجاه المعاكس')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadOut = filteredDataArray
    .filter((form) => form.cause == 'الخروج من فتحة عشوائية ')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadCar = filteredDataArray
    .filter((form) => form.cause == 'اصطدام سيارة باخرى رابظة على طرف الطريق')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadPanne = filteredDataArray
    .filter((form) => form.cause == 'عطب مكانيكي/ عطب كهربائي')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadBehind = filteredDataArray
    .filter((form) => form.cause == 'مضايقة من الخلف')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadMoto = filteredDataArray
    .filter((form) => form.cause == 'اصطدام السيارة بالدراجة النارية')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadLeft = filteredDataArray
    .filter((form) => form.cause == 'وجود عجلة او بقايا عجلة على الطريق')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadHerb = filteredDataArray
    .filter((form) => form.cause == 'سقوط قرط على الطريق')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadAcc = filteredDataArray
    .filter((form) => form.cause == 'اصطدام سيارتان او اكثر ')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadControl = filteredDataArray
    .filter((form) => form.cause == 'عدم التحكم في السيارة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTired = filteredDataArray
    .filter((form) => form.cause == 'السياقة تحت تأثير التعب و الإرهاق')
    .reduce((acc, form) => acc + form.nbrmort, 0);

  const accVitesse = filteredDataArray
    .filter((form) => form.cause == 'سرعة فائقة')
    .reduce((acc, form) => acc + 1, 0);
  const accEclat = filteredDataArray
    .filter((form) => form.cause == 'انشطار اطار العجلة')
    .reduce((acc, form) => acc + 1, 0);
  const accSleep = filteredDataArray
    .filter((form) => form.cause == 'نعاس')
    .reduce((acc, form) => acc + 1, 0);
  const accDouble = filteredDataArray
    .filter((form) => form.cause == 'مجاوزة فجئية')
    .reduce((acc, form) => acc + 1, 0);
  const accDrunk = filteredDataArray
    .filter((form) => form.cause == 'سياقة في حالة سكر')
    .reduce((acc, form) => acc + 1, 0);
  const accWet = filteredDataArray
    .filter((form) => form.cause == 'طريق مبلل')
    .reduce((acc, form) => acc + 1, 0);
  const accAtt = filteredDataArray
    .filter((form) => form.cause == 'عدم انتباه')
    .reduce((acc, form) => acc + 1, 0);
  const accHole = filteredDataArray
    .filter((form) => form.cause == 'وجود حفرة وسط الطريق')
    .reduce((acc, form) => acc + 1, 0);
  const accTruck = filteredDataArray
    .filter((form) => form.cause == 'انقلاب الشاحنة')
    .reduce((acc, form) => acc + 1, 0);
  const accAnimal = filteredDataArray
    .filter((form) => form.cause == 'حيوان على الطريق السيارة')
    .reduce((acc, form) => acc + 1, 0);
  const accMan = filteredDataArray
    .filter((form) => form.cause == 'مترجل على الطريق السيارة')
    .reduce((acc, form) => acc + 1, 0);
  const accTurn = filteredDataArray
    .filter((form) => form.cause == 'الدوران في الإتجاه المعاكس')
    .reduce((acc, form) => acc + 1, 0);
  const accOut = filteredDataArray
    .filter((form) => form.cause == 'الخروج من فتحة عشوائية ')
    .reduce((acc, form) => acc + 1, 0);
  const accCar = filteredDataArray
    .filter((form) => form.cause == 'اصطدام سيارة باخرى رابظة على طرف الطريق')
    .reduce((acc, form) => acc + 1, 0);
  const accPanne = filteredDataArray
    .filter((form) => form.cause == 'عطب مكانيكي/ عطب كهربائي')
    .reduce((acc, form) => acc + 1, 0);
  const accBehind = filteredDataArray
    .filter((form) => form.cause == 'مضايقة من الخلف')
    .reduce((acc, form) => acc + 1, 0);
  const accMoto = filteredDataArray
    .filter((form) => form.cause == 'اصطدام السيارة بالدراجة النارية')
    .reduce((acc, form) => acc + 1, 0);
  const accLeft = filteredDataArray
    .filter((form) => form.cause == 'وجود عجلة او بقايا عجلة على الطريق')
    .reduce((acc, form) => acc + 1, 0);
  const accHerb = filteredDataArray
    .filter((form) => form.cause == 'سقوط قرط على الطريق')
    .reduce((acc, form) => acc + 1, 0);
  const accAcc = filteredDataArray
    .filter((form) => form.cause == 'اصطدام سيارتان او اكثر ')
    .reduce((acc, form) => acc + 1, 0);
  const accControl = filteredDataArray
    .filter((form) => form.cause == 'عدم التحكم في السيارة')
    .reduce((acc, form) => acc + 1, 0);
  const accTired = filteredDataArray
    .filter((form) => form.cause == 'السياقة تحت تأثير التعب و الإرهاق')
    .reduce((acc, form) => acc + 1, 0);

  const sumInjur = injurTired + injurMoto + injurPanne + injurOut + injurTurn + injurMan + injurTruck + injurWet + injurSleep + injurVitesse + injurAcc + injurAnimal + injurAtt + injurBehind + injurCar + injurControl + injurDouble + injurDrunk + injurEclat + injurHerb + injurHole + injurLeft;
  const sumAcc = accVitesse + accEclat + accSleep + accDouble + accDrunk + accWet + accAtt + accHole + accTruck + accAnimal + accMan + accTurn + accOut + accCar + accPanne + accBehind + accMoto + accLeft + accHerb + accAcc + accControl + accTired;
  const sumDead = deadVitesse + deadEclat + deadSleep + deadDouble + deadDrunk + deadWet + deadAtt + deadHole + deadTruck + deadAnimal + deadMan + deadTurn + deadOut + deadCar + deadPanne + deadBehind + deadMoto + deadLeft + deadHerb + deadAcc + deadControl + deadTired;

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
      { header: 'الأسباب', key: 'cause', width: 20 },
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
    headerCell.value = `Rapport Statistique Par Cause: ${formatStartDate} - ${formatEndDate}`;
    headerCell.font = { bold: true };
    headerCell.alignment = { horizontal: 'center', vertical: 'middle' };


    worksheet.addRow({ injuries: injurVitesse, iinjuries: (injurVitesse * 100 / sumInjur).toFixed(2) + '%', deaths: deadVitesse, ddeaths: (deadVitesse * 100 / sumDead).toFixed(2) + '%', accidents: accVitesse, aaccidents: (accVitesse * 100 / sumAcc).toFixed(2) + '%', cause: 'سرعة فائقة' });
    worksheet.addRow({ injuries: injurEclat, iinjuries: (injurEclat * 100 / sumInjur).toFixed(2) + '%', deaths: deadEclat, ddeaths: (deadEclat * 100 / sumDead).toFixed(2) + '%', accidents: accEclat, aaccidents: (accEclat * 100 / sumAcc).toFixed(2) + '%', cause: 'انشطار اطار العجلة' });
    worksheet.addRow({ injuries: injurSleep, iinjuries: (injurSleep * 100 / sumInjur).toFixed(2) + '%', deaths: deadSleep, ddeaths: (deadSleep * 100 / sumDead).toFixed(2) + '%', accidents: accSleep, aaccidents: (accSleep * 100 / sumAcc).toFixed(2) + '%', cause: 'نعاس' });
    worksheet.addRow({ injuries: injurDouble, iinjuries: (injurDouble * 100 / sumInjur).toFixed(2) + '%', deaths: deadDouble, ddeaths: (deadDouble * 100 / sumDead).toFixed(2) + '%', accidents: accDouble, aaccidents: (accDouble * 100 / sumAcc).toFixed(2) + '%', cause: 'مجاوزة فجئية' });
    worksheet.addRow({ injuries: injurDrunk, iinjuries: (injurDrunk * 100 / sumInjur).toFixed(2) + '%', deaths: deadDrunk, ddeaths: (deadDrunk * 100 / sumDead).toFixed(2) + '%', accidents: accDrunk, aaccidents: (accDrunk * 100 / sumAcc).toFixed(2) + '%', cause: 'سياقة في حالة سكر' });
    worksheet.addRow({ injuries: injurWet, iinjuries: (injurWet * 100 / sumInjur).toFixed(2) + '%', deaths: deadWet, ddeaths: (deadWet * 100 / sumDead).toFixed(2) + '%', accidents: accWet, aaccidents: (accWet * 100 / sumAcc).toFixed(2) + '%', cause: 'طريق مبلل' });
    worksheet.addRow({ injuries: injurAtt, iinjuries: (injurAtt * 100 / sumInjur).toFixed(2) + '%', deaths: deadAtt, ddeaths: (deadAtt * 100 / sumDead).toFixed(2) + '%', accidents: accAtt, aaccidents: (accAtt * 100 / sumAcc).toFixed(2) + '%', cause: 'عدم انتباه' });
    worksheet.addRow({ injuries: injurHole, iinjuries: (injurHole * 100 / sumInjur).toFixed(2) + '%', deaths: deadHole, ddeaths: (deadHole * 100 / sumDead).toFixed(2) + '%', accidents: accHole, aaccidents: (accHole * 100 / sumAcc).toFixed(2) + '%', cause: 'وجود حفرة وسط الطريق' });
    worksheet.addRow({ injuries: injurTruck, iinjuries: (injurTruck * 100 / sumInjur).toFixed(2) + '%', deaths: deadTruck, ddeaths: (deadTruck * 100 / sumDead).toFixed(2) + '%', accidents: accTruck, aaccidents: (accTruck * 100 / sumAcc).toFixed(2) + '%', cause: 'انقلاب الشاحنة' });
    worksheet.addRow({ injuries: injurAnimal, iinjuries: (injurAnimal * 100 / sumInjur).toFixed(2) + '%', deaths: deadAnimal, ddeaths: (deadAnimal * 100 / sumDead).toFixed(2) + '%', accidents: accAnimal, aaccidents: (accAnimal * 100 / sumAcc).toFixed(2) + '%', cause: 'حيوان على الطريق السيارة' });
    worksheet.addRow({ injuries: injurMan, iinjuries: (injurMan * 100 / sumInjur).toFixed(2) + '%', deaths: deadMan, ddeaths: (deadMan * 100 / sumDead).toFixed(2) + '%', accidents: accMan, aaccidents: (accMan * 100 / sumAcc).toFixed(2) + '%', cause: 'مترجل على الطريق السيارة' });
    worksheet.addRow({ injuries: injurTurn, iinjuries: (injurTurn * 100 / sumInjur).toFixed(2) + '%', deaths: deadTurn, ddeaths: (deadTurn * 100 / sumDead).toFixed(2) + '%', accidents: accTurn, aaccidents: (accTurn * 100 / sumAcc).toFixed(2) + '%', cause: 'الدوران في الإتجاه المعاكس' });
    worksheet.addRow({ injuries: injurOut, iinjuries: (injurOut * 100 / sumInjur).toFixed(2) + '%', deaths: deadOut, ddeaths: (deadOut * 100 / sumDead).toFixed(2) + '%', accidents: accOut, aaccidents: (accOut * 100 / sumAcc).toFixed(2) + '%', cause: 'الخروج من فتحة عشوائية' });
    worksheet.addRow({ injuries: injurCar, iinjuries: (injurCar * 100 / sumInjur).toFixed(2) + '%', deaths: deadCar, ddeaths: (deadCar * 100 / sumDead).toFixed(2) + '%', accidents: accCar, aaccidents: (accCar * 100 / sumAcc).toFixed(2) + '%', cause: 'اصطدام سيارة باخرى رابظة على طرف الطريق' });
    worksheet.addRow({ injuries: injurPanne, iinjuries: (injurPanne * 100 / sumInjur).toFixed(2) + '%', deaths: deadPanne, ddeaths: (deadPanne * 100 / sumDead).toFixed(2) + '%', accidents: accPanne, aaccidents: (accPanne * 100 / sumAcc).toFixed(2) + '%', cause: 'عطب مكانيكي/ عطب كهربائي' });
    worksheet.addRow({ injuries: injurBehind, iinjuries: (injurBehind * 100 / sumInjur).toFixed(2) + '%', deaths: deadBehind, ddeaths: (deadBehind * 100 / sumDead).toFixed(2) + '%', accidents: accBehind, aaccidents: (accBehind * 100 / sumAcc).toFixed(2) + '%', cause: 'مضايقة من الخلف' });
    worksheet.addRow({ injuries: injurMoto, iinjuries: (injurMoto * 100 / sumInjur).toFixed(2) + '%', deaths: deadMoto, ddeaths: (deadMoto * 100 / sumDead).toFixed(2) + '%', accidents: accMoto, aaccidents: (accMoto * 100 / sumAcc).toFixed(2) + '%', cause: 'اصطدام السيارة بالدراجة النارية' });
    worksheet.addRow({ injuries: injurLeft, iinjuries: (injurLeft * 100 / sumInjur).toFixed(2) + '%', deaths: deadLeft, ddeaths: (deadLeft * 100 / sumDead).toFixed(2) + '%', accidents: accLeft, aaccidents: (accLeft * 100 / sumAcc).toFixed(2) + '%', cause: 'وجود عجلة او بقايا عجلة على الطريق' });
    worksheet.addRow({ injuries: injurHerb, iinjuries: (injurHerb * 100 / sumInjur).toFixed(2) + '%', deaths: deadHerb, ddeaths: (deadHerb * 100 / sumDead).toFixed(2) + '%', accidents: accHerb, aaccidents: (accHerb * 100 / sumAcc).toFixed(2) + '%', cause: 'سقوط قرط على الطريق' });
    worksheet.addRow({ injuries: injurAcc, iinjuries: (injurAcc * 100 / sumInjur).toFixed(2) + '%', deaths: deadAcc, ddeaths: (deadAcc * 100 / sumDead).toFixed(2) + '%', accidents: accAcc, aaccidents: (accAcc * 100 / sumAcc).toFixed(2) + '%', cause: 'اصطدام سيارتان او اكثر' });
    worksheet.addRow({ injuries: injurControl, iinjuries: (injurControl * 100 / sumInjur).toFixed(2) + '%', deaths: deadControl, ddeaths: (deadControl * 100 / sumDead).toFixed(2) + '%', accidents: accControl, aaccidents: (accControl * 100 / sumAcc).toFixed(2) + '%', cause: 'عدم التحكم في السيارة' });
    worksheet.addRow({ injuries: injurTired, iinjuries: (injurTired * 100 / sumInjur).toFixed(2) + '%', deaths: deadTired, ddeaths: (deadTired * 100 / sumDead).toFixed(2) + '%', accidents: accTired, aaccidents: (accTired * 100 / sumAcc).toFixed(2) + '%', cause: 'السياقة تحت تأثير التعب و الإرهاق' });
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

    worksheet.addImage(accImageId, 'A28:J62');
    worksheet.addImage(injurImageId, 'A64:J91');

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Traffic_Statistique_ParCause.xlsx');
    });
  };





  return (
    <div className='left-right-gap'>
        <StyledTable>
          <h1 className='title-layout'>احصائيات حوادث المرور حسب الأسباب</h1>
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
          {(!startDate || !endDate) ? (<div className='centerbtn'><Button variant="primary" onClick={resetFilters}>
                      إعادة تعيين المرشحات
                      </Button><Button variant="primary" disabled>تصدير إلى Excel</Button></div>) : (<div className='centerbtn'>
                        <Button variant="primary" onClick={resetFilters}>
                      إعادة تعيين المرشحات
                      </Button><Button variant="primary" onClick={exportToExcel}>تصدير إلى Excel</Button>
                    </div>)}
          <div>
            <Table striped bordered hover >
              <thead >
                <tr>
                  <th>%</th>
                  <th>جرحى </th>
                  <th>%</th>
                  <th>موتى</th>
                  <th>%</th>
                  <th>حوادث</th>
                  <th> الأسباب</th>
                </tr>
              </thead>
              {filterData(data).length === 0  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="7"><h5>الرجاء تعمير الجدول و اختيار التاريخ</h5></td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7"><h5>الرجاء اختيار التاريخ</h5></td></tr></tbody>) : startDate && endDate != null && filteredData(data,startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7"><h5>لا توجد بيانات في هذا التاريخ</h5></td></tr></tbody>) : (<tbody >
                <tr>
                  <td>%{(injurVitesse * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurVitesse}</td>
                  <td>%{(deadVitesse * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadVitesse}</td>
                  <td>%{(accVitesse * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accVitesse}</td>
                  <td>سرعة فائقة</td>
                </tr>
                <tr>
                  <td>%{(injurEclat * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurEclat}</td>
                  <td>%{(deadEclat * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadEclat}</td>
                  <td>%{(accEclat * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accEclat}</td>
                  <td>انشطار اطار العجلة</td>
                </tr>
                <tr>
                  <td>%{(injurSleep * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurSleep}</td>
                  <td>%{(deadSleep * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadSleep}</td>
                  <td>%{(accSleep * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accSleep}</td>
                  <td>نعاس</td>
                </tr>
                <tr>
                  <td>%{(injurDouble * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurDouble}</td>
                  <td>%{(deadDouble * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadDouble}</td>
                  <td>%{(accDouble * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accDouble}</td>
                  <td>مجاوزة فجئية</td>
                </tr>
                <tr>
                  <td>%{(injurDrunk * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurDrunk}</td>
                  <td>%{(deadDrunk * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadDrunk}</td>
                  <td>%{(accDrunk * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accDrunk}</td>
                  <td>سياقة في حالة سكر</td>
                </tr>
                <tr>
                  <td>%{(injurWet * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurWet}</td>
                  <td>%{(deadWet * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadWet}</td>
                  <td>%{(accWet * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accWet}</td>
                  <td>طريق مبلل</td>
                </tr>
                <tr>
                  <td>%{(injurAtt * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurAtt}</td>
                  <td>%{(deadAtt * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadAtt}</td>
                  <td>%{(accAtt * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accAtt}</td>
                  <td>عدم انتباه</td>
                </tr>
                <tr>
                  <td>%{(injurHole * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurHole}</td>
                  <td>%{(deadHole * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadHole}</td>
                  <td>%{(accHole * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accHole}</td>
                  <td>وجود حفرة وسط الطريق</td>
                </tr>
                <tr>
                  <td>%{(injurTruck * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurTruck}</td>
                  <td>%{(deadTruck * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadTruck}</td>
                  <td>%{(accTruck * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accTruck}</td>
                  <td>انقلاب الشاحنة</td>
                </tr>
                <tr>
                  <td>%{(injurAnimal * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurAnimal}</td>
                  <td>%{(deadAnimal * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadAnimal}</td>
                  <td>%{(accAnimal * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accAnimal}</td>
                  <td>حيوان على الطريق السيارة</td>
                </tr>
                <tr>
                  <td>%{(injurMan * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurMan}</td>
                  <td>%{(deadMan * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadMan}</td>
                  <td>%{(accMan * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accMan}</td>
                  <td>مترجل على الطريق السيارة</td>
                </tr>
                <tr>
                  <td>%{(injurTurn * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurTurn}</td>
                  <td>%{(deadTurn * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadTurn}</td>
                  <td>%{(accTurn * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accTurn}</td>
                  <td>الدوران في الإتجاه المعاكس</td>
                </tr>
                <tr>
                  <td>%{(injurOut * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurOut}</td>
                  <td>%{(deadOut * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadOut}</td>
                  <td>%{(accOut * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accOut}</td>
                  <td>الخروج من فتحة عشوائية</td>
                </tr>
                <tr>
                  <td>%{(injurCar * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurCar}</td>
                  <td>%{(deadCar * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadCar}</td>
                  <td>%{(accCar * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accCar}</td>
                  <td>اصطدام سيارة باخرى رابظة على طرف الطريق</td>
                </tr>
                <tr>
                  <td>%{(injurPanne * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurPanne}</td>
                  <td>%{(deadPanne * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadPanne}</td>
                  <td>%{(accPanne * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accPanne}</td>
                  <td>عطب مكانيكي/ عطب كهربائي</td>
                </tr>
                <tr>
                  <td>%{(injurBehind * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurBehind}</td>
                  <td>%{(deadBehind * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadBehind}</td>
                  <td>%{(accBehind * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accBehind}</td>
                  <td>مضايقة من الخلف</td>
                </tr>
                <tr>
                  <td>%{(injurMoto * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurMoto}</td>
                  <td>%{(deadMoto * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadMoto}</td>
                  <td>%{(accMoto * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accMoto}</td>
                  <td>اصطدام السيارة بالدراجة النارية</td>
                </tr>
                <tr>
                  <td>%{(injurLeft * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurLeft}</td>
                  <td>%{(deadLeft * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadLeft}</td>
                  <td>%{(accLeft * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accLeft}</td>
                  <td>وجود عجلة او بقايا عجلة على الطريق</td>
                </tr>
                <tr>
                  <td>%{(injurHerb * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurHerb}</td>
                  <td>%{(deadHerb * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadHerb}</td>
                  <td>%{(accHerb * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accHerb}</td>
                  <td>سقوط قرط على الطريق</td>
                </tr>
                <tr>
                  <td>%{(injurAcc * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurAcc}</td>
                  <td>%{(deadAcc * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadAcc}</td>
                  <td>%{(accAcc * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accAcc}</td>
                  <td>اصطدام سيارتان او اكثر</td>
                </tr>
                <tr>
                  <td>%{(injurControl * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurControl}</td>
                  <td>%{(deadControl * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadControl}</td>
                  <td>%{(accControl * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accControl}</td>
                  <td>عدم التحكم في السيارة</td>
                </tr>
                <tr>
                  <td>%{(injurTired * 100 / sumInjur).toFixed(2)}</td>
                  <td>{injurTired}</td>
                  <td>%{(deadTired * 100 / sumDead).toFixed(2)}</td>
                  <td>{deadTired}</td>
                  <td>%{(accTired * 100 / sumAcc).toFixed(2)}</td>
                  <td>{accTired}</td>
                  <td>السياقة تحت تأثير التعب و الإرهاق</td>
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
            <div> {(!startDate || !endDate) ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(data, startDate, endDate).length === 0 ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>لا توجد بيانات في هذا التاريخ</h3>) : (
              <div>
                <div ref={chartAccRef}>
                  <Bar
                    data={{
                      labels: ['سرعة فائقة', 'انشطار اطار العجلة', 'نعاس', 'مجاوزة فجئية', 'سياقة في حالة سكر', 'طريق مبلل', 'عدم انتباه', 'وجود حفرة وسط الطريق', 'انقلاب الشاحنة', 'حيوان على الطريق السيارة', 'مترجل على الطريق السيارة', 'الدوران في الإتجاه المعاكس', 'الخروج من فتحة عشوائية', 'اصطدام سيارة باخرى رابظة على طرف الطريق', 'عطب مكانيكي/ عطب كهربائي', 'مضايقة من الخلف', 'اصطدام السيارة بالدراجة النارية', 'وجود عجلة او بقايا عجلة على الطريق', 'سقوط قرط على الطريق', 'اصطدام سيارتان او اكثر', 'عدم التحكم في السيارة', 'السياقة تحت تأثير التعب و الإرهاق'],
                      datasets: [

                        {
                          label: ['حوادث'],
                          data: [accVitesse, accEclat, accSleep, accDouble, accDrunk, accWet, accAtt, accHole, accTruck, accAnimal, accMan, accTurn, accOut, accCar, accPanne, accBehind, accMoto, accLeft, accHerb, accAcc, accControl, accTired],
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
                        title: { display: true, text: 'عدد الحواث حسب الاسباب', font: { size: 60 } },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Nombre des accidents",
                          },
                          ticks: {
                            stepSize: 1,
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "Causes",
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
                      labels: ['سرعة فائقة', 'انشطار اطار العجلة', 'نعاس', 'مجاوزة فجئية', 'سياقة في حالة سكر', 'طريق مبلل', 'عدم انتباه', 'وجود حفرة وسط الطريق', 'انقلاب الشاحنة', 'حيوان على الطريق السيارة', 'مترجل على الطريق السيارة', 'الدوران في الإتجاه المعاكس', 'الخروج من فتحة عشوائية', 'اصطدام سيارة باخرى رابظة على طرف الطريق', 'عطب مكانيكي/ عطب كهربائي', 'مضايقة من الخلف', 'اصطدام السيارة بالدراجة النارية', 'وجود عجلة او بقايا عجلة على الطريق', 'سقوط قرط على الطريق', 'اصطدام سيارتان او اكثر', 'عدم التحكم في السيارة', 'السياقة تحت تأثير التعب و الإرهاق'],
                      datasets: [
                        {
                          label: ['جرحى'],
                          data: [injurVitesse, injurEclat, injurSleep, injurDouble, injurDrunk, injurWet, injurAtt, injurHole, injurTruck, injurAnimal, injurMan, injurTurn, injurOut, injurCar, injurPanne, injurBehind, injurMoto, injurLeft, injurHerb, injurAcc, injurControl, injurTired],
                          backgroundColor: 'blue',
                          borderColor: 'grey',
                          borderWidth: 1,
                        },
                        {
                          label: ['موتى'],
                          data: [deadVitesse, deadEclat, deadSleep, deadDouble, deadDrunk, deadWet, deadAtt, deadHole, deadTruck, deadAnimal, deadMan, deadTurn, deadOut, deadCar, deadPanne, deadBehind, deadMoto, deadLeft, deadHerb, deadAcc, deadControl, deadTired],
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
                        title: { display: true, text: 'عدد الموتى و الجرحى حسب الاسباب', font: { size: 60 } },
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
                            text: "Causes",
                          },
                        },
                      },
                    }}
                    height={400}
                  />
                </div>
              </div>
            )}</div>
          </div></StyledTable>
    </div>

  );
};
export default HomeSemaine;