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
import { currentUser, deleteUser, getAllUsers } from '../../JS/userSlice/userSlice';
import { RxCross1 } from "react-icons/rx";
import Swal from "sweetalert2";
import { lineWobble } from 'ldrs'

lineWobble.register()

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

  // const sorting = (col) => {
  //   const sorted = [...filteredDataArray].sort((a, b) => {
  //     const valA = typeof a[col] === 'string' ? a[col].toLowerCase() : a[col];
  //     const valB = typeof b[col] === 'string' ? b[col].toLowerCase() : b[col];

  //     if (order === "ASC") {
  //       return valA > valB ? 1 : -1;
  //     } else {
  //       return valA < valB ? 1 : -1;
  //     }
  //   });

  //   setDonne(sorted);
  //   setOrder(order === "ASC" ? "DSC" : "ASC");
  // };




  return (
    <div className='backcolor'>
      {isMobile ? (<StyledTable>
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
        <div>
          <Button variant="primary" onClick={exportToExcel}>
            تصدير إلى Excel
          </Button>
        </div>
        <div>
          <p>You are viewing on a mobile.</p>
          {filteredDataArray.length === 0 ? <h4 style={{ marginTop: "20px", marginBottom: "20px" }}>الرجاء تعمير الجدول</h4> : <p></p>}
          <Table className="margin" striped bordered hover >
            <thead >
              <tr>
                {/* <th onClick={() => sorting("barrier")}>زلاقات</th>
                <th onClick={() => sorting("nbrmort")}>موتى</th>
                <th onClick={() => sorting("nbrblesse")}>جرحى </th>
                <th onClick={() => sorting("cause")}>السبب </th>
                <th onClick={() => sorting("a")}>لوحة منجمية</th>
                <th onClick={() => sorting("sens")}>اتجاه</th>
                <th onClick={() => sorting("nk")}>ن.ك</th>
                <th onClick={() => sorting("hours")}>الساعة </th>
                <th onClick={() => sorting("day")}>اليوم </th>
                <th onClick={() => sorting("ddate")}>التاريخ </th>
                <th> </th> */}
                <th>زلاقات</th>
                <th>موتى</th>
                <th>جرحى </th>
                <th>السبب </th>
                <th>لوحة منجمية</th>
                <th>اتجاه</th>
                <th>ن.ك</th>
                <th>الساعة </th>
                <th>اليوم </th>
                <th>التاريخ </th>
                <th> </th>
              </tr>
            </thead>
            {filteredDataArray.length === 0 ? (<tbody><tr><td colSpan="10" style={{ textAlign: "center" }}><l-line-wobble
              size="80"
              stroke="5"
              bg-opacity="0.1"
              speed="1.75"
              color="black"
            ></l-line-wobble></td><td><Add /></td></tr></tbody>) : (<tbody >
              {(!formatStartDate && !formatEndDate ? filteredDataArray : filteredDataArray.filter(form => form.ddate >= formatStartDate && form.ddate <= formatEndDate)).map((form) => (
                <tr key={form._id}>
                  <td>{parseFloat(form.barrier) * 4 + 'm'},({form.barrier})</td>
                  <td>{form.nbrmort}</td>
                  <td>{form.nbrblesse}</td>
                  <td>{form.cause}</td>
                  <td>
                    أ:{form.a}<br />
                    ب:{form.b}<br />
                    ج:{form.c}<br />
                    د:{form.d}
                  </td>
                  <td>{form.sens}</td>
                  <td>Pk:{form.nk},{form.mtr}m</td>
                  <td>{form.hours}:{form.minutes}</td>
                  <td>{form.day}</td>
                  <td>{form.ddate}</td>
                  <td>
                    {curuser?.isAdmin ? (
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
                <td></td>
                <td>{sumDead}</td>
                <td>{sumInjur}</td>
                <td colSpan="7"></td>
                <td>الاجمالي</td>
              </tr>
            </tbody>)}
          </Table>
        </div></StyledTable>) : (
        <StyledTable>
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
          <div>
            <Button variant="primary" onClick={exportToExcel}>
              تصدير إلى Excel
            </Button>
          </div>
          <div>
            {filteredDataArray.length === 0 ? <h4 style={{ marginTop: "20px", marginBottom: "20px", color: "red" }}>!الرجاء تعمير الجدول</h4> : <p></p>}
            <Table className="margin" striped bordered hover >
              <thead >
                <tr>
                  {/* <th onClick={() => sorting("barrier")}>زلاقات</th>
                <th onClick={() => sorting("nbrmort")}>موتى</th>
                <th onClick={() => sorting("nbrblesse")}>جرحى </th>
                <th onClick={() => sorting("cause")}>السبب </th>
                <th onClick={() => sorting("a")}>لوحة منجمية</th>
                <th onClick={() => sorting("sens")}>اتجاه</th>
                <th onClick={() => sorting("nk")}>ن.ك</th>
                <th onClick={() => sorting("hours")}>الساعة </th>
                <th onClick={() => sorting("day")}>اليوم </th>
                <th onClick={() => sorting("ddate")}>التاريخ </th>
                <th> </th> */}
                  <th>زلاقات</th>
                  <th>موتى</th>
                  <th>جرحى </th>
                  <th>السبب </th>
                  <th>لوحة منجمية</th>
                  <th>اتجاه</th>
                  <th>ن.ك</th>
                  <th>الساعة </th>
                  <th>اليوم </th>
                  <th>التاريخ </th>
                  <th> </th>
                </tr>
              </thead>
              {filteredDataArray.length === 0 ? (<tbody><tr><td colSpan="10" style={{ textAlign: "center" }}><l-line-wobble
                size="80"
                stroke="5"
                bg-opacity="0.1"
                speed="1.75"
                color="black"
              ></l-line-wobble></td><td><Add /></td></tr></tbody>) : (<tbody >
                {(!formatStartDate && !formatEndDate ? filteredDataArray : filteredDataArray.filter(form => form.ddate >= formatStartDate && form.ddate <= formatEndDate)).map((form) => (
                  <tr key={form._id}>
                    <td>{parseFloat(form.barrier) * 4 + 'm'},({form.barrier})</td>
                    <td>{form.nbrmort}</td>
                    <td>{form.nbrblesse}</td>
                    <td>{form.cause}</td>
                    <td>
                      أ:{form.a}<br />
                      ب:{form.b}<br />
                      ج:{form.c}<br />
                      د:{form.d}
                    </td>
                    <td>{form.sens}</td>
                    <td>Pk:{form.nk},{form.mtr}m</td>
                    <td>{form.hours}:{form.minutes}</td>
                    <td>{form.day}</td>
                    <td>{form.ddate}</td>
                    <td>
                      {curuser?.isAdmin ? (
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
                  <td></td>
                  <td>{sumDead}</td>
                  <td>{sumInjur}</td>
                  <td colSpan="7"></td>
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