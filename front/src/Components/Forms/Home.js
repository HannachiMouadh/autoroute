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
import ShowForm from './ShowDataForm';
import { MdDeleteOutline } from "react-icons/md";

tailChase.register()




const Home = ({ userRegion, curuser,ShowRowData, userRole }) => {
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
          dispatch(fetchForms());
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
    const exportData = filteredData(data, startDate, endDate).map(({ _id, __v, years, months, createdBy, mtr, nk,minutes,hours, ...rest }) => ({
      ...rest,
      mtr_nk: `${nk}+${mtr}m`,
      hours_min: `${hours}:${minutes}`
  }));

    const headerMapping = {
      barrier: "اضرار مادية",
      nbrmort: "موتى",
      nbrblesse: "جرحى",
      cause: "السبب",
      d: "ل.م:د",
      c: "ل.م:ج",
      b: "ل.م:ب",
      a: "ل.م:أ",
      sens: "اتجاه",
      day: "اليوم",
      ddate: "التاريخ",
      mtr_nk: "مسافة ن.ك",
      hours_min: "التوقيت",
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

  const filterData = (data) => {
    if (!data || !userRedux) {
      return [];
    }
  
    // Get valid user IDs from the current userRedux state
    const validUserIds = new Set(userRedux.map((user) => user._id));
  
    // Filter users based on region and role
    const usersFromTargetRegionAndRole = userRedux
      .filter(
        (user) => (user.region || "") === userRegion && (user.role || "") === "securite" // Filtering by role
      )
      .map((user) => user._id);
  
    return data.filter(
      (form) =>
        usersFromTargetRegionAndRole.includes(form.createdBy) &&
        validUserIds.has(form.createdBy) // Ensure `createdBy` is still valid
    );
  };
  
  // Modify filteredData to include the updated filterData function
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
  
  // Format dates
  const formatStartDate = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
  const formatEndDate = endDate ? moment(endDate).format("YYYY-MM-DD") : null;
  
  // Filter data and calculate sums
  const filteredDataArray = filteredData(data, formatStartDate, formatEndDate);
  
  const sumDays = filteredDataArray.length; 
  


  const isMobileView = useMediaQuery({ query: '(max-width: 760px)' });

  


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
      <div className='centerbtn'>
      <Button variant="primary" onClick={() => setStartDate(null) || setEndDate(null)}>
        إعادة تعيين المرشحات
      </Button>
      <Button variant="primary" onClick={exportToExcel}>
        تصدير إلى Excel
      </Button>
      </div>
      {filteredData(data,startDate,endDate) === null ? (<div className='center-alert'><Add /><h4>لا توجد بيانات في هذا التاريخ</h4></div>) : filteredDataArray.length === 0 ? (
        <div className='center-alert'><h4>!الرجاء تعمير الجدول</h4><l-tail-chase
        size="40"
        speed="1.75"
        color="black"
      ></l-tail-chase>
      <Add /></div>
      ) : (
        <TableContainer
  component={Paper}
  className="tableContainer"
>
    {isMobileView ? (
      <Table className="mobile-table">
        <TableHead>
          <TableRow>
            <TableCell className="rtl-text">اتجاه</TableCell>
            <TableCell className="rtl-text">ن.ك</TableCell>
            <TableCell className="rtl-text">الساعة</TableCell>
            <TableCell className="rtl-text">اليوم</TableCell>
            <TableCell className="rtl-text">التاريخ</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDataArray.slice(-1).map((row) => (
            <TableRow key={row._id}>
              <TableCell className="rtl-text">{row.sens}</TableCell>
              <TableCell className="rtl-text">{row.nk}</TableCell>
              <TableCell className="rtl-text">{`${row.hours}:${row.minutes}`}</TableCell>
              <TableCell className="rtl-text">{row.day}</TableCell>
              <TableCell className="rtl-text">{row.ddate}</TableCell>
              <TableCell>
              <div className="table-actions">
                {curuser?.isAdmin && curuser?.role == "securite" ? (
                  <>
                      <Add />
                      <Update dataId={row._id} rowData={row} />
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(row._id)}
                      >
                        <MdDeleteOutline />
                      </Button>
                      <ShowForm ShowRowData={row}/>
                      </>
                ) : (
                  <>
                  <ShowForm ShowRowData={row}/>
                  <Add />
                  </>
                )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
          <TableCell>Index:</TableCell>
          <TableCell>{sumDays}</TableCell>
          <TableCell colSpan={4}></TableCell>
          </TableRow>
        </TableBody>
        </Table>
    ) : (
      <Table className="large-table">
        <TableHead>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell className="rtl-text">اضرار مادية</TableCell>
            <TableCell className="rtl-text">موتى</TableCell>
            <TableCell className="rtl-text">جرحى</TableCell>
            <TableCell className="rtl-text">السبب</TableCell>
            <TableCell className="rtl-text">لوحة منجمية</TableCell>
            <TableCell className="rtl-text">اتجاه</TableCell>
            <TableCell className="rtl-text">ن.ك</TableCell>
            <TableCell className="rtl-text">الساعة</TableCell>
            <TableCell className="rtl-text">اليوم</TableCell>
            <TableCell className="rtl-text">التاريخ</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDataArray.slice(-1).map((row) => (
            <TableRow key={row._id}>
              <TableCell className="rtl-text">{sumDays}</TableCell>
              <TableCell className="rtl-text">{row.barrier}</TableCell>
              <TableCell className="rtl-text">{row.nbrmort}</TableCell>
              <TableCell className="rtl-text">{row.nbrblesse}</TableCell>
              <TableCell className="rtl-text">{row.cause}</TableCell>
              <TableCell className="rtl-text">
                {row.a && `أ: {${row.a}} `}<br />
                {row.b && `ب: {${row.b}} `}<br />
                {row.c && `ج: {${row.c}} `}<br />
                {row.d && `د: {${row.d}} `}
              </TableCell>
              <TableCell className="rtl-text">{row.sens}</TableCell>
              <TableCell className="rtl-text">{`Pk:${row.nk}+${row.mtr}m`}</TableCell>
              <TableCell className="rtl-text">{`${row.hours}:${row.minutes}`}</TableCell>
              <TableCell className="rtl-text">{row.day}</TableCell>
              <TableCell className="rtl-text">{row.ddate}</TableCell>
              <TableCell>
              <div className="table-actions">
                {curuser?.isAdmin && curuser?.role == "securite" ? (
                    <div className="top-buttons">
                      <Add />
                      <Update dataId={row._id} rowData={row} />
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(row._id)}
                      >
                        <MdDeleteOutline />
                      </Button>
                    </div>
                ) : (
                  <Add />
                )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
    )}
  
</TableContainer>)}
    </div>
  );
};
export default Home;