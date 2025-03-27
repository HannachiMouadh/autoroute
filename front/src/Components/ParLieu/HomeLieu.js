import React, { useEffect, useRef, useState } from 'react'
import { fetchForms } from '../../JS/formSlice/FormSlice';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import './HomeLieu.css';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
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


const HomeHoraire = ({userLieu}) => {
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const chartAccRef = useRef(null);
    const chartInjurRef = useRef(null);
    const chartInjurReff = useRef(null);
    const data = useSelector((state) => state.data.data);
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


 console.log("lieu :",userLieu);
 


   const filterData = (data) => {
        if (!data || !userRedux) {
          return [];
        }
      
        // Get valid user IDs from the current userRedux state
        const validUserIds = new Set(userRedux.map((user) => user._id));
      
        // Filter data based on valid user IDs and target region
        const usersFromTargetRegion = userRedux
          .filter((user) => (user.region || "") === userLieu)
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

  const regionDirections =(userLieu) => {
    switch (userLieu) {
        case "sfax":
          return ["اتجاه تونس", "اتجاه صخيرة"];
        case "gabes":
          return ["اتجاه قابس", "اتجاه صفاقس"];
        default:
          return "";
    }
};

const regionNK =(userLieu) => {
    switch (userLieu) {
        case "sfax":
          return [387, 397, 407, 417, 427, 437, 447,457,467];
        case "gabes":
          return [317, 327, 337, 347, 357, 367, 377,387,397];
        default:
          return "";
    }
};

const directions = regionNK(userLieu);
const sense = regionDirections(userLieu);
if (Array.isArray(directions) && Array.isArray(sense)) {
    var injurTwenty = filteredDataArray
        .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurThirty = filteredDataArray
        .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurForty = filteredDataArray
        .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurFifty = filteredDataArray
        .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurSixty = filteredDataArray
        .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurSeventy = filteredDataArray
        .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurEighty = filteredDataArray
        .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurNinety = filteredDataArray
        .filter((form) => form.nk >= directions[7] && form.nk <= directions[8] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrblesse, 0);


    var deadTwenty = filteredDataArray
        .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadThirty = filteredDataArray
        .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadForty = filteredDataArray
        .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadFifty = filteredDataArray
        .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadSixty = filteredDataArray
        .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadSeventy = filteredDataArray
        .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadEighty = filteredDataArray
        .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadNinety = filteredDataArray
        .filter((form) => form.nk >= directions[7] && form.nk <= directions[8] && form.sens === sense[0])
        .reduce((acc, form) => acc + form.nbrmort, 0);



    var accTwenty = filteredDataArray
        .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === sense[0])
        .reduce((acc, form) => acc + 1, 0);
    var accThirty = filteredDataArray
        .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === sense[0])
        .reduce((acc, form) => acc + 1, 0);
    var accForty = filteredDataArray
        .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === sense[0])
        .reduce((acc, form) => acc + 1, 0);
    var accFifty = filteredDataArray
        .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === sense[0])
        .reduce((acc, form) => acc + 1, 0);
    var accSixty = filteredDataArray
        .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === sense[0])
        .reduce((acc, form) => acc + 1, 0);
    var accSeventy = filteredDataArray
        .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === sense[0])
        .reduce((acc, form) => acc + 1, 0);
    var accEighty = filteredDataArray
        .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === sense[0])
        .reduce((acc, form) => acc + 1, 0);
    var accNinety = filteredDataArray
        .filter((form) => form.nk >= directions[7] && form.nk <=directions[8] && form.sens === sense[0])
        .reduce((acc, form) => acc + 1, 0);



    var injurTwentyy = filteredDataArray
        .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurThirtyy = filteredDataArray
        .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurFortyy = filteredDataArray
        .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurFiftyy = filteredDataArray
        .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurSixtyy = filteredDataArray
        .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurSeventyy = filteredDataArray
        .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurEightyy = filteredDataArray
        .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    var injurNinetyy = filteredDataArray
        .filter((form) => form.nk >= directions[7] && form.nk <= directions[8] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrblesse, 0);


    var deadTwentyy = filteredDataArray
        .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadThirtyy = filteredDataArray
        .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadFortyy = filteredDataArray
        .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadFiftyy = filteredDataArray
        .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadSixtyy = filteredDataArray
        .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadSeventyy = filteredDataArray
        .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadEightyy = filteredDataArray
        .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrmort, 0);
    var deadNinetyy = filteredDataArray
        .filter((form) => form.nk >= directions[7] && form.nk <= directions[8] && form.sens === sense[1])
        .reduce((acc, form) => acc + form.nbrmort, 0);



    var accTwentyy = filteredDataArray
        .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === sense[1])
        .reduce((acc, form) => acc + 1, 0);
    var accThirtyy = filteredDataArray
        .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === sense[1])
        .reduce((acc, form) => acc + 1, 0);
    var accFortyy = filteredDataArray
        .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === sense[1])
        .reduce((acc, form) => acc + 1, 0);
    var accFiftyy = filteredDataArray
        .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === sense[1])
        .reduce((acc, form) => acc + 1, 0);
    var accSixtyy = filteredDataArray
        .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === sense[1])
        .reduce((acc, form) => acc + 1, 0);
    var accSeventyy = filteredDataArray
        .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === sense[1])
        .reduce((acc, form) => acc + 1, 0);
    var accEightyy = filteredDataArray
        .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === sense[1])
        .reduce((acc, form) => acc + 1, 0);
    var accNinetyy = filteredDataArray
        .filter((form) => form.nk >= directions[7] && form.nk <= directions[8] && form.sens === sense[1])
        .reduce((acc, form) => acc + 1, 0);
} else {
    console.log("Directions non disponibles");
}
    


