import React, { useEffect, useState } from 'react'
import { deleteForm, fetchForms } from '../../JS/formSlice/FormSlice';
import { useDispatch, useSelector } from 'react-redux';
import Add from './Add';
import Delete from './Delete';
import Update from './Update';
import Table from 'react-bootstrap/Table';
import './Home.css';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { currentUser, deleteUser } from '../../JS/userSlice/userSlice';
import { RxCross1 } from "react-icons/rx";
import Swal from "sweetalert2";

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


const Home = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const data = useSelector((state) => state.data.data);
  const [User, setUser] = useState({ name: "", lastName: "", email: "", phone: "", date_naiss: "", });
  const isAuth = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const userRedux = useSelector((state) => state.user.user);
  console.log(userRedux);
  useEffect(() => {
    if (isAuth) {
      dispatch(currentUser());
    }
  }, [dispatch, isAuth]);
  useEffect(() => {
    dispatch(fetchForms());
  }, [dispatch]);
  useEffect(() => {
    setUser(userRedux);
  }, [userRedux]);

  const handleDelete = (dataId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Voulez-vous supprimer cet utilisateur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteForm(dataId));
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
        window.location.reload();
      }
    });

  };


  const formatStartDate = startDate ? moment(startDate).format("yyyy-MM-DD") : null;
  const formatEndDate = endDate ? moment(endDate).format("yyyy-MM-DD") : null;
  console.log(formatStartDate);
  console.log(formatEndDate);

  const filteredData = (data, start, end) => {
    if (!start && !end) {
      return data;
    }
    return data.filter((form) => {
      const formDate = moment(form.ddate, "YYYY-MM-DD");
      const isAfterOrSameStart = !start || formDate.isSameOrAfter(moment(start, "YYYY-MM-DD"));
      const isBeforeOrSameEnd = !end || formDate.isSameOrBefore(moment(end, "YYYY-MM-DD"));
      return isAfterOrSameStart && isBeforeOrSameEnd;
    });
  };


  const isMobile = useMediaQuery({ query: '(max-width: 400px)' });
  const filteredDataArray = filteredData(data, formatStartDate, formatEndDate);

  const sumInjur = filteredDataArray.reduce((acc, form) => acc + (form.nbrblesse || 0), 0);
  const sumDead = filteredDataArray.reduce((acc, form) => acc + (form.nbrmort || 0), 0);
  console.log(sumInjur);

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Statistics');
    const exportData = filteredData(data, startDate, endDate).map(({ _id, __v, years,months, ...rest }) => rest);

    // Add headers
    const headerMapping = {
      a: "ل.م:أ",
      b: "ل.م:ب",
      c: "ل.م:ج",
      d: "ل.م:د",
      barrier: "زلاقات",
      sens: "اتجاه",
      nk: "ن.ك",
      mtr: "مسافة ن.ك",
      nbrmort: "موتى",
      nbrblesse: "جرحى",
      cause: "السبب",
      ddate: "التاريخ",
      day: "اليوم",
      hours: "الساعة",
      minutes: "دقائق",
    };

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

    // Add data
    exportData.forEach(row => {
      worksheet.addRow(Object.values(row));
    });

    // Apply borders
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


  return (
    <div>
      {isMobile ? (<StyledTable>
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
        <div>
          <Button variant="primary" onClick={exportToExcel}>
            تصدير إلى Excel
          </Button>
        </div>
        <div>
          <p>You are viewing on a mobile.</p>
          <Table className="margin" striped bordered hover >
            <thead >
              <tr>
                <th>اتجاه</th>
                <th>ن.ك</th>
                <th>موتى</th>
                <th>جرحى </th>
                <th>السبب </th>
                <th>التاريخ </th>
                <th>الساعة </th>
                <th>اليوم </th>
                <th>لوحة منجمية</th>
                <th>زلاقات</th>
              </tr>
            </thead>
            {data == "" ? (<tbody><tr><td colSpan="12" style={{ textAlign: "center" }}><img src="https://i.gifer.com/YCZH.gif" alt="logo" /></td></tr></tbody>) : (<tbody >
              {(!formatStartDate && !formatEndDate ? data : data.filter(form => form.ddate >= formatStartDate && form.ddate <= formatEndDate)).map((form) => (
                <tr key={form._id}>
                  <td>{form.sens}</td>
                  <td>Pk:{form.nk},{form.mtr}m</td>
                  <td>{form.nbrmort}</td>
                  <td>{form.nbrblesse}</td>
                  <td>{form.cause}</td>
                  <td>{form.ddate}</td>
                  <td>{form.hours}:{form.minutes}</td>
                  <td>{form.day}</td>
                  <td>
                    أ:{form.a}<br />
                    ب:{form.b}<br />
                    ج:{form.c}<br />
                    د:{form.d}
                  </td>
                  <td>{parseFloat(form.barrier) * 4 + 'm'}</td>
                  <td>
                    {isAdmin ? (
                      <div className='center'>
                        <Button variant="danger" onClick={() => handleDelete(form._id)}><RxCross1 /></Button>
                        <Update dataId={form._id} rowData={form} />
                        <Add />
                      </div>
                    ) : (
                      <Add />
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="2"></td>
                <td>{sumDead}</td>
                <td>{sumInjur}</td>
                <td colSpan="6"></td>
                <td>الاجمالي</td>
              </tr>
            </tbody>)}
          </Table>
        </div></StyledTable>) : (
        <StyledTable>
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
          <div>
            <Button variant="primary" onClick={exportToExcel}>
              تصدير إلى Excel
            </Button>
          </div>
          <div>
            {data == "" ? <p>الرجاء تعمير الجدول</p> : <p></p>}
            <Table className="margin" striped bordered hover >
              <thead >
                <tr>
                  <th>اتجاه</th>
                  <th>ن.ك</th>
                  <th>موتى</th>
                  <th>جرحى </th>
                  <th>السبب </th>
                  <th>التاريخ </th>
                  <th>الساعة </th>
                  <th>اليوم </th>
                  <th>لوحة منجمية</th>
                  <th>زلاقات</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              {data == "" ? (<tbody><tr><td colSpan="12" style={{ textAlign: "center" }}><img src="https://i.gifer.com/YCZH.gif" alt="logo" /></td><td><Add /></td></tr></tbody>) : (<tbody >
                {(!formatStartDate && !formatEndDate ? data : data.filter(form => form.ddate >= formatStartDate && form.ddate <= formatEndDate)).map((form) => (
                  <tr key={form._id}>
                    <td>{form.sens}</td>
                    <td>Pk:{form.nk},{form.mtr}m</td>
                    <td>{form.nbrmort}</td>
                    <td>{form.nbrblesse}</td>
                    <td>{form.cause}</td>
                    <td>{form.ddate}</td>
                    <td>{form.hours}:{form.minutes}</td>
                    <td>{form.day}</td>
                    <td>
                      أ:{form.a}<br />
                      ب:{form.b}<br />
                      ج:{form.c}<br />
                      د:{form.d}
                    </td>
                    <td>{parseFloat(form.barrier) * 4 + 'm'}</td>
                    <td>
                      {userRedux?.isAdmin ? (
                        <div className='wrap-center'>
                          <div className='top-buttons'>
                            <Button variant="danger" onClick={() => handleDelete(form._id)}><RxCross1 /></Button>
                            <Update dataId={form._id} rowData={form} />
                          </div>
                          <Add />
                        </div>
                      ) : (
                        <Add />
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2"></td>
                  <td>{sumDead}</td>
                  <td>{sumInjur}</td>
                  <td colSpan="6"></td>
                  <td>الاجمالي</td>
                </tr>
              </tbody>)}
            </Table>
          </div></StyledTable>)
      }
    </div >

  );
};
export default Home;