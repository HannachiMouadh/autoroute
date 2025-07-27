import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../JS/userSlice/userSlice';
import { fetchForms } from '../../JS/formSlice/FormSlice';
import moment from 'moment';
import DatePicker from "react-datepicker";
import { fetchEntData } from '../../JS/entretientSlice/EntretientSlice';
import { Table } from 'react-bootstrap';
import "./entGlobal.css";

export const EntOudhref = () => {
  const data = useSelector((state) => state.entData.entDatas);
  const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
      dispatch(getAllUsers());
    }, [dispatch]);
    useEffect(() => {
      dispatch(fetchEntData());
    }, [dispatch]);
    const userRedux = useSelector((state) => state.user.users);



  const autorouteDistrictMap = {
      a1: ['oudhref', 'mahres', 'jem', 'hergla', 'turki'],
      a3: ['mdjazbab', 'baja'],
      a4: ['bizerte'],
    };
    
        const userAutonum = "a1";
  const filterData = (data, userAutonum) => {
  if (!data || !userRedux) {
    return [];
  }

  // Get valid user IDs
  const validUserIds = new Set(userRedux.map((user) => user._id));

  // Filter users by district and role
  const usersFromTargetRegionAndRole = userRedux
    .filter(
      (user) =>
        (user.district || "") === "oudhref" &&
        (user.role || "") === "securite" || "entretient"
    )
    .map((user) => user._id);

return data.filter((form) => {
  const isCreatedByValid =
    usersFromTargetRegionAndRole.includes(form.createdBy) &&
    validUserIds.has(form.createdBy);

  if (!isCreatedByValid) return false;

  if (!userAutonum) return true;

  const allowedDistricts = autorouteDistrictMap[userAutonum] || [];

  // 🔁 New: infer from user instead of form
  const creator = userRedux.find((u) => u._id === form.createdBy);
  const formAutonum = creator?.autonum;
  const formDistrict = creator?.district;
  

  return (
    formAutonum === userAutonum &&
    allowedDistricts.includes(formDistrict)
  );
});
};


  // Modify filteredData to include the updated filterData function
const filteredData = (data, start, end, userAutonum = null) => {
  const baseFiltered = filterData(data, userAutonum);

  if (!start && !end) {
    return baseFiltered;
  }

  return baseFiltered.filter((form) => {
    const formDate = moment(form.ddate, "YYYY-MM-DD");
    const isAfterOrSameStart =
      !start || formDate.isSameOrAfter(moment(start, "YYYY-MM-DD"));
    const isBeforeOrSameEnd =
      !end || formDate.isSameOrBefore(moment(end, "YYYY-MM-DD"));
    return isAfterOrSameStart && isBeforeOrSameEnd;
  });
};

      // Format dates
      const formatStartDate = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
      const formatEndDate = endDate ? moment(endDate).format("YYYY-MM-DD") : null;
    
      // Filter data and calculate sums
      const filteredDataArray = filteredData(data, formatStartDate, formatEndDate,userAutonum);
      const sortedDataArray = filteredDataArray.sort(
        (a, b) =>
          new Date(b.ddate) - new Date(a.ddate) ||
          b.hours - a.hours ||
          b.minutes - a.minutes
      );
console.log(data);

  return (
    <div>
        <h2>تحصيل صيانة اقليم وذرف</h2>
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
    <div className="table-container">
      <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Tache</th>
                    <th>Point Kilo</th>
                    <th>Nb ouvrier</th>
                    <th>Materiel</th>
                    <th>Observation</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDataArray.length === 0 ? (<tr><td colSpan={8}> Aucune résultat</td></tr>) :
                    sortedDataArray.map((item) => (
                      <tr key={item._id}>
                        <td>
                          {Array.isArray(item.image) && item.image.length > 0 ? (
                            <div
                              style={{
                                display: "flex",
                                gap: "3px",
                                flexWrap: "wrap",
                              }}
                            >
                              {item.image.map((imgPath, index) => {
                                console.log(
                                  `Image Path: http://localhost:5000${imgPath}`
                                );
                                return (
                                  <img
                                    key={index}
                                    src={`http://localhost:5000${imgPath}`}
                                    alt={`entretient-${index}`}
                                    style={{
                                      maxWidth: "20px",
                                      maxHeight: "20px",
                                      margin: "5px",
                                      borderRadius: 3,
                                    }}
                                  />
                                );
                              })}
                            </div>
                          ) : (
                            <p>No images available</p>
                          )}
                        </td>
      
                        <td>{item.ddate}</td>
                        <td>{item.time}</td>
                        <td className="truncated-cell">{item.tache}</td>
                        <td>{item.pointKilo}</td>
                        <td>{item.nbOuvrier}</td>
                        <td className="truncated-cell">{item.materiel}</td>
                        <td className="truncated-cell">{item.observation}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
    </div>
    </div>
  )
}
