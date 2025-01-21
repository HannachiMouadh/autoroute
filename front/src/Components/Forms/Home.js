import React, { useEffect, useState } from 'react'
import { deleteForm, fetchForms } from '../../JS/formSlice/FormSlice';
import { useDispatch, useSelector } from 'react-redux';
import Add from './Add';
import Delete from './Delete';
import Update from './Update';
import Button from 'react-bootstrap/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Home.css';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { currentUser, deleteUser, getAllUsers } from '../../JS/userSlice/userSlice';
import { RxCross1 } from "react-icons/rx";
import Swal from "sweetalert2";
import { tailChase } from 'ldrs'
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TableSortLabel } from '@mui/material';

tailChase.register()

const StyledTableCell = styled(TableCell)`
  color: black;
  background-color: rgb(213, 213, 213);
    padding-top: 0%;
`;


const Home = ({ userRegion, curuser }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const data = useSelector((state) => state.data.data);
  const isAuth = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [order, setOrder] = useState("ASC");


  useEffect(() => {
    if (isAuth && isAdmin) {
      dispatch(currentUser());
    }
  }, [dispatch, isAdmin, isAuth]);
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchForms());
  }, [dispatch]);
  const userRedux = useSelector((state) => state.user.users);
  const [User, setUser] = useState({ name: "", lastName: "", email: "", phone: "", region: "" });
  useEffect(() => {
    setUser(userRedux);
  }, [userRedux]);


  const handleDelete = (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Voulez-vous supprimer cette donnée ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Deleting data with id: ${id}`);
        dispatch(deleteForm(id)).then(() => {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Votre donnée est suprimé.',
            'succès'
          );
          window.location.reload();
        }).catch((error) => {
          console.error("Error deleting data:", error);
          swalWithBootstrapButtons.fire(
            'Error!',
            'Il y a un problem lors de la supression.',
            'error'
          );
        });
      }
    });
  };





  //console.log(sumInjur);

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Statistics');
    const exportData = filteredData(data, startDate, endDate).map(({ _id, __v, years, months, createdBy, ...rest }) => rest);

    const headerMapping = {
      barrier: "زلاقات",
      nbrmort: "موتى",
      nbrblesse: "جرحى",
      cause: "السبب",
      d: "ل.م:د",
      c: "ل.م:ج",
      b: "ل.م:ب",
      a: "ل.م:أ",
      sens: "اتجاه",
      mtr: "مسافة ن.ك",
      nk: "ن.ك",
      minutes: "دقائق",
      hours: "الساعة",
      day: "اليوم",
      ddate: "التاريخ",
    };
    console.log(headerMapping);

    const tableHeaderRow = worksheet.getRow(2);
    tableHeaderRow.values = Object.values(headerMapping);
    tableHeaderRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    worksheet.mergeCells('A1:O1');
    const headerRow = worksheet.getRow(1);
    const headerCell = headerRow.getCell(1);
    headerCell.value = startDate && endDate ? `Recap Rapport Statistique : ${formatStartDate} - ${formatEndDate}` : 'Recap Rapport Statistique pour touts les données';
    headerCell.font = { bold: true };
    headerCell.alignment = { horizontal: 'center', vertical: 'middle' };

    exportData.forEach(row => {
      worksheet.addRow(Object.values(row));
    });

    const borderStyle = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    worksheet.eachRow({ includeEmpty: true }, row => {
      row.eachCell({ includeEmpty: true }, cell => {
        cell.border = borderStyle;
      });
    });


    // Save the workbook
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Recap.xlsx');
    });
  };
  const isMobile = useMediaQuery({ query: '(max-width: 400px)' });

  const filterData = (data) => {
    if (!data || !userRedux) {
      return [];
    }

    const usersFromTargetRegion = userRedux
      .filter((user) => user.region === userRegion)
      .map((user) => user._id);

    return data.filter((form) => usersFromTargetRegion.includes(form.createdBy));
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

  const formatStartDate = startDate ? moment(startDate).format("yyyy-MM-DD") : null;
  const formatEndDate = endDate ? moment(endDate).format("yyyy-MM-DD") : null;
  // const [donne, setDonne] = useState(() => filterData(data));
  const filteredDataArray = filteredData(data, formatStartDate, formatEndDate);
  // useEffect(() => {
  //   // Update the donne state to reflect the filtered data
  //   setDonne(filteredDataArray);
  // }, [filteredDataArray]);



  const sumInjur = filteredDataArray.reduce((acc, form) => acc + (form.nbrblesse || 0), 0);
  const sumDead = filteredDataArray.reduce((acc, form) => acc + (form.nbrmort || 0), 0);
  const sumDays = filteredDataArray.reduce((acc, form) => acc + 1, 0);

  const noDataIndication = () => (
    <div>
      
    </div>
  );




  return (
    <div className='left-right-gap'>
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
      <Button variant="primary" onClick={() => setStartDate(null) || setEndDate(null)}>
        إعادة تعيين المرشحات
      </Button>
      <Button variant="primary" onClick={exportToExcel}>
        تصدير إلى Excel
      </Button>

      {filteredDataArray.length === 0 ? (
        <div><h4>!الرجاء تعمير الجدول</h4><l-tail-chase
        size="40"
        speed="1.75"
        color="black"
      ></l-tail-chase>
      <Add /></div>
      ) : (
        <TableContainer component={Paper} className='tableContainer' style={{ width: '100%',backgroundColor:'rgb(204, 236, 238)', overflowX: 'hidden'}} >
          <Table style={{ tableLayout: 'auto', width: '100%'}}>
            <TableHead>
              <TableRow>
                <StyledTableCell>زلاقات</StyledTableCell>
                <StyledTableCell>موتى</StyledTableCell>
                <StyledTableCell>جرحى</StyledTableCell>
                <StyledTableCell>السبب</StyledTableCell>
                <StyledTableCell>لوحة منجمية</StyledTableCell>
                <StyledTableCell>اتجاه</StyledTableCell>
                <StyledTableCell>ن.ك</StyledTableCell>
                <StyledTableCell>الساعة</StyledTableCell>
                <StyledTableCell>اليوم</StyledTableCell>
                <StyledTableCell>التاريخ</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDataArray.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{parseFloat(row.barrier) * 4}m ({row.barrier})</TableCell>
                  <TableCell>{row.nbrmort}</TableCell>
                  <TableCell>{row.nbrblesse}</TableCell>
                  <TableCell>{row.cause}</TableCell>
                  <TableCell>
                            {row.a && `أ: ${row.a} `}<br />
                            {row.b && `ب: ${row.b} `}<br />
                            {row.c && `ج: ${row.c} `}<br />
                            {row.d && `د: ${row.d} `}
                  </TableCell>
                  <TableCell>{row.sens}</TableCell>
                  <TableCell>{`Pk:${row.nk}, ${row.mtr}m`}</TableCell>
                  <TableCell>{`${row.hours}:${row.minutes}`}</TableCell>
                  <TableCell>{row.day}</TableCell>
                  <TableCell>{row.ddate}</TableCell>
                  <TableCell>
                    {curuser?.isAdmin ? (
                      <div className='wrap-center'>
                        <div className='top-buttons'>
                          <Add />
                          <Update dataId={row._id} rowData={row} />

                          <Button variant="danger" onClick={() => handleDelete(row._id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                          </svg></Button>
                        </div>
                      </div>
                    ) : (
                      <Add />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                  <TableCell></TableCell>
                  <TableCell>موتى{sumDead}</TableCell>
                  <TableCell>جرحى{sumInjur}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>حوادث  {sumDays}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>:الاجمالي</TableCell>
                  </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
export default Home;