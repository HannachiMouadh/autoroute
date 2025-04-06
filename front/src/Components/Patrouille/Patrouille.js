// Patrouille.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatrouilles } from "../../JS/patrouilleSlice/PatrouilleSlice";
import { getAllUsers } from "../../JS/userSlice/userSlice";
import { useMediaQuery } from "react-responsive";

const Patrouille = () => {
  const isMobileView = useMediaQuery({ query: "(max-width: 760px)" });
  const dispatch = useDispatch();
  const { patrouilles, status, error } = useSelector(
    (state) => state.patrouille
  );

  useEffect(() => {
    dispatch(fetchPatrouilles());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getAllUsers()); // get all users at mount
  }, [dispatch]);

  const users = useSelector((state) => state.user.users);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  console.log("Users from Redux:", users);

  let sessionCounter = 0;
              let isSessionOpen = false;

  return (
    <div>
      {isMobileView ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {Array.isArray(patrouilles) &&
            Array.isArray(users) &&
            patrouilles.map((p, i) => {
              const dateObj = new Date(p.createdAt);
              const userName =
                users.find((u) => String(u._id) === String(p.createdBy))
                  ?.name || "Unknown";
              const isEndRow = p.endKilometrage;

              // Detect session start
              if (p.startKilometrage && !isSessionOpen) {
                sessionCounter++;
                isSessionOpen = true;
              }

              // Detect session end
              if (p.endKilometrage) {
                isSessionOpen = false;
              }

              return (
                <div
                  key={i}
                  style={{
                    border: isEndRow ? "3px solid black" : "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "15px",
                    backgroundColor: isEndRow ? "#f9f9f9" : "#fff",
                    fontWeight: isEndRow ? "bold" : "normal",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <p>
                    <strong>Session:</strong>
                    {sessionCounter}
                  </p>
                  <p>
                    <strong>Matricule:</strong> {p.matricule}
                  </p>
                  <p>
                    <strong>Start Km:</strong> {p.startKilometrage}
                  </p>
                  <p>
                    <strong>Point Km:</strong> {p.pointKilo || "-"}
                  </p>
                  <p>
                    <strong>Tâche:</strong> {p.tache || "-"}
                  </p>
                  <p>
                    <strong>Observation:</strong> {p.observation || "-"}
                  </p>
                  <p>
                    <strong>End Km:</strong> {p.endKilometrage || "-"}
                  </p>
                  <p>
                    <strong>Date:</strong> {dateObj.toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {dateObj.toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>Created By:</strong> {userName}
                  </p>
                </div>
              );
            })}
        </div>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", textAlign: "left" }}
        >
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Start Km</th>
              <th>Point Km</th>
              <th>Tâche</th>
              <th>Observation</th>
              <th>End Km</th>
              <th>Date</th>
              <th>Time</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            
            {Array.isArray(patrouilles) &&
              Array.isArray(users) &&
              patrouilles.map((p, i) => {
                const dateObj = new Date(p.createdAt);
                const userName =
                  users.find((u) => String(u._id) === String(p.createdBy))
                    ?.name || "Unknown";
                const isEndRow = p.endKilometrage;
                

              // Detect session start
              if (p.startKilometrage && !isSessionOpen) {
                sessionCounter++;
                isSessionOpen = true;
              }

              // Detect session end
              if (p.endKilometrage) {
                isSessionOpen = false;
              }

                return (
                  <tr
                    key={i}
                    style={{
                      borderBottom: isEndRow
                        ? "3px solid black"
                        : "1px solid lightgray",
                      fontWeight: isEndRow ? "bold" : "normal",
                    }}
                  >
                     <td>{`Session ${sessionCounter}`}</td>
                    <td>{p.matricule}</td>
                    <td>{p.startKilometrage}</td>
                    <td>{p.pointKilo || "-"}</td>
                    <td>{p.tache || "-"}</td>
                    <td>{p.observation || "-"}</td>
                    <td>{p.endKilometrage || "-"}</td>
                    <td>{dateObj.toLocaleDateString()}</td>
                    <td>{dateObj.toLocaleTimeString()}</td>
                    <td>{userName}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Patrouille;
