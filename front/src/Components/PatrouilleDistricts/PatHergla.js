import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../JS/userSlice/userSlice';
import moment from 'moment';
import DatePicker from "react-datepicker";
import { fetchPatrouilles } from '../../JS/patrouilleSlice/PatrouilleSlice';
import "./patGlobal.css";

export const PatHergla = () => {
  const data = useSelector((state) => state.patrouille.patrouilles);
  const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
      dispatch(getAllUsers());
    }, [dispatch]);
    useEffect(() => {
      dispatch(fetchPatrouilles());
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
            (user.role || "") === "patrouille"
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
        let sessionCounter = 0;
  let isSessionOpen = false;
  let currentSessionDate = "";
  const getSessionDate = (date) => {
    const d = new Date(date);
    if (d.getHours() < 6) {
      d.setDate(d.getDate() - 1);
    }
    return d.toISOString().split("T")[0]; // e.g. "2025-05-08"
  };

  return (
    <div>
        <h2>تحصيل مركبة دورية السلامة اقليم هرقلة</h2>
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
      <table
            border="1"
            cellPadding="8"
            style={{ width: "100%", textAlign: "left" }}
          >
            <thead>
              <tr>
                <th>Poste numéro</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Matricule</th>
                <th>Start Km</th>
                <th>Point Km</th>
                <th>Tâche</th>
                <th>Observation</th>
                <th>End Km</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {sortedDataArray.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Aucun résultat trouvé.
                  </td>
                </tr>
              ) : (
                sortedDataArray.map((p) => {
                  const dateObj = new Date(p.createdAt);
                  const userName =
                    userRedux.find((u) => String(u._id) === String(p.createdBy))
                      ?.name || "Unknown";
                  const isEndRow = p.endKilometrage;
                  const sessionDate = getSessionDate(dateObj);

                  if (currentSessionDate !== sessionDate) {
                    sessionCounter = 0;
                    currentSessionDate = sessionDate;
                    isSessionOpen = false;
                  }

                  if (p.startKilometrage && !isSessionOpen) {
                    sessionCounter++;
                    isSessionOpen = true;
                  }

                  if (p.endKilometrage) {
                    isSessionOpen = false;
                  }

                  return (
                    <tr
                      key={p._id}
                      style={{
                        borderBottom: isEndRow
                          ? "3px solid black"
                          : "1px solid lightgray",
                        fontWeight: isEndRow ? "bold" : "normal",
                      }}
                    >
                      <td>{`Poste ${sessionCounter}`}</td>
                      <td>{currentSessionDate}</td>
                      <td>{dateObj.toLocaleTimeString()}</td>
                      <td>{p.matricule}</td>
                      <td>{p.startKilometrage}</td>
                      <td>{p.pointKilo || "-"}</td>
                      <td>{p.tache || "-"}</td>
                      <td>{p.observation || "-"}</td>
                      <td>{p.endKilometrage || "-"}</td>
                      <td>{userName}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
    </div>
    </div>
  )
}
