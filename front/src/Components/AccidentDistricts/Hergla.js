import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../JS/userSlice/userSlice';
import { fetchForms } from '../../JS/formSlice/FormSlice';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "./accGlobal.css";

export const Hergla = () => {
  const data = useSelector((state) => state.data.data);
  const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
      dispatch(getAllUsers());
    }, [dispatch]);
    useEffect(() => {
      dispatch(fetchForms());
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
            (user.district || "") === "hergla" &&
            (user.role || "") === "securite"
        )
        .map((user) => user._id);
    
      return data.filter((form) => {
        const isCreatedByValid =
          usersFromTargetRegionAndRole.includes(form.createdBy) &&
          validUserIds.has(form.createdBy);
    
        if (!isCreatedByValid) return false;
    
        // If no userAutonum filter, allow all
        if (!userAutonum) return true;
    
        const allowedDistricts = autorouteDistrictMap[userAutonum] || [];
    
        return (
          form.autonum === userAutonum &&
          allowedDistricts.includes(form.district)
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
      const filteredDataArray = filteredData(data, formatStartDate, formatEndDate);
      const sortedDataArray = filteredDataArray.sort(
        (a, b) =>
          new Date(b.ddate) - new Date(a.ddate) ||
          b.hours - a.hours ||
          b.minutes - a.minutes
      );

  return (
    <div>
        <h2>تحصيل حوادث طرقات اقليم هرقلة</h2>
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
      <table className="accident-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Dégât</th>
            <th>Morts</th>
            <th>Blessés</th>
            <th>Cause</th>
            <th>Matricule A</th>
            <th>Sens</th>
            <th>Mètre</th>
            <th>Nk</th>
          </tr>
        </thead>
        <tbody>
          {sortedDataArray.length === 0 ? (
            <tr>
              <td colSpan="11">Aucune donnée</td>
            </tr>
          ) : (
            sortedDataArray.map((item, index) => (
              <tr key={index}>
                <td>{item.ddate || `${item.day}/${item.months}/${item.years}`}</td>
                <td>{`${item.hours}:${item.minutes}`}</td>
                <td>{item.degat}</td>
                <td>{item.nbrmort}</td>
                <td>{item.nbrblesse}</td>
                <td>{item.cause}</td>
                <td>{item.matriculeA || "-"}</td>
                <td>{item.sens}</td>
                <td>{item.mtr}</td>
                <td>{item.nk}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </div>
  )
}
