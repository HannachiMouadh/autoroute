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
    const chartInjurReff = useRef(null);
    const data = useSelector((state) => state.data.data);

    useEffect(() => {
        dispatch(fetchForms());
    }, [dispatch]);

    const isMobile = useMediaQuery({ query: '(max-width: 400px)' });

    const formatStartDate = startDate ? moment(startDate).format("yyyy-MM-DD") : null;
    const formatEndDate = endDate ? moment(endDate).format("yyyy-MM-DD") : null;

    const filteredData = (start, end) => {
        return data.filter((form) => {
            const formDate = moment(form.ddate, "yyyy-MM-DD"); // Adjust the format if needed
            return formDate.isSameOrAfter(start) && formDate.isSameOrBefore(end);
        });
    };


    const injurTwenty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 317 && form.nk >= 327 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurThirty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 337 && form.nk >= 327 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurForty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 347 && form.nk >= 337  && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurFifty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 357 && form.nk >= 347 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurSixty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 367 && form.nk >= 357 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurSeventy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 377 && form.nk >= 367 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurEighty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 387 && form.nk >= 377 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurNinety = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 397 && form.nk >= 387 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);


    const deadTwenty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 317 && form.nk >= 327 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadThirty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 337 && form.nk >= 327 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadForty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 347 && form.nk >= 337 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadFifty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 357 && form.nk >= 347 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadSixty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 367 && form.nk >= 357 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadSeventy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 377 && form.nk >= 367 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadEighty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 387 && form.nk >= 377 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadNinety = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 397 && form.nk >= 387 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + form.nbrmort, 0);



    const accTwenty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 317 && form.nk >= 327 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + 1, 0);
    const accThirty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 337 && form.nk >= 327 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + 1, 0);
    const accForty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 347 && form.nk >= 337 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + 1, 0);
    const accFifty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 357 && form.nk >= 347 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + 1, 0);
    const accSixty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 367 && form.nk >= 357 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + 1, 0);
    const accSeventy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 377 && form.nk >= 367 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + 1, 0);
    const accEighty = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 387 && form.nk >= 377 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + 1, 0);
    const accNinety = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 397 && form.nk >= 387 && form.sens === "اتجاه قابس")
        .reduce((acc, form) => acc + 1, 0);



    const injurTwentyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 317 && form.nk >= 327 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurThirtyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 337 && form.nk >= 327 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurFortyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 347 && form.nk >= 337 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurFiftyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 357 && form.nk >= 347 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurSixtyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 367 && form.nk >= 357 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurSeventyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 377 && form.nk >= 367 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurEightyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 387 && form.nk >= 377 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);
    const injurNinetyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 397 && form.nk >= 387 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrblesse, 0);


    const deadTwentyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 317 && form.nk >= 327 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadThirtyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 337 && form.nk >= 327 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadFortyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 347 && form.nk >= 337 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadFiftyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 357 && form.nk >= 347 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadSixtyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 367 && form.nk >= 357 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadSeventyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 377 && form.nk >= 367 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadEightyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 387 && form.nk >= 377 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrmort, 0);
    const deadNinetyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 397 && form.nk >= 387 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + form.nbrmort, 0);



    const accTwentyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 317 && form.nk >= 327 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + 1, 0);
    const accThirtyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 337 && form.nk >= 327 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + 1, 0);
    const accFortyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 347 && form.nk >= 337 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + 1, 0);
    const accFiftyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 357 && form.nk >= 347 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + 1, 0);
    const accSixtyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 367 && form.nk >= 357 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + 1, 0);
    const accSeventyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 377 && form.nk >= 367 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + 1, 0);
    const accEightyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 387 && form.nk >= 377 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + 1, 0);
    const accNinetyy = filteredData(formatStartDate, formatEndDate)
        .filter((form) => form.nk <= 397 && form.nk >= 387 && form.sens === "اتجاه صفاقس")
        .reduce((acc, form) => acc + 1, 0);




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
                                <th>المكان</th>
                                <th></th>
                            </tr>
                        </thead>
                        {data == ""  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="8">الرجاء تعمير الجدول و اختيار التاريخ</td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="8">الرجاء اختيار التاريخ</td></tr></tbody>) : startDate && endDate != null && filteredData(startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="8">لا توجد بيانات في هذا التاريخ</td></tr></tbody>) : (<tbody >
                            <tr>
                                <td>%{(injurTwenty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurTwenty}</td>
                                <td>%{(deadTwenty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadTwenty}</td>
                                <td>%{(accTwenty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accTwenty}</td>
                                <td>من  ن.ك 317  الى  ن.ك 327</td>
                                <td rowSpan="8">اتجاه قابس</td>
                            </tr>
                            <tr>
                                <td>%{(injurThirty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurThirty}</td>
                                <td>%{(deadThirty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadThirty}</td>
                                <td>%{(accThirty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accThirty}</td>
                                <td>من  ن.ك 327  الى  ن.ك 337</td>
                            </tr>
                            <tr>
                                <td>%{(injurForty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurForty}</td>
                                <td>%{(deadForty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadForty}</td>
                                <td>%{(accForty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accForty}</td>
                                <td>من  ن.ك 337  الى  ن.ك 347</td>
                            </tr>
                            <tr>
                                <td>%{(injurFifty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurFifty}</td>
                                <td>%{(deadFifty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadFifty}</td>
                                <td>%{(accFifty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accFifty}</td>
                                <td>من  ن.ك 347  الى  ن.ك 357</td>
                            </tr>
                            <tr>
                                <td>%{(injurSixty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurSixty}</td>
                                <td>%{(deadSixty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadSixty}</td>
                                <td>%{(accSixty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accSixty}</td>
                                <td>من  ن.ك 357  الى  ن.ك 367</td>
                            </tr>
                            <tr>
                                <td>%{(injurSeventy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurSeventy}</td>
                                <td>%{(deadSeventy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadSeventy}</td>
                                <td>%{(accSeventy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accSeventy}</td>
                                <td>من  ن.ك 367  الى  ن.ك 377</td>
                            </tr>
                            <tr>
                                <td>%{(injurEighty * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurEighty}</td>
                                <td>%{(deadEighty * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadEighty}</td>
                                <td>%{(accEighty * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accEighty}</td>
                                <td>من  ن.ك 377  الى  ن.ك 387</td>
                            </tr>
                            <tr>
                                <td>%{(injurNinety * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurNinety}</td>
                                <td>%{(deadNinety * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadNinety}</td>
                                <td>%{(accNinety * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accNinety}</td>
                                <td>من  ن.ك 387  الى  ن.ك 391</td>
                            </tr>
                            <tr>
                                <td>%{(injurTwentyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurTwentyy}</td>
                                <td>%{(deadTwentyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadTwentyy}</td>
                                <td>%{(accTwentyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accTwentyy}</td>
                                <td>من  ن.ك 317  الى  ن.ك 327</td>
                                <td rowSpan="8">اتجاه صفاقس</td>
                            </tr>
                            <tr>
                                <td>%{(injurThirtyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurThirtyy}</td>
                                <td>%{(deadThirtyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadThirtyy}</td>
                                <td>%{(accThirtyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accThirtyy}</td>
                                <td>من  ن.ك 327  الى  ن.ك 337</td>
                            </tr>
                            <tr>
                                <td>%{(injurFortyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurFortyy}</td>
                                <td>%{(deadFortyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadFortyy}</td>
                                <td>%{(accFortyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accFortyy}</td>
                                <td>من  ن.ك 337  الى  ن.ك 347</td>
                            </tr>
                            <tr>
                                <td>%{(injurFiftyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurFiftyy}</td>
                                <td>%{(deadFiftyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadFiftyy}</td>
                                <td>%{(accFiftyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accFiftyy}</td>
                                <td>من  ن.ك 347  الى  ن.ك 357</td>
                            </tr>
                            <tr>
                                <td>%{(injurSixtyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurSixtyy}</td>
                                <td>%{(deadSixtyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadSixtyy}</td>
                                <td>%{(accSixtyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accSixtyy}</td>
                                <td>من  ن.ك 357  الى  ن.ك 367</td>
                            </tr>
                            <tr>
                                <td>%{(injurSeventyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurSeventyy}</td>
                                <td>%{(deadSeventyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadSeventyy}</td>
                                <td>%{(accSeventyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accSeventyy}</td>
                                <td>من  ن.ك 367  الى  ن.ك 377</td>
                            </tr>
                            <tr>
                                <td>%{(injurEightyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurEightyy}</td>
                                <td>%{(deadEightyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadEightyy}</td>
                                <td>%{(accEightyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accEightyy}</td>
                                <td>من  ن.ك 377  الى  ن.ك 387</td>
                            </tr>
                            <tr>
                                <td>%{(injurNinetyy * 100 / sumInjur).toFixed(2)}</td>
                                <td>{injurNinetyy}</td>
                                <td>%{(deadNinetyy * 100 / sumDead).toFixed(2)}</td>
                                <td>{deadNinetyy}</td>
                                <td>%{(accNinetyy * 100 / sumAcc).toFixed(2)}</td>
                                <td>{accNinetyy}</td>
                                <td>من  ن.ك 387  الى  ن.ك 391</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{sumInjur}</td>
                                <td></td>
                                <td>{sumDead}</td>
                                <td></td>
                                <td>{sumAcc}</td>
                                <td colSpan="2">الاجمالي</td>
                            </tr>
                        </tbody>)}
                    </Table>
                    <div>
                   {(!startDate || !endDate) ? (<h3>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(startDate,endDate).length === 0 ? (<h3>لا توجد بيانات في هذا التاريخ</h3>) : (
                            <div>
                                <div ref={chartAccRef}>
                                    <Bar
                                        data={{
                                            labels: ['من  ن.ك 317  الى  ن.ك 327', 'من  ن.ك 327  الى  ن.ك 337', 'من  ن.ك 337  الى  ن.ك 347', 'من  ن.ك 347  الى  ن.ك 357', 'من  ن.ك 357  الى  ن.ك 367', 'من  ن.ك 367  الى  ن.ك 377', 'من  ن.ك 377  الى  ن.ك 387', 'من  ن.ك 387  الى  ن.ك 391'],
                                            datasets: [
                                                {
                                                    label: 'قابس',
                                                    data: [injurTwenty, injurThirty, injurForty, injurFifty, injurSixty, injurSeventy, injurEighty, injurNinety],
                                                    backgroundColor: 'dark grey',
                                                    borderColor: 'grey',
                                                    borderWidth: 1,
                                                },
                                                {
                                                    label: 'صفاقس',
                                                    data: [injurTwentyy, injurThirtyy, injurFortyy, injurFiftyy, injurSixtyy, injurSeventyy, injurEightyy, injurNinetyy],
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
                                                title: { display: true, text: 'عددالحوادث حسب المكان', font: { size: 60 } },
                                            },
                                        }}
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
                                                title: { display: true, text: 'عدد الجرحى و الموتى حسب اتجاه قابس', font: { size: 60 } },
                                            },
                                        }}
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
                                                title: { display: true, text: 'عدد الجرحى و الموتى حسب اتجاه صفاقس', font: { size: 60 } },
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
                                    <th>المكان</th>
                                    <th></th>
                                </tr>
                            </thead>
                            {data == ""  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="8">الرجاء تعمير الجدول و اختيار التاريخ</td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="8">الرجاء اختيار التاريخ</td></tr></tbody>) : startDate && endDate != null && filteredData(startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="8">لا توجد بيانات في هذا التاريخ</td></tr></tbody>) : (<tbody >
                                <tr>
                                    <td>%{(injurTwenty * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurTwenty}</td>
                                    <td>%{(deadTwenty * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadTwenty}</td>
                                    <td>%{(accTwenty * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accTwenty}</td>
                                    <td>من  ن.ك 317  الى  ن.ك 327</td>
                                    <td rowSpan="8">اتجاه قابس</td>
                                </tr>
                                <tr>
                                    <td>%{(injurThirty * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurThirty}</td>
                                    <td>%{(deadThirty * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadThirty}</td>
                                    <td>%{(accThirty * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accThirty}</td>
                                    <td>من  ن.ك 327  الى  ن.ك 337</td>
                                </tr>
                                <tr>
                                    <td>%{(injurForty * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurForty}</td>
                                    <td>%{(deadForty * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadForty}</td>
                                    <td>%{(accForty * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accForty}</td>
                                    <td>من  ن.ك 337  الى  ن.ك 347</td>
                                </tr>
                                <tr>
                                    <td>%{(injurFifty * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurFifty}</td>
                                    <td>%{(deadFifty * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadFifty}</td>
                                    <td>%{(accFifty * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accFifty}</td>
                                    <td>من  ن.ك 347  الى  ن.ك 357</td>
                                </tr>
                                <tr>
                                    <td>%{(injurSixty * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurSixty}</td>
                                    <td>%{(deadSixty * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadSixty}</td>
                                    <td>%{(accSixty * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accSixty}</td>
                                    <td>من  ن.ك 357  الى  ن.ك 367</td>
                                </tr>
                                <tr>
                                    <td>%{(injurSeventy * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurSeventy}</td>
                                    <td>%{(deadSeventy * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadSeventy}</td>
                                    <td>%{(accSeventy * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accSeventy}</td>
                                    <td>من  ن.ك 367  الى  ن.ك 377</td>
                                </tr>
                                <tr>
                                    <td>%{(injurEighty * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurEighty}</td>
                                    <td>%{(deadEighty * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadEighty}</td>
                                    <td>%{(accEighty * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accEighty}</td>
                                    <td>من  ن.ك 377  الى  ن.ك 387</td>
                                </tr>
                                <tr>
                                    <td>%{(injurNinety * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurNinety}</td>
                                    <td>%{(deadNinety * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadNinety}</td>
                                    <td>%{(accNinety * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accNinety}</td>
                                    <td>من  ن.ك 387  الى  ن.ك 391</td>
                                </tr>
                                <tr>
                                    <td>%{(injurTwentyy * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurTwentyy}</td>
                                    <td>%{(deadTwentyy * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadTwentyy}</td>
                                    <td>%{(accTwentyy * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accTwentyy}</td>
                                    <td>من  ن.ك 317  الى  ن.ك 327</td>
                                    <td rowSpan="8">اتجاه صفاقس</td>
                                </tr>
                                <tr>
                                    <td>%{(injurThirtyy * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurThirtyy}</td>
                                    <td>%{(deadThirtyy * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadThirtyy}</td>
                                    <td>%{(accThirtyy * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accThirtyy}</td>
                                    <td>من  ن.ك 327  الى  ن.ك 337</td>
                                </tr>
                                <tr>
                                    <td>%{(injurFortyy * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurFortyy}</td>
                                    <td>%{(deadFortyy * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadFortyy}</td>
                                    <td>%{(accFortyy * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accFortyy}</td>
                                    <td>من  ن.ك 337  الى  ن.ك 347</td>
                                </tr>
                                <tr>
                                    <td>%{(injurFiftyy * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurFiftyy}</td>
                                    <td>%{(deadFiftyy * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadFiftyy}</td>
                                    <td>%{(accFiftyy * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accFiftyy}</td>
                                    <td>من  ن.ك 347  الى  ن.ك 357</td>
                                </tr>
                                <tr>
                                    <td>%{(injurSixtyy * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurSixtyy}</td>
                                    <td>%{(deadSixtyy * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadSixtyy}</td>
                                    <td>%{(accSixtyy * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accSixtyy}</td>
                                    <td>من  ن.ك 357  الى  ن.ك 367</td>
                                </tr>
                                <tr>
                                    <td>%{(injurSeventyy * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurSeventyy}</td>
                                    <td>%{(deadSeventyy * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadSeventyy}</td>
                                    <td>%{(accSeventyy * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accSeventyy}</td>
                                    <td>من  ن.ك 367  الى  ن.ك 377</td>
                                </tr>
                                <tr>
                                    <td>%{(injurEightyy * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurEightyy}</td>
                                    <td>%{(deadEightyy * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadEightyy}</td>
                                    <td>%{(accEightyy * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accEightyy}</td>
                                    <td>من  ن.ك 377  الى  ن.ك 387</td>
                                </tr>
                                <tr>
                                    <td>%{(injurNinetyy * 100 / sumInjur).toFixed(2)}</td>
                                    <td>{injurNinetyy}</td>
                                    <td>%{(deadNinetyy * 100 / sumDead).toFixed(2)}</td>
                                    <td>{deadNinetyy}</td>
                                    <td>%{(accNinetyy * 100 / sumAcc).toFixed(2)}</td>
                                    <td>{accNinetyy}</td>
                                    <td>من  ن.ك 387  الى  ن.ك 391</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>{sumInjur}</td>
                                    <td></td>
                                    <td>{sumDead}</td>
                                    <td></td>
                                    <td>{sumAcc}</td>
                                    <td colSpan="2">الاجمالي</td>
                                </tr>
                            </tbody>)}
                        </Table>
                        <div>
                       {(!startDate || !endDate) ? (<h3>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(startDate,endDate).length === 0 ? (<h3>لا توجد بيانات في هذا التاريخ</h3>) : (
                                <div>
                                    <div ref={chartAccRef}>
                                        <Bar
                                            data={{
                                                labels: ['من  ن.ك 317  الى  ن.ك 327', 'من  ن.ك 327  الى  ن.ك 337', 'من  ن.ك 337  الى  ن.ك 347', 'من  ن.ك 347  الى  ن.ك 357', 'من  ن.ك 357  الى  ن.ك 367', 'من  ن.ك 367  الى  ن.ك 377', 'من  ن.ك 377  الى  ن.ك 387', 'من  ن.ك 387  الى  ن.ك 391'],
                                                datasets: [
                                                    {
                                                        label: 'قابس',
                                                        data: [injurTwenty, injurThirty, injurForty, injurFifty, injurSixty, injurSeventy, injurEighty, injurNinety],
                                                        backgroundColor: 'dark grey',
                                                        borderColor: 'grey',
                                                        borderWidth: 1,
                                                    },
                                                    {
                                                        label: 'صفاقس',
                                                        data: [injurTwentyy, injurThirtyy, injurFortyy, injurFiftyy, injurSixtyy, injurSeventyy, injurEightyy, injurNinetyy],
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
                                                    title: { display: true, text: 'عددالحوادث حسب المكان', font: { size: 60 } },
                                                },
                                            }}
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
                                                    title: { display: true, text: 'عدد الجرحى و الموتى حسب اتجاه قابس', font: { size: 60 } },
                                                },
                                            }}
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
                                                    title: { display: true, text: 'عدد الجرحى و الموتى حسب اتجاه صفاقس', font: { size: 60 } },
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