console.log(accFortyy);

    const sumInjur = injurTwenty + injurThirty + injurForty + injurFifty + injurSixty + injurSeventy + injurEighty + injurNinety + injurTwentyy + injurThirtyy + injurFortyy + injurFiftyy + injurSixtyy + injurSeventyy + injurEightyy + injurNinetyy;
    const sumAcc = accTwenty + accThirty + accForty + accFifty + accSixty + accSeventy + accEighty + accNinety + accTwentyy + accThirtyy + accFortyy + accFiftyy + accSixtyy + accSeventyy + accEightyy + accNinetyy;
    const sumDead = deadTwenty + deadThirty + deadForty + deadFifty + deadSixty + deadSeventy + deadEighty + deadNinety + deadTwentyy + deadThirtyy + deadFortyy + deadFiftyy + deadSixtyy + deadSeventyy + deadEightyy + deadNinetyy;

    const resetFilters = () => {
        setStartDate(null);
        setEndDate(null);
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Statistics');

        const headerColumn1 = worksheet.addRow([]);
        headerColumn1.getCell(1).value = 'اتجاه قابس';
        worksheet.mergeCells('H2:H9');
        const headerColumn2 = worksheet.addRow([]);
        headerColumn2.getCell(1).value = 'اتجاه صفاقس';
        worksheet.mergeCells('H10:H17');

        worksheet.columns = [
            { header: '%جرحى', key: 'iinjuries', width: 20 },
            { header: 'جرحى', key: 'injuries', width: 20 },
            { header: '%موتى', key: 'ddeaths', width: 20 },
            { header: 'موتى', key: 'deaths', width: 20 },
            { header: '%حوادث', key: 'aaccidents', width: 20 },
            { header: 'عدد حوادث', key: 'accidents', width: 20 },
            { header: 'المكان', key: 'cause', width: 20 },
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
        headerCell.value = `Rapport Statistique Par Lieu: ${formatStartDate} - ${formatEndDate}`;
        headerCell.font = { bold: true };
        headerCell.alignment = { horizontal: 'center', vertical: 'middle' };


        worksheet.addRow({ injuries: injurTwenty, iinjuries: (injurTwenty * 100 / sumInjur).toFixed(2) + '%', deaths: deadTwenty, ddeaths: (deadTwenty * 100 / sumDead).toFixed(2) + '%', accidents: accTwenty, aaccidents: (accTwenty * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 317  الى  ن.ك 327' });
        worksheet.addRow({ injuries: injurThirty, iinjuries: (injurThirty * 100 / sumInjur).toFixed(2) + '%', deaths: deadThirty, ddeaths: (deadThirty * 100 / sumDead).toFixed(2) + '%', accidents: accThirty, aaccidents: (accThirty * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 327  الى  ن.ك 337' });
        worksheet.addRow({ injuries: injurForty, iinjuries: (injurForty * 100 / sumInjur).toFixed(2) + '%', deaths: deadForty, ddeaths: (deadForty * 100 / sumDead).toFixed(2) + '%', accidents: accForty, aaccidents: (accForty * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 337  الى  ن.ك 347' });
        worksheet.addRow({ injuries: injurFifty, iinjuries: (injurFifty * 100 / sumInjur).toFixed(2) + '%', deaths: deadFifty, ddeaths: (deadFifty * 100 / sumDead).toFixed(2) + '%', accidents: accFifty, aaccidents: (accFifty * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 347  الى  ن.ك 357' });
        worksheet.addRow({ injuries: injurSixty, iinjuries: (injurSixty * 100 / sumInjur).toFixed(2) + '%', deaths: deadSixty, ddeaths: (deadSixty * 100 / sumDead).toFixed(2) + '%', accidents: accSixty, aaccidents: (accSixty * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 357  الى  ن.ك 367' });
        worksheet.addRow({ injuries: injurSeventy, iinjuries: (injurSeventy * 100 / sumInjur).toFixed(2) + '%', deaths: deadSeventy, ddeaths: (deadSeventy * 100 / sumDead).toFixed(2) + '%', accidents: accSeventy, aaccidents: (accSeventy * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 367  الى  ن.ك 377' });
        worksheet.addRow({ injuries: injurEighty, iinjuries: (injurEighty * 100 / sumInjur).toFixed(2) + '%', deaths: deadEighty, ddeaths: (deadEighty * 100 / sumDead).toFixed(2) + '%', accidents: accEighty, aaccidents: (accEighty * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 377  الى  ن.ك 387' });
        worksheet.addRow({ injuries: injurNinety, iinjuries: (injurNinety * 100 / sumInjur).toFixed(2) + '%', deaths: deadNinety, ddeaths: (deadNinety * 100 / sumDead).toFixed(2) + '%', accidents: accNinety, aaccidents: (accNinety * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 387  الى  ن.ك 391' });
        worksheet.addRow({ injuries: injurTwentyy, iinjuries: (injurTwentyy * 100 / sumInjur).toFixed(2) + '%', deaths: deadTwentyy, ddeaths: (deadTwentyy * 100 / sumDead).toFixed(2) + '%', accidents: accTwentyy, aaccidents: (accTwentyy * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 317  الى  ن.ك 327' });
        worksheet.addRow({ injuries: injurThirtyy, iinjuries: (injurThirtyy * 100 / sumInjur).toFixed(2) + '%', deaths: deadThirtyy, ddeaths: (deadThirtyy * 100 / sumDead).toFixed(2) + '%', accidents: accThirtyy, aaccidents: (accThirtyy * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 327  الى  ن.ك 337' });
        worksheet.addRow({ injuries: injurFortyy, iinjuries: (injurFortyy * 100 / sumInjur).toFixed(2) + '%', deaths: deadFortyy, ddeaths: (deadFortyy * 100 / sumDead).toFixed(2) + '%', accidents: accFortyy, aaccidents: (accFortyy * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 337  الى  ن.ك 347' });
        worksheet.addRow({ injuries: injurFiftyy, iinjuries: (injurFiftyy * 100 / sumInjur).toFixed(2) + '%', deaths: deadFiftyy, ddeaths: (deadFiftyy * 100 / sumDead).toFixed(2) + '%', accidents: accFiftyy, aaccidents: (accFiftyy * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 347  الى  ن.ك 357' });
        worksheet.addRow({ injuries: injurSixtyy, iinjuries: (injurSixtyy * 100 / sumInjur).toFixed(2) + '%', deaths: deadSixtyy, ddeaths: (deadSixtyy * 100 / sumDead).toFixed(2) + '%', accidents: accSixtyy, aaccidents: (accSixtyy * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 357  الى  ن.ك 367' });
        worksheet.addRow({ injuries: injurSeventyy, iinjuries: (injurSeventyy * 100 / sumInjur).toFixed(2) + '%', deaths: deadSeventyy, ddeaths: (deadSeventyy * 100 / sumDead).toFixed(2) + '%', accidents: accSeventyy, aaccidents: (accSeventyy * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 367  الى  ن.ك 377' });
        worksheet.addRow({ injuries: injurEightyy, iinjuries: (injurEightyy * 100 / sumInjur).toFixed(2) + '%', deaths: deadEightyy, ddeaths: (deadEightyy * 100 / sumDead).toFixed(2) + '%', accidents: accEightyy, aaccidents: (accEightyy * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 377  الى  ن.ك 387' });
        worksheet.addRow({ injuries: injurNinetyy, iinjuries: (injurNinetyy * 100 / sumInjur).toFixed(2) + '%', deaths: deadNinetyy, ddeaths: (deadNinetyy * 100 / sumDead).toFixed(2) + '%', accidents: accNinetyy, aaccidents: (accNinetyy * 100 / sumAcc).toFixed(2) + '%', cause: 'من  ن.ك 387  الى  ن.ك 391' });
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
        const chartInjurrCanvas = await html2canvas(chartInjurReff.current);
        const chartInjurrImage = chartInjurrCanvas.toDataURL('image/png');

        const accImageId = workbook.addImage({
            base64: chartAccImage,
            extension: 'png',
        });
        const injurImageId = workbook.addImage({
            base64: chartInjurImage,
            extension: 'png',
        });
        const injurrImageId = workbook.addImage({
            base64: chartInjurrImage,
            extension: 'png',
        });

        worksheet.addImage(accImageId, 'A27:J63');
        worksheet.addImage(injurImageId, 'A64:J100');
        worksheet.addImage(injurrImageId, 'A101:J137');

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'Traffic_Statistique_ParHoraire.xlsx');
        });
    };




    return (
        <div className='left-right-gap'>
                <StyledTable>
                    <h1 className='title-layout'>احصائيات حوادث المرور حسب ساعات اليوم</h1>
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
                        <Table className="margin" striped bordered hover >
                            <thead >
                                <tr>
                                    <th>%</th>
                                    <th>جرحى </th>
                                    <th>%</th>
                                    <th>موتى</th>
                                    <th>%</th>
                                    <th>حوادث</th>
                                    <th>المكان</th>                                   
                                </tr>
                            </thead>
                            {filterData(data).length === 0  && (!startDate || !endDate) && Array.isArray(regionDirections(userLieu)) ? (<tbody><tr><td colSpan="7"><h5>الرجاء تعمير الجدول و اختيار التاريخ</h5></td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7"><h5>الرجاء اختيار التاريخ</h5></td></tr></tbody>) : startDate && endDate != null && filteredData(data,startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7"><h5>لا توجد بيانات في هذا التاريخ</h5></td></tr></tbody>) : (<tbody >
                                <tr>
                                <td>%{(injurTwenty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurTwenty}</td>
                                <td>%{(deadTwenty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadTwenty}</td>
                                <td>%{(accTwenty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accTwenty}</td>
                                <td>من  ن.ك {regionNK(userLieu)[0]}  الى  ن.ك {regionNK(userLieu)[1]}</td>
                                <td rowSpan="8">{regionDirections(userLieu)[0]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurThirty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurThirty}</td>
                                <td>%{(deadThirty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadThirty}</td>
                                <td>%{(accThirty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accThirty}</td>
                                <td>من  ن.ك {regionNK(userLieu)[1]}  الى  ن.ك {regionNK(userLieu)[2]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurForty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurForty}</td>
                                <td>%{(deadForty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadForty}</td>
                                <td>%{(accForty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accForty}</td>
                                <td>من  ن.ك {regionNK(userLieu)[2]}  الى  ن.ك {regionNK(userLieu)[3]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurFifty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurFifty}</td>
                                <td>%{(deadFifty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadFifty}</td>
                                <td>%{(accFifty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accFifty}</td>
                                <td>من  ن.ك {regionNK(userLieu)[3]}  الى  ن.ك {regionNK(userLieu)[4]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurSixty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurSixty}</td>
                                <td>%{(deadSixty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadSixty}</td>
                                <td>%{(accSixty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accSixty}</td>
                                <td>من  ن.ك {regionNK(userLieu)[4]}  الى  ن.ك {regionNK(userLieu)[5]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurSeventy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurSeventy}</td>
                                <td>%{(deadSeventy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadSeventy}</td>
                                <td>%{(accSeventy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accSeventy}</td>
                                <td>من  ن.ك {regionNK(userLieu)[5]}  الى  ن.ك {regionNK(userLieu)[6]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurEighty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurEighty}</td>
                                <td>%{(deadEighty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadEighty}</td>
                                <td>%{(accEighty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accEighty}</td>
                                <td>من  ن.ك {regionNK(userLieu)[6]}  الى  ن.ك {regionNK(userLieu)[7]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurNinety * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurNinety}</td>
                                <td>%{(deadNinety * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadNinety}</td>
                                <td>%{(accNinety * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accNinety}</td>
                                <td>من  ن.ك {regionNK(userLieu)[7]}  الى  ن.ك {regionNK(userLieu)[8]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurTwentyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurTwentyy}</td>
                                <td>%{(deadTwentyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadTwentyy}</td>
                                <td>%{(accTwentyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accTwentyy}</td>
                                <td>من  ن.ك {regionNK(userLieu)[0]}  الى  ن.ك {regionNK(userLieu)[1]}</td>
                                <td rowSpan="8">{regionDirections(userLieu)[1]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurThirtyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurThirtyy}</td>
                                <td>%{(deadThirtyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadThirtyy}</td>
                                <td>%{(accThirtyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accThirtyy}</td>
                                <td>من  ن.ك {regionNK(userLieu)[1]}  الى  ن.ك {regionNK(userLieu)[2]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurFortyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurFortyy}</td>
                                <td>%{(deadFortyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadFortyy}</td>
                                <td>%{(accFortyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accFortyy}</td>
                                <td>من  ن.ك {regionNK(userLieu)[2]}  الى  ن.ك {regionNK(userLieu)[3]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurFiftyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurFiftyy}</td>
                                <td>%{(deadFiftyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadFiftyy}</td>
                                <td>%{(accFiftyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accFiftyy}</td>
                                <td>من  ن.ك {regionNK(userLieu)[3]}  الى  ن.ك {regionNK(userLieu)[4]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurSixtyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurSixtyy}</td>
                                <td>%{(deadSixtyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadSixtyy}</td>
                                <td>%{(accSixtyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accSixtyy}</td>
                                <td>من  ن.ك {regionNK(userLieu)[4]}  الى  ن.ك {regionNK(userLieu)[5]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurSeventyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurSeventyy}</td>
                                <td>%{(deadSeventyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadSeventyy}</td>
                                <td>%{(accSeventyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accSeventyy}</td>
                                <td>من  ن.ك {regionNK(userLieu)[5]}  الى  ن.ك {regionNK(userLieu)[6]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurEightyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurEightyy}</td>
                                <td>%{(deadEightyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadEightyy}</td>
                                <td>%{(accEightyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accEightyy}</td>
                                <td>من  ن.ك {regionNK(userLieu)[6]}  الى  ن.ك {regionNK(userLieu)[7]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurNinetyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurNinetyy}</td>
                                <td>%{(deadNinetyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadNinetyy}</td>
                                <td>%{(accNinetyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accNinetyy}</td>
                                <td>من  ن.ك {regionNK(userLieu)[7]}  الى  ن.ك {regionNK(userLieu)[8]}</td>
                            </tr>
                                <tr>
                                    <td></td>
                                    <td>{sumInjur}</td>
                                    <td></td>
                                    <td>{sumDead}</td>
                                    <td></td>
                                    <td>{sumAcc}</td>
                                    <td></td>
                                    <td>الاجمالي</td>
                                </tr>
                            </tbody>)}
                        </Table>
                        <div>{(!startDate || !endDate) ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(data,startDate,endDate).length === 0 ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>لا توجد بيانات في هذا التاريخ</h3>) : (
                                <div>
                                    <div ref={chartAccRef}>
                                        <Bar
                                            data={{
                                                labels: ['من  ن.ك 317  الى  ن.ك 327', 'من  ن.ك 327  الى  ن.ك 337', 'من  ن.ك 337  الى  ن.ك 347', 'من  ن.ك 347  الى  ن.ك 357', 'من  ن.ك 357  الى  ن.ك 367', 'من  ن.ك 367  الى  ن.ك 377', 'من  ن.ك 377  الى  ن.ك 387', 'من  ن.ك 387  الى  ن.ك 391'],
                                                datasets: [
                                                    {
                                                        label: 'قابس',
                                                        data: [injurTwenty, injurThirty, injurForty, injurFifty, injurSixty, injurSeventy, injurEighty, injurNinety],
                                                        backgroundColor: 'blue',
                                                        borderColor: 'grey',
                                                        borderWidth: 1,
                                                    },
                                                    {
                                                        label: 'صفاقس',
                                                        data: [injurTwentyy, injurThirtyy, injurFortyy, injurFiftyy, injurSixtyy, injurSeventyy, injurEightyy, injurNinetyy],
                                                        backgroundColor: 'cyan',
                                                        borderColor: 'grey',
                                                        borderWidth: 1,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: { position: 'top' },
                                                    title: { display: true, text: 'عددالحوادث حسب المكان', font: { size: 60 } },
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
                                                        text: "PK",
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
                                                labels: ['من  ن.ك 317  الى  ن.ك 327', 'من  ن.ك 327  الى  ن.ك 337', 'من  ن.ك 337  الى  ن.ك 347', 'من  ن.ك 347  الى  ن.ك 357', 'من  ن.ك 357  الى  ن.ك 367', 'من  ن.ك 367  الى  ن.ك 377', 'من  ن.ك 377  الى  ن.ك 387', 'من  ن.ك 387  الى  ن.ك 391'],
                                                datasets: [
                                                    {
                                                        label: 'جرحى',
                                                        data: [injurTwenty, injurThirty, injurForty, injurFifty, injurSixty, injurSeventy, injurEighty, injurNinety],
                                                        backgroundColor: 'blue',
                                                        borderColor: 'grey',
                                                        borderWidth: 1,
                                                    },
                                                    {
                                                        label: 'موتى',
                                                        data: [deadTwenty, deadThirty, deadForty, deadFifty, deadSixty, deadSeventy, deadEighty, deadNinety],
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
                                                    title: { display: true, text: `عدد الجرحى و الموتى حسب ${regionDirections(userLieu)[0]}`, font: { size: 60 } },
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
                                                        text:  regionDirections(userLieu)[0],
                                                      },
                                                    },
                                                  },
                                            }}
                                            height={400}
                                        />
                                    </div>
                                    <div ref={chartInjurReff}>
                                        <Bar
                                            data={{
                                                labels: ['من  ن.ك 317  الى  ن.ك 327', 'من  ن.ك 327  الى  ن.ك 337', 'من  ن.ك 337  الى  ن.ك 347', 'من  ن.ك 347  الى  ن.ك 357', 'من  ن.ك 357  الى  ن.ك 367', 'من  ن.ك 367  الى  ن.ك 377', 'من  ن.ك 377  الى  ن.ك 387', 'من  ن.ك 387  الى  ن.ك 391'],
                                                datasets: [
                                                    {
                                                        label: 'جرحى',
                                                        data: [injurTwentyy, injurThirtyy, injurFortyy, injurFiftyy, injurSixtyy, injurSeventyy, injurEightyy, injurNinetyy],
                                                        backgroundColor: 'blue',
                                                        borderColor: 'grey',
                                                        borderWidth: 1,
                                                    },
                                                    {
                                                        label: 'موتى',
                                                        data: [deadTwentyy, deadThirtyy, deadFortyy, deadFiftyy, deadSixtyy, deadSeventyy, deadEightyy, deadNinetyy],
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
                                                    title: { display: true, text: `عدد الجرحى و الموتى حسب ${regionDirections(userLieu)[1]}`, font: { size: 60 } },
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
                                                        text: regionDirections(userLieu)[1],
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
                    </div></StyledTable>
        </div>
    );
};
export default HomeHoraire;