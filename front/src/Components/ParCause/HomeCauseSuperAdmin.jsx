import React, { useEffect, useState, useRef } from 'react'
import { fetchForms } from '../../JS/formSlice/FormSlice';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import './HomeCause.css';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { Button, Form, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { currentUser, getAllUsers } from '../../JS/userSlice/userSlice';

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


const HomeSemaine = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedAutoroute, setSelectedAutoroute] = useState("");
  
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    console.log("Selected District:", district);
  };

  const handleAutorouteChange = (e) => {
    const autoroute = e.target.value;
    setSelectedAutoroute(autoroute);
    console.log("Selected Autoroute:", autoroute);
  };

  const chartAccRefCause = useRef(null);
  const chartInjurRefCause = useRef(null);
  const chartAccRefHoraire = useRef(null);
  const chartInjurRefHoraire = useRef(null);
      const chartAccRefLieu = useRef(null);
      const chartInjurRefLieu = useRef(null);
      const chartInjurReffLieu = useRef(null);
      const chartAccRefSemaine = useRef(null);
      const chartInjurRefSemaine = useRef(null);
        const chartAccRefSense = useRef(null);
        const chartInjurRefSense = useRef(null);
  const data = useSelector((state) => state.data.data);
  const isAuth = localStorage.getItem("token");
    useEffect(() => {
        dispatch(fetchForms());
    }, [dispatch]);

    const userRedux = useSelector((state) => state.user.users);
        const user = useSelector((state) => state.user.user);
  const [User, setUser] = useState({ name: "", lastName: "", email: "", phone: "", region:"" });
  useEffect(() => {
    dispatch(getAllUsers());
}, [dispatch]);
  useEffect(() => {
    setUser(userRedux);
  }, [userRedux]);
  const currentUserDistrict = user?.district;
  const currentUserAuto = user?.autonum;
  console.log("currentUserDistrict cause: ",currentUserDistrict);
  console.log("currentUserAuto cause: ",currentUserAuto);
  const isSuper = user.isSuper;
console.log("isSuper cause: ",isSuper);
  

  const isMobile = useMediaQuery({ query: '(max-width: 400px)' });

  const formatStartDate = startDate ? moment(startDate).format("yyyy-MM-DD") : null;
  const formatEndDate = endDate ? moment(endDate).format("yyyy-MM-DD") : null;


 


  const autorouteDistrictMap = {
  a1: ['oudhref', 'mahres', 'jem', 'hergla', 'turki'],
  a3: ['mdjazbab', 'baja'],
  a4: ['bizerte'],
};
    const effectiveAuto = isSuper ? selectedAutoroute : currentUserAuto;
    const effectiveDistrict = isSuper ? selectedDistrict : currentUserDistrict;


 const filterData = (data, effectiveAuto) => {
  if (!data || !userRedux) return [];

  // const validUserIds = new Set(
  //   userRedux.map((user) => user._id.toString())
  // );


  const usersFromTargetRegionAndRole = userRedux
    .filter(
      (user) =>
        (user.district || "") === effectiveDistrict &&
        ((user.role || "") === "securite" || (user.role || "") === "superviseur")
    )
    .map((user) => user._id.toString());

  return data.filter((form) => {
    const creatorId =
      typeof form.createdBy === "object"
        ? form.createdBy._id
        : form.createdBy;

    if (!usersFromTargetRegionAndRole.includes(creatorId?.toString()))
      return false;

    if (!effectiveAuto) return true;

    const allowedDistricts = autorouteDistrictMap[effectiveAuto] || [];

    return (
      form.autonum === effectiveAuto &&
      allowedDistricts.includes(form.district)
    );
  });
};



  // Modify filteredData to include the updated filterData function
const filteredData = (data, start, end, effectiveAuto = null) => {
  const baseFiltered = filterData(data, effectiveAuto);

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

    
    
    // Filter data and calculate sums
    let filteredDataArray = filteredData(data, formatStartDate, formatEndDate);

    if (selectedAutoroute) {
      filteredDataArray = filteredData(data, formatStartDate, formatEndDate).filter(f => f.autonum === selectedAutoroute);
    }

    if (selectedDistrict) {
      filteredDataArray = filteredData(data, formatStartDate, formatEndDate).filter(f => f.district === selectedDistrict);
    }
    
console.log("filteredData(data, formatStartDate, formatEndDate): **** ",filteredData(data, formatStartDate, formatEndDate));
console.log("filteredData: **** ",filteredData(data, formatStartDate, formatEndDate));
console.log("Sample createdBy:", data[0]?.createdBy);



    const regionDirections =(district, auto) => {
      if (auto === "a1") {
      switch (district) {
          case "oudhref":
            return ["اتجاه صفاقس", "اتجاه قابس"];
          case "mahres":
            return ["اتجاه صفاقس", "اتجاه قابس"];
          case "jem":
            return ["اتجاه صفاقس", "اتجاه تونس"];
          case "hergla":
            return ["اتجاه صفاقس", "اتجاه تونس"];
          case "turki":
            return ["اتجاه سوسة", "اتجاه تونس"];
          default:
            return "";
      }
      } else if (auto === "a3") {
        switch (district) {
      case "mdjazbab":
        return ["اتجاه باجة", "اتجاه تونس"];
      case "baja":
        return ["اتجاه باجة", "اتجاه تونس"];
      default:
        return [];
    }
    } else if (auto === "a4" && district === "bizerte") {
    return ["اتجاه باجة", "اتجاه تونس"];
  } else {
    return [];
  }
  };
  
  const regionNK =(district, auto) => {
    if (auto === "a1") {
      switch (district) {
          case "oudhref":
            return [317,327,337,347,357,367,377,387,391];
          case "mahres":
            return [230,240,250,260,270,280,290,300,310,317];
            case "jem":
            return [140,150,160,170,180,190,200,210,220,230];
            case "hergla":
            return [66,77,88,99,109,119,129,139,140];
            case "turki":
            return [0,10,20,30,40,50,60,66];
          default:
            return "";
      }
       } else if (auto === "a3") {
        switch (district) {
      case "mdjazbab":
        return [0,10,20,30,40,50,60,65];
      case "baja":
        return [65,75,85,95,105,115,125];
      default:
        return [];
    }
    } else if (auto === "a4" && district === "bizerte") {
    return [0,10,20,30,40,50];
  } else {
    return [];
  }
  };

  
  
  const directions = regionNK(effectiveDistrict, effectiveAuto);
    console.log(directions[0]);
  const parSense = regionDirections(effectiveDistrict, effectiveAuto);
  if (Array.isArray(directions) && Array.isArray(parSense)) {
      var injurTwentyLieu = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurThirty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurForty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurFifty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurSixty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurSeventy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurEighty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurNinety = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[7] && form.nk <= directions[8] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
  
  
      var deadTwentyLieu = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadThirty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadForty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadFifty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadSixty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadSeventy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadEighty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadNinety = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[7] && form.nk <= directions[8] && form.sens === parSense[0])
          .reduce((acc, form) => acc + form.nbrmort, 0);
  
  
  
      var accTwentyLieu = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === parSense[0])
          .reduce((acc, form) => acc + 1, 0);
      var accThirty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === parSense[0])
          .reduce((acc, form) => acc + 1, 0);
      var accForty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === parSense[0])
          .reduce((acc, form) => acc + 1, 0);
      var accFifty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === parSense[0])
          .reduce((acc, form) => acc + 1, 0);
      var accSixty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === parSense[0])
          .reduce((acc, form) => acc + 1, 0);
      var accSeventy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === parSense[0])
          .reduce((acc, form) => acc + 1, 0);
      var accEighty = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === parSense[0])
          .reduce((acc, form) => acc + 1, 0);
      var accNinety = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[7] && form.nk <=directions[8] && form.sens === parSense[0])
          .reduce((acc, form) => acc + 1, 0);
  
  
  
      var injurTwentyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurThirtyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurFortyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurFiftyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurSixtyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurSeventyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurEightyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
      var injurNinetyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[7] && form.nk <= directions[8] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrblesse, 0);
  
  
      var deadTwentyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadThirtyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadFortyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadFiftyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadSixtyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadSeventyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadEightyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrmort, 0);
      var deadNinetyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[7] && form.nk <= directions[8] && form.sens === parSense[1])
          .reduce((acc, form) => acc + form.nbrmort, 0);
  
  
  
      var accTwentyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[0] && form.nk <= directions[1] && form.sens === parSense[1])
          .reduce((acc, form) => acc + 1, 0);
      var accThirtyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[1] && form.nk <= directions[2] && form.sens === parSense[1])
          .reduce((acc, form) => acc + 1, 0);
      var accFortyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[2] && form.nk <= directions[3] && form.sens === parSense[1])
          .reduce((acc, form) => acc + 1, 0);
      var accFiftyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[3] && form.nk <= directions[4] && form.sens === parSense[1])
          .reduce((acc, form) => acc + 1, 0);
      var accSixtyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[4] && form.nk <= directions[5] && form.sens === parSense[1])
          .reduce((acc, form) => acc + 1, 0);
      var accSeventyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[5] && form.nk <= directions[6] && form.sens === parSense[1])
          .reduce((acc, form) => acc + 1, 0);
      var accEightyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[6] && form.nk <= directions[7] && form.sens === parSense[1])
          .reduce((acc, form) => acc + 1, 0);
      var accNinetyy = filteredData(data, formatStartDate, formatEndDate)
          .filter((form) => form.nk >= directions[7] && form.nk <= directions[8] && form.sens === parSense[1])
          .reduce((acc, form) => acc + 1, 0);
  } else {
      console.log("Directions non disponibles");
  }
      const sumInjurLieu = injurTwentyLieu + injurThirty + injurForty + injurFifty + injurSixty + injurSeventy + injurEighty + injurNinety + injurTwentyy + injurThirtyy + injurFortyy + injurFiftyy + injurSixtyy + injurSeventyy + injurEightyy + injurNinetyy;
      const sumAccLieu = accTwentyLieu + accThirty + accForty + accFifty + accSixty + accSeventy + accEighty + accNinety + accTwentyy + accThirtyy + accFortyy + accFiftyy + accSixtyy + accSeventyy + accEightyy + accNinetyy;
      const sumDeadLieu = deadTwentyLieu + deadThirty + deadForty + deadFifty + deadSixty + deadSeventy + deadEighty + deadNinety + deadTwentyy + deadThirtyy + deadFortyy + deadFiftyy + deadSixtyy + deadSeventyy + deadEightyy + deadNinetyy;
  

  const injurVitesse = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'سرعة فائقة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurEclat = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'انشطار اطار العجلة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSleep = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'نعاس')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurDouble = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'مجاوزة فجئية')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurDrunk = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'سياقة في حالة سكر')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurWet = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'طريق مبلل')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurAtt = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'عدم انتباه')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurHole = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'وجود حفرة وسط الطريق')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTruck = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'انقلاب الشاحنة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurAnimal = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'حيوان على الطريق السيارة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurMan = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'مترجل على الطريق السيارة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTurn = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'الدوران في الإتجاه المعاكس')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurOut = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'الخروج من فتحة عشوائية ')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurCar = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'اصطدام سيارة باخرى رابظة على طرف الطريق')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurPanne = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'عطب مكانيكي/ عطب كهربائي')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurBehind = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'مضايقة من الخلف')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurMoto = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'اصطدام السيارة بالدراجة النارية')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurLeft = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'وجود عجلة او بقايا عجلة على الطريق')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurHerb = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'سقوط قرط على الطريق')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurAcc = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'اصطدام سيارتان او اكثر ')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurControl = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'عدم التحكم في السيارة')
    .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTired = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'السياقة تحت تأثير التعب و الإرهاق')
    .reduce((acc, form) => acc + form.nbrblesse, 0);


  const deadVitesse = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'سرعة فائقة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadEclat = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'انشطار اطار العجلة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSleep = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'نعاس')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadDouble = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'مجاوزة فجئية')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadDrunk = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'سياقة في حالة سكر')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadWet = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'طريق مبلل')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadAtt = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'عدم انتباه')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadHole = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'وجود حفرة وسط الطريق')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTruck = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'انقلاب الشاحنة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadAnimal = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'حيوان على الطريق السيارة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadMan = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'مترجل على الطريق السيارة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTurn = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'الدوران في الإتجاه المعاكس')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadOut = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'الخروج من فتحة عشوائية ')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadCar = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'اصطدام سيارة باخرى رابظة على طرف الطريق')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadPanne = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'عطب مكانيكي/ عطب كهربائي')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadBehind = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'مضايقة من الخلف')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadMoto = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'اصطدام السيارة بالدراجة النارية')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadLeft = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'وجود عجلة او بقايا عجلة على الطريق')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadHerb = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'سقوط قرط على الطريق')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadAcc = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'اصطدام سيارتان او اكثر ')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadControl = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'عدم التحكم في السيارة')
    .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTired = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'السياقة تحت تأثير التعب و الإرهاق')
    .reduce((acc, form) => acc + form.nbrmort, 0);

  const accVitesse = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'سرعة فائقة')
    .reduce((acc, form) => acc + 1, 0);
  const accEclat = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'انشطار اطار العجلة')
    .reduce((acc, form) => acc + 1, 0);
  const accSleep = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'نعاس')
    .reduce((acc, form) => acc + 1, 0);
  const accDouble = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'مجاوزة فجئية')
    .reduce((acc, form) => acc + 1, 0);
  const accDrunk = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'سياقة في حالة سكر')
    .reduce((acc, form) => acc + 1, 0);
  const accWet = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'طريق مبلل')
    .reduce((acc, form) => acc + 1, 0);
  const accAtt = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'عدم انتباه')
    .reduce((acc, form) => acc + 1, 0);
  const accHole = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'وجود حفرة وسط الطريق')
    .reduce((acc, form) => acc + 1, 0);
  const accTruck = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'انقلاب الشاحنة')
    .reduce((acc, form) => acc + 1, 0);
  const accAnimal = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'حيوان على الطريق السيارة')
    .reduce((acc, form) => acc + 1, 0);
  const accMan = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'مترجل على الطريق السيارة')
    .reduce((acc, form) => acc + 1, 0);
  const accTurn = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'الدوران في الإتجاه المعاكس')
    .reduce((acc, form) => acc + 1, 0);
  const accOut = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'الخروج من فتحة عشوائية ')
    .reduce((acc, form) => acc + 1, 0);
  const accCar = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'اصطدام سيارة باخرى رابظة على طرف الطريق')
    .reduce((acc, form) => acc + 1, 0);
  const accPanne = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'عطب مكانيكي/ عطب كهربائي')
    .reduce((acc, form) => acc + 1, 0);
  const accBehind = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'مضايقة من الخلف')
    .reduce((acc, form) => acc + 1, 0);
  const accMoto = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'اصطدام السيارة بالدراجة النارية')
    .reduce((acc, form) => acc + 1, 0);
  const accLeft = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'وجود عجلة او بقايا عجلة على الطريق')
    .reduce((acc, form) => acc + 1, 0);
  const accHerb = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'سقوط قرط على الطريق')
    .reduce((acc, form) => acc + 1, 0);
  const accAcc = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'اصطدام سيارتان او اكثر ')
    .reduce((acc, form) => acc + 1, 0);
  const accControl = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'عدم التحكم في السيارة')
    .reduce((acc, form) => acc + 1, 0);
  const accTired = filteredData(data, formatStartDate, formatEndDate)
    .filter((form) => form.cause == 'السياقة تحت تأثير التعب و الإرهاق')
    .reduce((acc, form) => acc + 1, 0);

  const sumInjurCause = injurTired + injurMoto + injurPanne + injurOut + injurTurn + injurMan + injurTruck + injurWet + injurSleep + injurVitesse + injurAcc + injurAnimal + injurAtt + injurBehind + injurCar + injurControl + injurDouble + injurDrunk + injurEclat + injurHerb + injurHole + injurLeft;
  const sumAccCause = accVitesse + accEclat + accSleep + accDouble + accDrunk + accWet + accAtt + accHole + accTruck + accAnimal + accMan + accTurn + accOut + accCar + accPanne + accBehind + accMoto + accLeft + accHerb + accAcc + accControl + accTired;
  const sumDeadCause = deadVitesse + deadEclat + deadSleep + deadDouble + deadDrunk + deadWet + deadAtt + deadHole + deadTruck + deadAnimal + deadMan + deadTurn + deadOut + deadCar + deadPanne + deadBehind + deadMoto + deadLeft + deadHerb + deadAcc + deadControl + deadTired;




  const injurOne = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 0 && form.hours < 1)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwo = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=>form.hours >= 1 && form.hours < 2)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurThree = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 2 && form.hours < 3)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurFour = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 3 && form.hours < 4)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurFive = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 4 && form.hours < 5)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSix = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 5 && form.hours < 6)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSeven = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 6 && form.hours < 7)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurEight = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 7 && form.hours < 8)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurNine = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 8 && form.hours < 9)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 9 && form.hours < 10)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurEleven = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 10 && form.hours < 11)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwelve = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 11 && form.hours < 12)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurThirteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 12 && form.hours < 13)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurForteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 13 && form.hours < 14)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurFifteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 14 && form.hours < 15)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSixteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 15 && form.hours < 16)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurSeventeen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 16 && form.hours < 17)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurEighteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 17 && form.hours < 18)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurNineteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 18 && form.hours < 19)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwenty = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 19 && form.hours < 20)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwentyone = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 20 && form.hours < 21)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwentytwo = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 21 && form.hours < 22)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwentythree = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 22 && form.hours < 23)
  .reduce((acc, form) => acc + form.nbrblesse, 0);
  const injurTwentyzero = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 23)
  .reduce((acc, form) => acc + form.nbrblesse, 0);


  const deadOne = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 0 && form.hours < 1)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwo = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=>form.hours >= 1 && form.hours < 2)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadThree = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 2 && form.hours < 3)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadFour = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 3 && form.hours < 4)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadFive = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 4 && form.hours < 5)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSix = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 5 && form.hours < 6)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSeven = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 6 && form.hours < 7)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadEight = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 7 && form.hours < 8)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadNine = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 8 && form.hours < 9)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 9 && form.hours < 10)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadEleven = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 10 && form.hours < 11)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwelve = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 11 && form.hours < 12)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadThirteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 12 && form.hours < 13)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadForteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 13 && form.hours < 14)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadFifteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 14 && form.hours < 15)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSixteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 15 && form.hours < 16)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadSeventeen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 16 && form.hours < 17)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadEighteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 17 && form.hours < 18)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadNineteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 18 && form.hours < 19)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwenty = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 19 && form.hours < 20)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwentyone = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 20 && form.hours < 21)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwentytwo = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 21 && form.hours < 22)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwentythree = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 22 && form.hours < 23)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  const deadTwentyzero = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 23)
  .reduce((acc, form) => acc + form.nbrmort, 0);
  

  const accOne = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 0 && form.hours < 1)
  .reduce((acc, form) => acc + 1, 0);
  const accTwo = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=>form.hours >= 1 && form.hours < 2)
  .reduce((acc, form) => acc + 1, 0);
  const accThree = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 2 && form.hours < 3)
  .reduce((acc, form) => acc + 1, 0);
  const accFour = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 3 && form.hours < 4)
  .reduce((acc, form) => acc + 1, 0);
  const accFive = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 4 && form.hours < 5)
  .reduce((acc, form) => acc + 1, 0);
  const accSix = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 5 && form.hours < 6)
  .reduce((acc, form) => acc + 1, 0);
  const accSeven = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 6 && form.hours < 7)
  .reduce((acc, form) => acc + 1, 0);
  const accEight = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 7 && form.hours < 8)
  .reduce((acc, form) => acc + 1, 0);
  const accNine = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 8 && form.hours < 9)
  .reduce((acc, form) => acc + 1, 0);
  const accTen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 9 && form.hours < 10)
  .reduce((acc, form) => acc + 1, 0);
  const accEleven = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 10 && form.hours < 11)
  .reduce((acc, form) => acc + 1, 0);
  const accTwelve = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 11 && form.hours < 12)
  .reduce((acc, form) => acc + 1, 0);
  const accThirteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 12 && form.hours < 13)
  .reduce((acc, form) => acc + 1, 0);
  const accForteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 13 && form.hours < 14)
  .reduce((acc, form) => acc + 1, 0);
  const accFifteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 14 && form.hours < 15)
  .reduce((acc, form) => acc + 1, 0);
  const accSixteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 15 && form.hours < 16)
  .reduce((acc, form) => acc + 1, 0);
  const accSeventeen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 16 && form.hours < 17)
  .reduce((acc, form) => acc + 1, 0);
  const accEighteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 17 && form.hours < 18)
  .reduce((acc, form) => acc + 1, 0);
  const accNineteen = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 18 && form.hours < 19)
  .reduce((acc, form) => acc + 1, 0);
  const accTwenty = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 19 && form.hours < 20)
  .reduce((acc, form) => acc + 1, 0);
  const accTwentyone = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 20 && form.hours < 21)
  .reduce((acc, form) => acc + 1, 0);
  const accTwentytwo = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 21 && form.hours < 22)
  .reduce((acc, form) => acc + 1, 0);
  const accTwentythree = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 22 && form.hours < 23)
  .reduce((acc, form) => acc + 1, 0);
  const accTwentyzero = filteredData(data, formatStartDate, formatEndDate)
  .filter((form)=> form.hours >= 23)
  .reduce((acc, form) => acc + 1, 0);
  
  
  
  


  const sumInjurHoraire= injurOne+injurTwo+injurThree+injurFour+injurFive+injurSix+injurSeven+injurEight+injurNine+injurTen+injurEleven+injurTwelve+injurThirteen+injurForteen+injurFifteen+injurSixteen+injurSeventeen+injurEighteen+injurNineteen+injurTwenty+injurTwentyone+injurTwentytwo+injurTwentythree+injurTwentyzero;
  const sumAccHoraire= accOne+accTwo+accThree+accFour+accFive+accSix+accSeven+accEight+accNine+accTen+accEleven+accTwelve+accThirteen+accForteen+accFifteen+accSixteen+accSeventeen+accEighteen+accNineteen+accTwenty+accTwentyone+accTwentytwo+accTwentythree+accTwentyzero;
  const sumDeadHoraire=deadOne+deadTwo+deadThree+deadFour+deadFive+deadSix+deadSeven+deadEight+deadNine+deadTen+deadEleven+deadTwelve+deadThirteen+deadForteen+deadFifteen+deadSixteen+deadSeventeen+deadEighteen+deadNineteen+deadTwenty+deadTwentyone+deadTwentytwo+deadTwentythree+deadTwentyzero;




  const injurMonday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الأثنين')
  .reduce((acc, form) => acc + form.nbrblesse, 0);
const injurTuesday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الثلاثاء')
  .reduce((acc, form) => acc + form.nbrblesse, 0);
const injurWednesday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الأربعاء')
  .reduce((acc, form) => acc + form.nbrblesse, 0);
const injurThursday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الخميس')
  .reduce((acc, form) => acc + form.nbrblesse, 0);
const injurFriday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الجمعه')
  .reduce((acc, form) => acc + form.nbrblesse, 0);
const injurSaturday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'السبت')
  .reduce((acc, form) => acc + form.nbrblesse, 0);
const injurSunday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الأحد')
  .reduce((acc, form) => acc + form.nbrblesse, 0);
const deadMonday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الأثنين')
  .reduce((acc, form) => acc + form.nbrmort, 0);
const deadTuesday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الثلاثاء')
  .reduce((acc, form) => acc + form.nbrmort, 0);
const deadWednesday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الأربعاء')
  .reduce((acc, form) => acc + form.nbrmort, 0);
const deadThursday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الخميس')
  .reduce((acc, form) => acc + form.nbrmort, 0);
const deadFriday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الجمعه')
  .reduce((acc, form) => acc + form.nbrmort, 0);
const deadSaturday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'السبت')
  .reduce((acc, form) => acc + form.nbrmort, 0);
const deadSunday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الأحد')
  .reduce((acc, form) => acc + form.nbrmort, 0);
const accMonday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الأثنين')
  .reduce((acc, form) => acc + 1, 0);
const accTuesday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الثلاثاء')
  .reduce((acc, form) => acc + 1, 0);
const accWednesday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الأربعاء')
  .reduce((acc, form) => acc + 1, 0);
const accThursday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الخميس')
  .reduce((acc, form) => acc + 1, 0);
const accFriday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الجمعه')
  .reduce((acc, form) => acc + 1, 0);
const accSaturday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'السبت')
  .reduce((acc, form) => acc + 1, 0);
const accSunday = filteredData(data, formatStartDate, formatEndDate)
  .filter((form) => form.day == 'الأحد')
  .reduce((acc, form) => acc + 1, 0);

const sumInjurSemaine = injurMonday + injurTuesday + injurWednesday + injurThursday + injurFriday + injurSaturday + injurSunday;
const sumAccSemaine = accMonday + accTuesday + accWednesday + accThursday + accFriday + accSaturday + accSunday;
const sumDeadSemaine = deadMonday + deadTuesday + deadWednesday + deadThursday + deadFriday + deadSaturday + deadSunday;
console.log(directions[1],directions[2]);

// const regionDirectionSense = (currentUserDistrict) => {
//   switch (currentUserDistrict) {
//     case "sfax":
//       return ["اتجاه تونس", "اتجاه صخيرة"];
//     case "gabes":
//       return ["اتجاه قابس", "اتجاه صفاقس"];
//     default:
//       return "";
//   }
// };

const sense = regionDirections(effectiveDistrict, effectiveAuto);
let stats = {};
console.log(sense);

if (Array.isArray(sense)) {

  sense.forEach((direction) => {
    const formsInDirection = filteredData(data, formatStartDate, formatEndDate).filter((form) => form.sens === direction);

    stats[direction] = {
      injured: formsInDirection.reduce((sum, form) => sum + form.nbrblesse, 0),
      dead: formsInDirection.reduce((sum, form) => sum + form.nbrmort, 0),
      accidents: formsInDirection.length,
    };
  });

  // Example access:
  // stats["اتجاه تونس"].injured
  // stats["اتجاه صخيرة"].dead
  // stats["اتجاه صفاقس"].injured
  // stats["اتجاه قابس"].dead
  // console.log("Total : ",stats[sense[0]].accidents);
  // console.log("Total : ",stats[sense[1]].accidents);
  // console.log(stats[sense[0]].injured);
  // console.log(stats[sense[1]].injured);
  // console.log(stats[sense[0]].dead);
  // console.log(stats[sense[1]].dead);
} else {
  console.log("Directions non disponibles");
}






// const sumInjurSense = injurGabes + injurSfax;
// const sumAccSense = accGabes + accSfax;
// const sumDeadSense = deadGabes + deadSfax;



  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDistrict("");
    setSelectedAutoroute("");
  };


  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Statistics');
    
    worksheet.pageSetup = {
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };

        worksheet.mergeCells('A1:H1');
    const headerRowTitle = worksheet.getRow(1);
    headerRowTitle.getCell(1).value = '';

    worksheet.columns = [
      { header: '%جرحى', key: 'iinjuries'},
      { header: 'جرحى', key: 'injuries'},
      { header: '%موتى', key: 'ddeaths'},
      { header: 'موتى', key: 'deaths'},
      { header: '%حوادث', key: 'aaccidents'},
      { header: 'عدد حوادث', key: 'accidents'},
      { header: 'الأسباب', key: 'cause'},
    ];


    const tableHeaderRowCause = worksheet.getRow(3);
    tableHeaderRowCause.values = worksheet.columns.map(col => col.header);
    tableHeaderRowCause.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });



    worksheet.mergeCells('A2:G2');
    const headerRowCause = worksheet.getRow(2);
    const headerCellCause = headerRowCause.getCell(1);
    headerCellCause.value = `Rapport Statistique Par Cause: ${formatStartDate} - ${formatEndDate}`;
    headerCellCause.font = { bold: true };
    headerCellCause.alignment = { horizontal: 'center', vertical: 'middle' };




    worksheet.addRow({ injuries: injurVitesse, iinjuries: (injurVitesse * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadVitesse, ddeaths: (deadVitesse * 100 / sumDeadCause).toFixed(2) + '%', accidents: accVitesse, aaccidents: (accVitesse * 100 / sumAccCause).toFixed(2) + '%', cause: 'سرعة فائقة' });
    worksheet.addRow({ injuries: injurEclat, iinjuries: (injurEclat * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadEclat, ddeaths: (deadEclat * 100 / sumDeadCause).toFixed(2) + '%', accidents: accEclat, aaccidents: (accEclat * 100 / sumAccCause).toFixed(2) + '%', cause: 'انشطار اطار العجلة' });
    worksheet.addRow({ injuries: injurSleep, iinjuries: (injurSleep * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadSleep, ddeaths: (deadSleep * 100 / sumDeadCause).toFixed(2) + '%', accidents: accSleep, aaccidents: (accSleep * 100 / sumAccCause).toFixed(2) + '%', cause: 'نعاس' });
    worksheet.addRow({ injuries: injurDouble, iinjuries: (injurDouble * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadDouble, ddeaths: (deadDouble * 100 / sumDeadCause).toFixed(2) + '%', accidents: accDouble, aaccidents: (accDouble * 100 / sumAccCause).toFixed(2) + '%', cause: 'مجاوزة فجئية' });
    worksheet.addRow({ injuries: injurDrunk, iinjuries: (injurDrunk * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadDrunk, ddeaths: (deadDrunk * 100 / sumDeadCause).toFixed(2) + '%', accidents: accDrunk, aaccidents: (accDrunk * 100 / sumAccCause).toFixed(2) + '%', cause: 'سياقة في حالة سكر' });
    worksheet.addRow({ injuries: injurWet, iinjuries: (injurWet * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadWet, ddeaths: (deadWet * 100 / sumDeadCause).toFixed(2) + '%', accidents: accWet, aaccidents: (accWet * 100 / sumAccCause).toFixed(2) + '%', cause: 'طريق مبلل' });
    worksheet.addRow({ injuries: injurAtt, iinjuries: (injurAtt * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadAtt, ddeaths: (deadAtt * 100 / sumDeadCause).toFixed(2) + '%', accidents: accAtt, aaccidents: (accAtt * 100 / sumAccCause).toFixed(2) + '%', cause: 'عدم انتباه' });
    worksheet.addRow({ injuries: injurHole, iinjuries: (injurHole * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadHole, ddeaths: (deadHole * 100 / sumDeadCause).toFixed(2) + '%', accidents: accHole, aaccidents: (accHole * 100 / sumAccCause).toFixed(2) + '%', cause: 'وجود حفرة وسط الطريق' });
    worksheet.addRow({ injuries: injurTruck, iinjuries: (injurTruck * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadTruck, ddeaths: (deadTruck * 100 / sumDeadCause).toFixed(2) + '%', accidents: accTruck, aaccidents: (accTruck * 100 / sumAccCause).toFixed(2) + '%', cause: 'انقلاب الشاحنة' });
    worksheet.addRow({ injuries: injurAnimal, iinjuries: (injurAnimal * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadAnimal, ddeaths: (deadAnimal * 100 / sumDeadCause).toFixed(2) + '%', accidents: accAnimal, aaccidents: (accAnimal * 100 / sumAccCause).toFixed(2) + '%', cause: 'حيوان على الطريق السيارة' });
    worksheet.addRow({ injuries: injurMan, iinjuries: (injurMan * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadMan, ddeaths: (deadMan * 100 / sumDeadCause).toFixed(2) + '%', accidents: accMan, aaccidents: (accMan * 100 / sumAccCause).toFixed(2) + '%', cause: 'مترجل على الطريق السيارة' });
    worksheet.addRow({ injuries: injurTurn, iinjuries: (injurTurn * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadTurn, ddeaths: (deadTurn * 100 / sumDeadCause).toFixed(2) + '%', accidents: accTurn, aaccidents: (accTurn * 100 / sumAccCause).toFixed(2) + '%', cause: 'الدوران في الإتجاه المعاكس' });
    worksheet.addRow({ injuries: injurOut, iinjuries: (injurOut * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadOut, ddeaths: (deadOut * 100 / sumDeadCause).toFixed(2) + '%', accidents: accOut, aaccidents: (accOut * 100 / sumAccCause).toFixed(2) + '%', cause: 'الخروج من فتحة عشوائية' });
    worksheet.addRow({ injuries: injurCar, iinjuries: (injurCar * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadCar, ddeaths: (deadCar * 100 / sumDeadCause).toFixed(2) + '%', accidents: accCar, aaccidents: (accCar * 100 / sumAccCause).toFixed(2) + '%', cause: 'اصطدام سيارة باخرى رابظة على طرف الطريق' });
    worksheet.addRow({ injuries: injurPanne, iinjuries: (injurPanne * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadPanne, ddeaths: (deadPanne * 100 / sumDeadCause).toFixed(2) + '%', accidents: accPanne, aaccidents: (accPanne * 100 / sumAccCause).toFixed(2) + '%', cause: 'عطب مكانيكي/ عطب كهربائي' });
    worksheet.addRow({ injuries: injurBehind, iinjuries: (injurBehind * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadBehind, ddeaths: (deadBehind * 100 / sumDeadCause).toFixed(2) + '%', accidents: accBehind, aaccidents: (accBehind * 100 / sumAccCause).toFixed(2) + '%', cause: 'مضايقة من الخلف' });
    worksheet.addRow({ injuries: injurMoto, iinjuries: (injurMoto * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadMoto, ddeaths: (deadMoto * 100 / sumDeadCause).toFixed(2) + '%', accidents: accMoto, aaccidents: (accMoto * 100 / sumAccCause).toFixed(2) + '%', cause: 'اصطدام السيارة بالدراجة النارية' });
    worksheet.addRow({ injuries: injurLeft, iinjuries: (injurLeft * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadLeft, ddeaths: (deadLeft * 100 / sumDeadCause).toFixed(2) + '%', accidents: accLeft, aaccidents: (accLeft * 100 / sumAccCause).toFixed(2) + '%', cause: 'وجود عجلة او بقايا عجلة على الطريق' });
    worksheet.addRow({ injuries: injurHerb, iinjuries: (injurHerb * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadHerb, ddeaths: (deadHerb * 100 / sumDeadCause).toFixed(2) + '%', accidents: accHerb, aaccidents: (accHerb * 100 / sumAccCause).toFixed(2) + '%', cause: 'سقوط قرط على الطريق' });
    worksheet.addRow({ injuries: injurAcc, iinjuries: (injurAcc * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadAcc, ddeaths: (deadAcc * 100 / sumDeadCause).toFixed(2) + '%', accidents: accAcc, aaccidents: (accAcc * 100 / sumAccCause).toFixed(2) + '%', cause: 'اصطدام سيارتان او اكثر' });
    worksheet.addRow({ injuries: injurControl, iinjuries: (injurControl * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadControl, ddeaths: (deadControl * 100 / sumDeadCause).toFixed(2) + '%', accidents: accControl, aaccidents: (accControl * 100 / sumAccCause).toFixed(2) + '%', cause: 'عدم التحكم في السيارة' });
    worksheet.addRow({ injuries: injurTired, iinjuries: (injurTired * 100 / sumInjurCause).toFixed(2) + '%', deaths: deadTired, ddeaths: (deadTired * 100 / sumDeadCause).toFixed(2) + '%', accidents: accTired, aaccidents: (accTired * 100 / sumAccCause).toFixed(2) + '%', cause: 'السياقة تحت تأثير التعب و الإرهاق' });
    worksheet.addRow({ injuries: sumInjurCause, iinjuries: '', deaths: sumDeadCause, ddeaths: '', accidents: sumAccCause, aaccidents: '', cause: 'الاجمالي' });




    const borderStyleCause = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = borderStyleCause;
      });
    });


    const chartAccCanvasCause = await html2canvas(chartAccRefCause.current);
    const chartAccImageCause = chartAccCanvasCause.toDataURL('image/png');
    const chartInjurCanvasCause = await html2canvas(chartInjurRefCause.current);
    const chartInjurImageCause = chartInjurCanvasCause.toDataURL('image/png');

    const accImageIdCause = workbook.addImage({
      base64: chartAccImageCause,
      extension: 'png',
    });
    const injurImageIdCause = workbook.addImage({
      base64: chartInjurImageCause,
      extension: 'png',
    });
    worksheet.addImage(accImageIdCause, 'A34:M59');
    worksheet.addImage(injurImageIdCause, 'A68:M94');


    worksheet.columns = [
      { header: '%جرحى', key: 'iinjuries'},
      { header: 'جرحى', key: 'injuries'},
      { header: '%موتى', key: 'ddeaths'},
      { header: 'موتى', key: 'deaths'},
      { header: '%حوادث', key: 'aaccidents'},
      { header: 'عدد حوادث', key: 'accidents'},
      { header: 'الساعة', key: 'cause'},
    ];
    
    const tableHeaderRowHoraire = worksheet.getRow(104);
    tableHeaderRowHoraire.values = worksheet.columns.map(col => col.header);
    tableHeaderRowHoraire.eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
});

worksheet.mergeCells('A103:G103');
const headerRowHoraire = worksheet.getRow(103);
const headerCellHoraire = headerRowHoraire.getCell(1);
headerCellHoraire.value = `Rapport Statistique Par Horaire: ${formatStartDate} - ${formatEndDate}`;
headerCellHoraire.font = { bold: true };
headerCellHoraire.alignment = { horizontal: 'center', vertical: 'middle' };


    worksheet.addRow({ injuries: injurOne, iinjuries: (injurOne * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadOne, ddeaths: (deadOne * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accOne, aaccidents: (accOne * 100 / sumAccHoraire).toFixed(2) + '%', cause: '0h00 - 1h00' });
    worksheet.addRow({ injuries: injurTwo, iinjuries: (injurTwo * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadTwo, ddeaths: (deadTwo * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accTwo, aaccidents: (accTwo * 100 / sumAccHoraire).toFixed(2) + '%', cause: '1h00 - 2h00' });
    worksheet.addRow({ injuries: injurThree, iinjuries: (injurThree * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadThree, ddeaths: (deadThree * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accThree, aaccidents: (accThree * 100 / sumAccHoraire).toFixed(2) + '%', cause: '2h00 - 3h00' });
    worksheet.addRow({ injuries: injurFour, iinjuries: (injurFour * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadFour, ddeaths: (deadFour * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accFour, aaccidents: (accFour * 100 / sumAccHoraire).toFixed(2) + '%', cause: '3h00 - 4h00' });
    worksheet.addRow({ injuries: injurFive, iinjuries: (injurFive * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadFive, ddeaths: (deadFive * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accFive, aaccidents: (accFive * 100 / sumAccHoraire).toFixed(2) + '%', cause: '4h00 - 5h00' });
    worksheet.addRow({ injuries: injurSix, iinjuries: (injurSix * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadSix, ddeaths: (deadSix * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accSix, aaccidents: (accSix * 100 / sumAccHoraire).toFixed(2) + '%', cause: '5h00 - 6h00' });
    worksheet.addRow({ injuries: injurSeven, iinjuries: (injurSeven * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadSeven, ddeaths: (deadSeven * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accSeven, aaccidents: (accSeven * 100 / sumAccHoraire).toFixed(2) + '%', cause: '6h00 - 7h00' });
    worksheet.addRow({ injuries: injurEight, iinjuries: (injurEight * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadEight, ddeaths: (deadEight * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accEight, aaccidents: (accEight * 100 / sumAccHoraire).toFixed(2) + '%', cause: '7h00 - 8h00' });
    worksheet.addRow({ injuries: injurNine, iinjuries: (injurNine * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadNine, ddeaths: (deadNine * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accNine, aaccidents: (accNine * 100 / sumAccHoraire).toFixed(2) + '%', cause: '8h00 - 9h00' });
    worksheet.addRow({ injuries: injurTen, iinjuries: (injurTen * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadTen, ddeaths: (deadTen * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accTen, aaccidents: (accTen * 100 / sumAccHoraire).toFixed(2) + '%', cause: '9h00 - 10h00' });
    worksheet.addRow({ injuries: injurEleven, iinjuries: (injurEleven * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadEleven, ddeaths: (deadEleven * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accEleven, aaccidents: (accEleven * 100 / sumAccHoraire).toFixed(2) + '%', cause: '10h00 - 11h00' });
    worksheet.addRow({ injuries: injurTwelve, iinjuries: (injurTwelve * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadTwelve, ddeaths: (deadTwelve * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accTwelve, aaccidents: (accTwelve * 100 / sumAccHoraire).toFixed(2) + '%', cause: '11h00 - 12h00' });
    worksheet.addRow({ injuries: injurThirteen, iinjuries: (injurThirteen * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadThirteen, ddeaths: (deadThirteen * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accThirteen, aaccidents: (accThirteen * 100 / sumAccHoraire).toFixed(2) + '%', cause: '12h00 - 13h00' });
    worksheet.addRow({ injuries: injurForteen, iinjuries: (injurForteen * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadForteen, ddeaths: (deadForteen * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accForteen, aaccidents: (accForteen * 100 / sumAccHoraire).toFixed(2) + '%', cause: '13h00 - 14h00' });
    worksheet.addRow({ injuries: injurFifteen, iinjuries: (injurFifteen * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadFifteen, ddeaths: (deadFifteen * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accFifteen, aaccidents: (accFifteen * 100 / sumAccHoraire).toFixed(2) + '%', cause: '14h00 - 15h00' });
    worksheet.addRow({ injuries: injurSixteen, iinjuries: (injurSixteen * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadSixteen, ddeaths: (deadSixteen * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accSixteen, aaccidents: (accSixteen * 100 / sumAccHoraire).toFixed(2) + '%', cause: '15h00 - 16h00' });
    worksheet.addRow({ injuries: injurSeventeen, iinjuries: (injurSeventeen * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadSeventeen, ddeaths: (deadSeventeen * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accSeventeen, aaccidents: (accSeventeen * 100 / sumAccHoraire).toFixed(2) + '%', cause: '16h00 - 17h00' });
    worksheet.addRow({ injuries: injurEighteen, iinjuries: (injurEighteen * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadEighteen, ddeaths: (deadEighteen * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accEighteen, aaccidents: (accEighteen * 100 / sumAccHoraire).toFixed(2) + '%', cause: '17h00 - 18h00' });
    worksheet.addRow({ injuries: injurNineteen, iinjuries: (injurNineteen * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadNineteen, ddeaths: (deadNineteen * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accNineteen, aaccidents: (accNineteen * 100 / sumAccHoraire).toFixed(2) + '%', cause: '18h00 - 19h00' });
    worksheet.addRow({ injuries: injurTwenty, iinjuries: (injurTwenty * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadTwenty, ddeaths: (deadTwenty * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accTwenty, aaccidents: (accTwenty * 100 / sumAccHoraire).toFixed(2) + '%', cause: '19h00 - 20h00' });
    worksheet.addRow({ injuries: injurTwentyone, iinjuries: (injurTwentyone * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadTwentyone, ddeaths: (deadTwentyone * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accTwentyone, aaccidents: (accTwentyone * 100 / sumAccHoraire).toFixed(2) + '%', cause: '20h00 - 21h00' });
    worksheet.addRow({ injuries: injurTwentytwo, iinjuries: (injurTwentytwo * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadTwentytwo, ddeaths: (deadTwentytwo * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accTwentytwo, aaccidents: (accTwentytwo * 100 / sumAccHoraire).toFixed(2) + '%', cause: '21h00 - 22h00' });
    worksheet.addRow({ injuries: injurTwentythree, iinjuries: (injurTwentythree * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadTwentythree, ddeaths: (deadTwentythree * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accTwentythree, aaccidents: (accTwentythree * 100 / sumAccHoraire).toFixed(2) + '%', cause: '22h00 - 23h00' });
    worksheet.addRow({ injuries: injurTwentyzero, iinjuries: (injurTwentyzero * 100 / sumInjurHoraire).toFixed(2) + '%', deaths: deadTwentyzero, ddeaths: (deadTwentyzero * 100 / sumDeadHoraire).toFixed(2) + '%', accidents: accTwentyzero, aaccidents: (accTwentyzero * 100 / sumAccHoraire).toFixed(2) + '%', cause: '23h00 - 00h00' });
    worksheet.addRow({ injuries: sumInjurHoraire, iinjuries: '', deaths: sumDeadHoraire, ddeaths: '', accidents: sumAccHoraire, aaccidents: '', cause: 'الاجمالي' });
    
    

    const borderStyleHoraire = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = borderStyleHoraire;
      });
    });
    
    
    const chartAccCanvasHoraire = await html2canvas(chartAccRefHoraire.current);
    const chartAccImagehoraire = chartAccCanvasHoraire.toDataURL('image/png');
    const chartInjurCanvasHoraire = await html2canvas(chartInjurRefHoraire.current);
    const chartInjurImageHoraire = chartInjurCanvasHoraire.toDataURL('image/png');

    const accImageIdHoraire = workbook.addImage({
      base64: chartAccImagehoraire,
      extension: 'png',
    });
    const injurImageIdHoraire = workbook.addImage({
      base64: chartInjurImageHoraire,
      extension: 'png',
    });


    worksheet.addImage(accImageIdHoraire, 'A134:M161');
    worksheet.addImage(injurImageIdHoraire, 'A167:M193');

    worksheet.columns = [
        { header: '%جرحى', key: 'iinjuries'},
        { header: 'جرحى', key: 'injuries'},
        { header: '%موتى', key: 'ddeaths'},
        { header: 'موتى', key: 'deaths'},
        { header: '%حوادث', key: 'aaccidents'},
        { header: 'عدد حوادث', key: 'accidents'},
        { header: 'المكان', key: 'cause'},
        { header: 'الاتجاه', key: 'direction'},
    ];


    const tableHeaderRowLieu = worksheet.getRow(201);
    tableHeaderRowLieu.values = worksheet.columns.map(col => col.header);
    tableHeaderRowLieu.eachCell(cell => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    worksheet.mergeCells('A200:G200');
    const headerRowLieu = worksheet.getRow(200);
    const headerCellLieu = headerRowLieu.getCell(1);
    headerCellLieu.value = `Rapport Statistique Par Lieu: ${formatStartDate} - ${formatEndDate}`;
    headerCellLieu.font = { bold: true };
    headerCellLieu.alignment = { horizontal: 'center', vertical: 'middle' };


    worksheet.addRow({ injuries: injurTwenty, iinjuries: (injurTwentyLieu * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadTwentyLieu, ddeaths: (deadTwentyLieu * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accTwenty, aaccidents: (accTwentyLieu * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 317  الى  ن.ك 327',direction:regionDirections(currentUserDistrict,currentUserAuto)[0]});
    worksheet.addRow({ injuries: injurThirty, iinjuries: (injurThirty * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadThirty, ddeaths: (deadThirty * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accThirty, aaccidents: (accThirty * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 327  الى  ن.ك 337' });
    worksheet.addRow({ injuries: injurForty, iinjuries: (injurForty * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadForty, ddeaths: (deadForty * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accForty, aaccidents: (accForty * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 337  الى  ن.ك 347' });
    worksheet.addRow({ injuries: injurFifty, iinjuries: (injurFifty * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadFifty, ddeaths: (deadFifty * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accFifty, aaccidents: (accFifty * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 347  الى  ن.ك 357' });
    worksheet.addRow({ injuries: injurSixty, iinjuries: (injurSixty * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadSixty, ddeaths: (deadSixty * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accSixty, aaccidents: (accSixty * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 357  الى  ن.ك 367' });
    worksheet.addRow({ injuries: injurSeventy, iinjuries: (injurSeventy * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadSeventy, ddeaths: (deadSeventy * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accSeventy, aaccidents: (accSeventy * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 367  الى  ن.ك 377' });
    worksheet.addRow({ injuries: injurEighty, iinjuries: (injurEighty * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadEighty, ddeaths: (deadEighty * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accEighty, aaccidents: (accEighty * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 377  الى  ن.ك 387' });
    worksheet.addRow({ injuries: injurNinety, iinjuries: (injurNinety * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadNinety, ddeaths: (deadNinety * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accNinety, aaccidents: (accNinety * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 387  الى  ن.ك 391' });
    worksheet.addRow({ injuries: injurTwentyy, iinjuries: (injurTwentyy * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadTwentyy, ddeaths: (deadTwentyy * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accTwentyy, aaccidents: (accTwentyy * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 317  الى  ن.ك 327',direction:regionDirections(currentUserDistrict,currentUserAuto)[1]});
    worksheet.addRow({ injuries: injurThirtyy, iinjuries: (injurThirtyy * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadThirtyy, ddeaths: (deadThirtyy * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accThirtyy, aaccidents: (accThirtyy * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 327  الى  ن.ك 337' });
    worksheet.addRow({ injuries: injurFortyy, iinjuries: (injurFortyy * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadFortyy, ddeaths: (deadFortyy * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accFortyy, aaccidents: (accFortyy * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 337  الى  ن.ك 347' });
    worksheet.addRow({ injuries: injurFiftyy, iinjuries: (injurFiftyy * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadFiftyy, ddeaths: (deadFiftyy * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accFiftyy, aaccidents: (accFiftyy * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 347  الى  ن.ك 357' });
    worksheet.addRow({ injuries: injurSixtyy, iinjuries: (injurSixtyy * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadSixtyy, ddeaths: (deadSixtyy * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accSixtyy, aaccidents: (accSixtyy * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 357  الى  ن.ك 367' });
    worksheet.addRow({ injuries: injurSeventyy, iinjuries: (injurSeventyy * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadSeventyy, ddeaths: (deadSeventyy * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accSeventyy, aaccidents: (accSeventyy * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 367  الى  ن.ك 377' });
    worksheet.addRow({ injuries: injurEightyy, iinjuries: (injurEightyy * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadEightyy, ddeaths: (deadEightyy * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accEightyy, aaccidents: (accEightyy * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 377  الى  ن.ك 387' });
    worksheet.addRow({ injuries: injurNinetyy, iinjuries: (injurNinetyy * 100 / sumInjurLieu).toFixed(2) + '%', deaths: deadNinetyy, ddeaths: (deadNinetyy * 100 / sumDeadLieu).toFixed(2) + '%', accidents: accNinetyy, aaccidents: (accNinetyy * 100 / sumAccLieu).toFixed(2) + '%', cause: 'من  ن.ك 387  الى  ن.ك 391' });
    worksheet.addRow({ injuries: sumInjurLieu, iinjuries: '', deaths: sumDeadLieu, ddeaths: '', accidents: sumAccLieu, aaccidents: '', cause: 'الاجمالي' });
    worksheet.mergeCells('H202:H209'); 
    worksheet.mergeCells('H210:H217');


    const borderStyleLieu = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.border = borderStyleLieu;
        });
    });


    const chartAccCanvasLieu = await html2canvas(chartAccRefLieu.current);
    const chartAccImageLieu = chartAccCanvasLieu.toDataURL('image/png');
    const chartInjurCanvasLieu = await html2canvas(chartInjurRefLieu.current);
    const chartInjurImageLieu = chartInjurCanvasLieu.toDataURL('image/png');
    const chartInjurrCanvasLieu = await html2canvas(chartInjurReffLieu.current);
    const chartInjurrImageLieu = chartInjurrCanvasLieu.toDataURL('image/png');

    const accImageIdLieu = workbook.addImage({
        base64: chartAccImageLieu,
        extension: 'png',
    });
    const injurImageIdLieu = workbook.addImage({
        base64: chartInjurImageLieu,
        extension: 'png',
    });
    const injurrImageIdLieu = workbook.addImage({
        base64: chartInjurrImageLieu,
        extension: 'png',
    });

    worksheet.addImage(accImageIdLieu, 'A233:M259');
    worksheet.addImage(injurImageIdLieu, 'A267:M293');
    worksheet.addImage(injurrImageIdLieu, 'A301:M327');


    worksheet.columns = [
      { header: '%جرحى', key: 'iinjuries'},
      { header: 'جرحى', key: 'injuries'},
      { header: '%موتى', key: 'ddeaths'},
      { header: 'موتى', key: 'deaths'},
      { header: '%حوادث', key: 'aaccidents'},
      { header: 'عدد حوادث', key: 'accidents'},
      { header: 'أيام', key: 'days'},
    ];


    const tableHeaderRowSemaine = worksheet.getRow(336);
    tableHeaderRowSemaine.values = worksheet.columns.map(col => col.header);
    tableHeaderRowSemaine.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    worksheet.mergeCells('A335:G335');
    const headerRowSemaine = worksheet.getRow(335);
    const headerCellSemaine = headerRowSemaine.getCell(1);
    headerCellSemaine.value = `Rapport Statistique Par Semaine: ${formatStartDate} - ${formatEndDate}`;
    headerCellSemaine.font = { bold: true };
    headerCellSemaine.alignment = { horizontal: 'center', vertical: 'middle' };


    worksheet.addRow({ injuries: injurMonday, iinjuries: (injurMonday * 100 / sumInjurSemaine).toFixed(2) + '%', deaths: deadMonday, ddeaths: (deadMonday * 100 / sumDeadSemaine).toFixed(2) + '%', accidents: accMonday, aaccidents: (accMonday * 100 / sumAccSemaine).toFixed(2) + '%', days: 'الأثنين' });
    worksheet.addRow({ injuries: injurTuesday, iinjuries: (injurTuesday * 100 / sumInjurSemaine).toFixed(2) + '%', deaths: deadTuesday, ddeaths: (deadTuesday * 100 / sumDeadSemaine).toFixed(2) + '%', accidents: accTuesday, aaccidents: (accTuesday * 100 / sumAccSemaine).toFixed(2) + '%', days: 'الثلاثاء' });
    worksheet.addRow({ injuries: injurWednesday, iinjuries: (injurWednesday * 100 / sumInjurSemaine).toFixed(2) + '%', deaths: deadWednesday, ddeaths: (deadWednesday * 100 / sumDeadSemaine).toFixed(2) + '%', accidents: accWednesday, aaccidents: (accWednesday * 100 / sumAccSemaine).toFixed(2) + '%', days: 'الأربعاء' });
    worksheet.addRow({ injuries: injurThursday, iinjuries: (injurThursday * 100 / sumInjurSemaine).toFixed(2) + '%', deaths: deadThursday, ddeaths: (deadThursday * 100 / sumDeadSemaine).toFixed(2) + '%', accidents: accThursday, aaccidents: (accThursday * 100 / sumAccSemaine).toFixed(2) + '%', days: 'الخميس' });
    worksheet.addRow({ injuries: injurFriday, iinjuries: (injurFriday * 100 / sumInjurSemaine).toFixed(2) + '%', deaths: deadFriday, ddeaths: (deadFriday * 100 / sumDeadSemaine).toFixed(2) + '%', accidents: accFriday, aaccidents: (accFriday * 100 / sumAccSemaine).toFixed(2) + '%', days: 'الجمعه' });
    worksheet.addRow({ injuries: injurSaturday, iinjuries: (injurSaturday * 100 / sumInjurSemaine).toFixed(2) + '%', deaths: deadSaturday, ddeaths: (deadSaturday * 100 / sumDeadSemaine).toFixed(2) + '%', accidents: accSaturday, aaccidents: (accSaturday * 100 / sumAccSemaine).toFixed(2) + '%', days: 'السبت' });
    worksheet.addRow({ injuries: injurSunday, iinjuries: (injurSunday * 100 / sumInjurSemaine).toFixed(2) + '%', deaths: deadSunday, ddeaths: (deadSunday * 100 / sumDeadSemaine).toFixed(2) + '%', accidents: accSunday, aaccidents: (accSunday * 100 / sumAccSemaine).toFixed(2) + '%', days: 'الأحد' });
    worksheet.addRow({ injuries: sumInjurSemaine, iinjuries: '', deaths: sumDeadSemaine, ddeaths: '', accidents: sumAccSemaine, aaccidents: '', days: 'الاجمالي' });



    const borderStyleSemaine = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = borderStyleSemaine;
      });
    });


    const chartAccCanvasSemaine = await html2canvas(chartAccRefSemaine.current);
    const chartAccImageSemaine = chartAccCanvasSemaine.toDataURL('image/png');

    const accImageId = workbook.addImage({
      base64: chartAccImageSemaine,
      extension: 'png',
    });

    worksheet.addImage(accImageId, 'A365:M391');

     worksheet.columns = [
          { header: "%جرحى", key: "iinjuries"},
          { header: "جرحى", key: "injuries"},
          { header: "%موتى", key: "ddeaths"},
          { header: "موتى", key: "deaths"},
          { header: "%حوادث", key: "aaccidents"},
          { header: "عدد حوادث", key: "accidents"},
          { header: "الاتجاه", key: "direction"},
        ];
    
        const tableHeaderRow = worksheet.getRow(400);
        tableHeaderRow.values = worksheet.columns.map((col) => col.header);
        tableHeaderRow.eachCell((cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
    
        worksheet.mergeCells("A399:G399");
        const headerRow = worksheet.getRow(399);
        const headerCell = headerRow.getCell(1);
        headerCell.value = `Rapport Statistique Par Sense: ${formatStartDate} - ${formatEndDate}`;
        headerCell.font = { bold: true };
        headerCell.alignment = { horizontal: "center", vertical: "middle" };
    
        worksheet.addRow({
          injuries: stats[sense[0]].injured,
          iinjuries: ((stats[sense[0]].injured * 100) / (stats[sense[0]].injured + stats[sense[1]].injured)).toFixed(2) + "%",
          deaths: stats[sense[0]].dead,
          ddeaths: ((stats[sense[0]].dead * 100) / (stats[sense[0]].dead + stats[sense[1]].dead)).toFixed(2) + "%",
          accidents: stats[sense[0]].accidents,
          aaccidents: ((stats[sense[0]].accidents * 100) / (stats[sense[0]].accidents + stats[sense[1]].accidents)).toFixed(2) + "%",
          direction: "اتجاه قابس",
        });
        worksheet.addRow({
          injuries: stats[sense[1]].injured,
          iinjuries: ((stats[sense[1]].injured * 100) / (stats[sense[0]].injured + stats[sense[1]].injured)).toFixed(2) + "%",
          deaths: stats[sense[1]].dead,
          ddeaths: ((stats[sense[1]].dead * 100) / (stats[sense[0]].dead + stats[sense[1]].dead)).toFixed(2) + "%",
          accidents: stats[sense[1]].accidents,
          aaccidents: ((stats[sense[1]].accidents * 100) / (stats[sense[0]].accidents + stats[sense[1]].accidents)).toFixed(2) + "%",
          direction: "اتجاه صفاقس",
        });
        worksheet.addRow({
          injuries: (stats[sense[0]].injured + stats[sense[1]].injured),
          iinjuries: "",
          deaths: (stats[sense[0]].dead + stats[sense[1]].dead),
          ddeaths: "",
          accidents: (stats[sense[0]].accidents + stats[sense[1]].accidents),
          aaccidents: "",
          direction: "",
        });
    
        const borderStyleSense = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
    
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.border = borderStyleSense;
          });
        });
    
        const chartAccCanvas = await html2canvas(chartAccRefSense.current);
        const chartAccImage = chartAccCanvas.toDataURL("image/png");
        const chartInjurCanvas = await html2canvas(chartInjurRefSense.current);
        const chartInjurImage = chartInjurCanvas.toDataURL("image/png");
    
        const accImageIdSense = workbook.addImage({
          base64: chartAccImage,
          extension: "png",
        });
    
        const injurImageIdSense = workbook.addImage({
          base64: chartInjurImage,
          extension: "png",
        });
    
        worksheet.addImage(accImageIdSense, "A430:M456");
        worksheet.addImage(injurImageIdSense, "A464:M490");


    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Traffic_Statistique_ParCause.xlsx');
    });
  };




  // Peak Analysis Logic
  const getMax = (arr, key) => arr.reduce((prev, current) => (prev[key] > current[key] ? prev : current), { [key]: 0 });

  const causesData = [
    { name: 'سرعة فائقة', acc: accVitesse},
    { name: 'انشطار اطار العجلة', acc: accEclat},
    { name: 'نعاس', acc: accSleep},
    { name: 'مجاوزة فجئية', acc: accDouble},
    { name: 'سياقة في حالة سكر', acc: accDrunk},
    { name: 'طريق مبلل', acc: accWet},
    { name: 'عدم انتباه', acc: accAtt},
    { name: 'وجود حفرة', acc: accHole},
    { name: 'انقلاب شاحنة', acc: accTruck},
    { name: 'حيوان', acc: accAnimal},
    { name: 'مترجل', acc: accMan},
    { name: 'دوران عكسي', acc: accTurn},
    { name: 'خروج عشوائي', acc: accOut},
    { name: 'اصطدام بسيارة رابظة', acc: accCar},
    { name: 'عطب', acc: accPanne},
    { name: 'مضايقة خلفية', acc: accBehind},
    { name: 'دراجة نارية', acc: accMoto},
    { name: 'بقايا عجلة', acc: accLeft},
    { name: 'سقوط حمولة', acc: accHerb},
    { name: 'اصطدام متعدد', acc: accAcc},
    { name: 'عدم تحكم', acc: accControl},
    { name: 'تعب', acc: accTired},
  ];

  const daysData = [
    { name: 'الاثنين', acc: accMonday},
    { name: 'الثلاثاء', acc: accTuesday},
    { name: 'الاربعاء', acc: accWednesday},
    { name: 'الخميس', acc: accThursday},
    { name: 'الجمعة', acc: accFriday},
    { name: 'السبت', acc: accSaturday},
    { name: 'الأحد', acc: accSunday},
  ];

  const hoursData = [
    { name: '0h-1h', acc: accOne},
    { name: '1h-2h', acc: accTwo},
    { name: '2h-3h', acc: accThree},
    { name: '3h-4h', acc: accFour},
    { name: '4h-5h', acc: accFive},
    { name: '5h-6h', acc: accSix},
    { name: '6h-7h', acc: accSeven},
    { name: '7h-8h', acc: accEight},
    { name: '8h-9h', acc: accNine},
    { name: '9h-10h', acc: accTen},
    { name: '10h-11h', acc: accEleven},
    { name: '11h-12h', acc: accTwelve},
    { name: '12h-13h', acc: accThirteen},
    { name: '13h-14h', acc: accForteen},
    { name: '14h-15h', acc: accFifteen},
    { name: '15h-16h', acc: accSixteen},
    { name: '16h-17h', acc: accSeventeen},
    { name: '17h-18h', acc: accEighteen},
    { name: '18h-19h', acc: accNineteen},
    { name: '19h-20h', acc: accTwenty},
    { name: '20h-21h', acc: accTwentyone},
    { name: '21h-22h', acc: accTwentytwo},
    { name: '22h-23h', acc: accTwentythree},
    { name: '23h-00h', acc: accTwentyzero},
  ];
  const pkData = (Array.isArray(directions) && directions.length > 0)
  ? directions.slice(0, -1).map((start, i) => {
      const end = directions[i+1];
      const count = filteredData(data, formatStartDate, formatEndDate)
        .filter((form) => form.nk >= start && form.nk <= end)
        .reduce((acc, form) => acc + 1, 0);
      return { name: `${start}-${end}`, acc: count };
    })
  : [];

  const peakCauseAcc = getMax(causesData, 'acc');
  const peakDayAcc = getMax(daysData, 'acc');
  const peakHourAcc = getMax(hoursData, 'acc');
  const peakPkAcc = getMax(pkData, 'acc');
  const shouldShowAlert = peakCauseAcc.acc > 0 || peakDayAcc.acc > 0 || peakHourAcc.acc > 0 || peakPkAcc.acc > 0;




  return (
    <div className='left-right-gap'>
        {shouldShowAlert && (
          <Alert variant="danger" className="mb-4">
             <Alert.Heading style={{ textAlign: 'right' }}>:إحصائيات الذروة</Alert.Heading>
             <div style={{ textAlign: 'right', direction: 'rtl' }}>
               {peakCauseAcc.acc > 0 && <p><strong>أكثر سبب للحوادث:</strong> {peakCauseAcc.name} ({peakCauseAcc.acc} حادث)</p>}
               {peakDayAcc.acc > 0 && <p><strong>أخطر يوم:</strong> {peakDayAcc.name} ({peakDayAcc.acc} حادث)</p>}
               {peakHourAcc.acc > 0 && <p><strong>أخطر توقيت:</strong> {peakHourAcc.name} ({peakHourAcc.acc} حادث)</p>}
               {peakPkAcc.acc > 0 && <p><strong>أخطر مقطع:</strong> {peakPkAcc.name} ({peakPkAcc.acc} حادث)</p>}
             </div>
          </Alert>
        )}
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
          <div>
            <label className="datepicker-label">:اختر الطريق السيارة</label>
            <Form.Select
              onChange={handleAutorouteChange}
              value={selectedAutoroute}
              className="custom-datepicker"
            >
              <option value="">كل الطرقات</option>
              {autorouteDistrictMap && Object.keys(autorouteDistrictMap).map((auto) => (
                <option key={auto} value={auto}>
                  {auto.toUpperCase()}
                </option>
              ))}
            </Form.Select>
          </div>
          <div>
            <label className="datepicker-label">:اختر المنطقة</label>
            <Form.Select
              onChange={handleDistrictChange}
              value={selectedDistrict}
              className="custom-datepicker"
            >
              <option value="">كل المناطق</option>
              {autorouteDistrictMap && 
               (selectedAutoroute ? autorouteDistrictMap[selectedAutoroute] : Object.values(autorouteDistrictMap).flat())
               .map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </Form.Select>
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
          <h1 className='title-layout'>احصائيات حوادث المرور حسب الأسباب</h1>
            <Table striped bordered hover >
              <thead >
                <tr>
                  <th>%</th>
                  <th>جرحى </th>
                  <th>%</th>
                  <th>موتى</th>
                  <th>%</th>
                  <th>حوادث</th>
                  <th> الأسباب</th>
                </tr>
              </thead>
              {filterData(data).length === 0  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="7"><h5>الرجاء تعمير الجدول و اختيار التاريخ</h5></td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7"><h5>الرجاء اختيار التاريخ</h5></td></tr></tbody>) : startDate && endDate != null && filteredData(data,startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7"><h5>لا توجد بيانات في هذا التاريخ</h5></td></tr></tbody>) : (<tbody >
                <tr>
                  <td>%{(injurVitesse * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurVitesse}</td>
                  <td>%{(deadVitesse * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadVitesse}</td>
                  <td>%{(accVitesse * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accVitesse}</td>
                  <td>سرعة فائقة</td>
                </tr>
                <tr>
                  <td>%{(injurEclat * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurEclat}</td>
                  <td>%{(deadEclat * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadEclat}</td>
                  <td>%{(accEclat * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accEclat}</td>
                  <td>انشطار اطار العجلة</td>
                </tr>
                <tr>
                  <td>%{(injurSleep * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurSleep}</td>
                  <td>%{(deadSleep * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadSleep}</td>
                  <td>%{(accSleep * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accSleep}</td>
                  <td>نعاس</td>
                </tr>
                <tr>
                  <td>%{(injurDouble * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurDouble}</td>
                  <td>%{(deadDouble * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadDouble}</td>
                  <td>%{(accDouble * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accDouble}</td>
                  <td>مجاوزة فجئية</td>
                </tr>
                <tr>
                  <td>%{(injurDrunk * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurDrunk}</td>
                  <td>%{(deadDrunk * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadDrunk}</td>
                  <td>%{(accDrunk * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accDrunk}</td>
                  <td>سياقة في حالة سكر</td>
                </tr>
                <tr>
                  <td>%{(injurWet * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurWet}</td>
                  <td>%{(deadWet * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadWet}</td>
                  <td>%{(accWet * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accWet}</td>
                  <td>طريق مبلل</td>
                </tr>
                <tr>
                  <td>%{(injurAtt * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurAtt}</td>
                  <td>%{(deadAtt * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadAtt}</td>
                  <td>%{(accAtt * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accAtt}</td>
                  <td>عدم انتباه</td>
                </tr>
                <tr>
                  <td>%{(injurHole * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurHole}</td>
                  <td>%{(deadHole * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadHole}</td>
                  <td>%{(accHole * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accHole}</td>
                  <td>وجود حفرة وسط الطريق</td>
                </tr>
                <tr>
                  <td>%{(injurTruck * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurTruck}</td>
                  <td>%{(deadTruck * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadTruck}</td>
                  <td>%{(accTruck * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accTruck}</td>
                  <td>انقلاب الشاحنة</td>
                </tr>
                <tr>
                  <td>%{(injurAnimal * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurAnimal}</td>
                  <td>%{(deadAnimal * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadAnimal}</td>
                  <td>%{(accAnimal * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accAnimal}</td>
                  <td>حيوان على الطريق السيارة</td>
                </tr>
                <tr>
                  <td>%{(injurMan * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurMan}</td>
                  <td>%{(deadMan * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadMan}</td>
                  <td>%{(accMan * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accMan}</td>
                  <td>مترجل على الطريق السيارة</td>
                </tr>
                <tr>
                  <td>%{(injurTurn * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurTurn}</td>
                  <td>%{(deadTurn * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadTurn}</td>
                  <td>%{(accTurn * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accTurn}</td>
                  <td>الدوران في الإتجاه المعاكس</td>
                </tr>
                <tr>
                  <td>%{(injurOut * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurOut}</td>
                  <td>%{(deadOut * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadOut}</td>
                  <td>%{(accOut * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accOut}</td>
                  <td>الخروج من فتحة عشوائية</td>
                </tr>
                <tr>
                  <td>%{(injurCar * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurCar}</td>
                  <td>%{(deadCar * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadCar}</td>
                  <td>%{(accCar * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accCar}</td>
                  <td>اصطدام سيارة باخرى رابظة على طرف الطريق</td>
                </tr>
                <tr>
                  <td>%{(injurPanne * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurPanne}</td>
                  <td>%{(deadPanne * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadPanne}</td>
                  <td>%{(accPanne * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accPanne}</td>
                  <td>عطب مكانيكي/ عطب كهربائي</td>
                </tr>
                <tr>
                  <td>%{(injurBehind * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurBehind}</td>
                  <td>%{(deadBehind * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadBehind}</td>
                  <td>%{(accBehind * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accBehind}</td>
                  <td>مضايقة من الخلف</td>
                </tr>
                <tr>
                  <td>%{(injurMoto * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurMoto}</td>
                  <td>%{(deadMoto * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadMoto}</td>
                  <td>%{(accMoto * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accMoto}</td>
                  <td>اصطدام السيارة بالدراجة النارية</td>
                </tr>
                <tr>
                  <td>%{(injurLeft * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurLeft}</td>
                  <td>%{(deadLeft * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadLeft}</td>
                  <td>%{(accLeft * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accLeft}</td>
                  <td>وجود عجلة او بقايا عجلة على الطريق</td>
                </tr>
                <tr>
                  <td>%{(injurHerb * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurHerb}</td>
                  <td>%{(deadHerb * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadHerb}</td>
                  <td>%{(accHerb * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accHerb}</td>
                  <td>سقوط قرط على الطريق</td>
                </tr>
                <tr>
                  <td>%{(injurAcc * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurAcc}</td>
                  <td>%{(deadAcc * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadAcc}</td>
                  <td>%{(accAcc * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accAcc}</td>
                  <td>اصطدام سيارتان او اكثر</td>
                </tr>
                <tr>
                  <td>%{(injurControl * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurControl}</td>
                  <td>%{(deadControl * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadControl}</td>
                  <td>%{(accControl * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accControl}</td>
                  <td>عدم التحكم في السيارة</td>
                </tr>
                <tr>
                  <td>%{(injurTired * 100 / sumInjurCause).toFixed(2)}</td>
                  <td>{injurTired}</td>
                  <td>%{(deadTired * 100 / sumDeadCause).toFixed(2)}</td>
                  <td>{deadTired}</td>
                  <td>%{(accTired * 100 / sumAccCause).toFixed(2)}</td>
                  <td>{accTired}</td>
                  <td>السياقة تحت تأثير التعب و الإرهاق</td>
                </tr>
                <tr>
                  <td></td>
                  <td>{sumInjurCause}</td>
                  <td></td>
                  <td>{sumDeadCause}</td>
                  <td></td>
                  <td>{sumAccCause}</td>
                  <td>الاجمالي</td>
                </tr>
              </tbody>)}

            </Table>
            <div> {(!startDate || !endDate) ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(data, startDate, endDate).length === 0 ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>لا توجد بيانات في هذا التاريخ</h3>) : (
              <div>
                <div ref={chartAccRefCause}>
                  <Bar
                    data={{
                      labels: ['سرعة فائقة', 'انشطار اطار العجلة', 'نعاس', 'مجاوزة فجئية', 'سياقة في حالة سكر', 'طريق مبلل', 'عدم انتباه', 'وجود حفرة وسط الطريق', 'انقلاب الشاحنة', 'حيوان على الطريق السيارة', 'مترجل على الطريق السيارة', 'الدوران في الإتجاه المعاكس', 'الخروج من فتحة عشوائية', 'اصطدام سيارة باخرى رابظة على طرف الطريق', 'عطب مكانيكي/ عطب كهربائي', 'مضايقة من الخلف', 'اصطدام السيارة بالدراجة النارية', 'وجود عجلة او بقايا عجلة على الطريق', 'سقوط قرط على الطريق', 'اصطدام سيارتان او اكثر', 'عدم التحكم في السيارة', 'السياقة تحت تأثير التعب و الإرهاق'],
                      datasets: [

                        {
                          label: ['حوادث'],
                          data: [accVitesse, accEclat, accSleep, accDouble, accDrunk, accWet, accAtt, accHole, accTruck, accAnimal, accMan, accTurn, accOut, accCar, accPanne, accBehind, accMoto, accLeft, accHerb, accAcc, accControl, accTired],
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
                        title: { display: true, text: 'عدد الحواث حسب الاسباب', font: { size: 40 } },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "عدد الضحايا",
                          },
                          ticks: {
                            stepSize: 1,
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "الاسباب",
                          },
                          ticks: {
                            font: {
                              size: 14,
                            },
                          },
                        },
                      },
                    }}
                    height={100}
                  />
                </div>
                <div ref={chartInjurRefCause}>
                  <Bar
                    data={{
                      labels: ['سرعة فائقة', 'انشطار اطار العجلة', 'نعاس', 'مجاوزة فجئية', 'سياقة في حالة سكر', 'طريق مبلل', 'عدم انتباه', 'وجود حفرة وسط الطريق', 'انقلاب الشاحنة', 'حيوان على الطريق السيارة', 'مترجل على الطريق السيارة', 'الدوران في الإتجاه المعاكس', 'الخروج من فتحة عشوائية', 'اصطدام سيارة باخرى رابظة على طرف الطريق', 'عطب مكانيكي/ عطب كهربائي', 'مضايقة من الخلف', 'اصطدام السيارة بالدراجة النارية', 'وجود عجلة او بقايا عجلة على الطريق', 'سقوط قرط على الطريق', 'اصطدام سيارتان او اكثر', 'عدم التحكم في السيارة', 'السياقة تحت تأثير التعب و الإرهاق'],
                      datasets: [
                        {
                          label: ['جرحى'],
                          data: [injurVitesse, injurEclat, injurSleep, injurDouble, injurDrunk, injurWet, injurAtt, injurHole, injurTruck, injurAnimal, injurMan, injurTurn, injurOut, injurCar, injurPanne, injurBehind, injurMoto, injurLeft, injurHerb, injurAcc, injurControl, injurTired],
                          backgroundColor: 'blue',
                          borderColor: 'grey',
                          borderWidth: 1,
                        },
                        {
                          label: ['موتى'],
                          data: [deadVitesse, deadEclat, deadSleep, deadDouble, deadDrunk, deadWet, deadAtt, deadHole, deadTruck, deadAnimal, deadMan, deadTurn, deadOut, deadCar, deadPanne, deadBehind, deadMoto, deadLeft, deadHerb, deadAcc, deadControl, deadTired],
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
                        title: { display: true, text: 'عدد الموتى و الجرحى حسب الاسباب', font: { size: 40 } },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "عدد الضحايا",
                          },
                          ticks: {
                            stepSize: 1,
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "الاسباب",
                          },
                          ticks: {
                            font: {
                              size: 14,
                            },
                          },
                        },
                      },
                    }}
                    height={100}
                  />
                </div>
              </div>
            )}</div>
          </div>
          <h1 className='title-layout'>احصائيات حوادث المرور حسب ساعات اليوم</h1>
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
                  <th>الساعة</th>
                </tr>
              </thead>
              {filterData(data).length === 0  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="7"><h5>الرجاء تعمير الجدول و اختيار التاريخ</h5></td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7"><h5>الرجاء اختيار التاريخ</h5></td></tr></tbody>) : startDate && endDate != null && filteredData(data,startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7"><h5>لا توجد بيانات في هذا التاريخ</h5></td></tr></tbody>) : (<tbody >
                <tr>
                <td>%{(injurOne * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurOne}</td>
                <td>%{(deadOne * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadOne}</td>
                <td>%{(accOne * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accOne}</td>
                    <td>0h00 - 1h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwo * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurTwo}</td>
                <td>%{(deadTwo * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadTwo}</td>
                <td>%{(accTwo * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accTwo}</td>
                    <td>1h00 - 2h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurThree * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurThree}</td>
                <td>%{(deadThree * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadThree}</td>
                <td>%{(accThree * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accThree}</td>
                    <td>2h00 - 3h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurFour * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurFour}</td>
                <td>%{(deadFour * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadFour}</td>
                <td>%{(accFour * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accFour}</td>
                    <td>3h00 - 4h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurFive * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurFive}</td>
                <td>%{(deadFive * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadFive}</td>
                <td>%{(accFive * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accFive}</td>
                    <td>4h00 - 5h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSix * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurFive}</td>
                <td>%{(deadSix * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadSix}</td>
                <td>%{(accSix * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accSix}</td>
                    <td>5h00 - 6h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSeven * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurSeven}</td>
                <td>%{(deadSeven * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadSeven}</td>
                <td>%{(accSeven * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accSeven}</td>
                    <td>6h00 - 7h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurEight * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurEight}</td>
                <td>%{(deadEight * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadEight}</td>
                <td>%{(accEight * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accEight}</td>
                    <td>7h00 - 8h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurNine * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurNine}</td>
                <td>%{(deadNine * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadNine}</td>
                <td>%{(accNine * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accNine}</td>
                    <td>8h00 - 9h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTen * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurTen}</td>
                <td>%{(deadTen * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadTen}</td>
                <td>%{(accTen * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accTen}</td>
                    <td>9h00 - 10h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurEleven * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurEleven}</td>
                <td>%{(deadEleven * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadEleven}</td>
                <td>%{(accEleven * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accEleven}</td>
                    <td>10h00 - 11h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwelve * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurTwelve}</td>
                <td>%{(deadTwelve * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadTwelve}</td>
                <td>%{(accTwelve * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accTwelve}</td>
                    <td>11h00 - 12h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurThirteen * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurThirteen}</td>
                <td>%{(deadThirteen * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadThirteen}</td>
                <td>%{(accThirteen * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accThirteen}</td>
                    <td>12h00 - 13h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurForteen * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurForteen}</td>
                <td>%{(deadForteen * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadForteen}</td>
                <td>%{(accForteen * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accForteen}</td>
                    <td>13h00 - 14h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurFifteen * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurFifteen}</td>
                <td>%{(deadFifteen * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadFifteen}</td>
                <td>%{(accFifteen * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accFifteen}</td>
                    <td>14h00 - 15h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSixteen * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurSixteen}</td>
                <td>%{(deadSixteen * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadSixteen}</td>
                <td>%{(accSixteen * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accSixteen}</td>
                    <td>15h00 - 16h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurSeventeen * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurSeventeen}</td>
                <td>%{(deadSeventeen * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadSeventeen}</td>
                <td>%{(accSeventeen * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accSeventeen}</td>
                    <td>16h00 - 17h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurEighteen * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurEighteen}</td>
                <td>%{(deadEighteen * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadEighteen}</td>
                <td>%{(accEighteen * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accEighteen}</td>
                    <td>17h00 - 18h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurNineteen * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurNineteen}</td>
                <td>%{(deadNineteen * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadNineteen}</td>
                <td>%{(accNineteen * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accNineteen}</td>
                    <td>18h00 - 19h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwenty * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurTwenty}</td>
                <td>%{(deadTwenty * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadTwenty}</td>
                <td>%{(accTwenty * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accTwenty}</td>
                    <td>19h00 - 20h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwentyone * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurTwentyone}</td>
                <td>%{(deadTwentyone * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadTwentyone}</td>
                <td>%{(accTwentyone * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accTwentyone}</td>
                    <td>20h00 - 21h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwentytwo * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurTwentytwo}</td>
                <td>%{(deadTwentytwo * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadTwentytwo}</td>
                <td>%{(accTwentytwo * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accTwentytwo}</td>
                    <td>21h00 - 22h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwentythree * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurTwentythree}</td>
                <td>%{(deadTwentythree * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadTwentythree}</td>
                <td>%{(accTwentythree * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accTwentythree}</td>
                    <td>22h00 - 23h00</td>
                  </tr>
                  <tr>
                  <td>%{(injurTwentyzero * 100 / sumInjurHoraire).toFixed(2)}</td>
                <td>{injurTwentyzero}</td>
                <td>%{(deadTwentyzero * 100 / sumDeadHoraire).toFixed(2)}</td>
                <td>{deadTwentyzero}</td>
                <td>%{(accTwentyzero * 100 / sumAccHoraire).toFixed(2)}</td>
                <td>{accTwentyzero}</td>
                    <td>23h00 - 00h00</td>
                  </tr>
                  <tr>
                <td></td>
                <td>{sumInjurHoraire}</td>
                <td></td>
                <td>{sumDeadHoraire}</td>
                <td></td>
                <td>{sumAccHoraire}</td>
                <td>الاجمالي</td>
              </tr>
              </tbody>)}
            </Table>
            <div>{(!startDate || !endDate) ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(data,startDate,endDate).length === 0 ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>لا توجد بيانات في هذا التاريخ</h3>) : (
            <div>
              <div ref={chartAccRefHoraire}>
              <Bar
                  data={{
                    labels: ['0h00 - 1h00', '1h00 - 2h00','2h00 - 3h00','3h00 - 4h00','4h00 - 5h00','5h00 - 6h00','6h00 - 7h00','7h00 - 8h00','8h00 - 9h00','9h00 - 10h00','10h00 - 11h00','11h00 - 12h00','12h00 - 13h00','13h00 - 14h00','14h00 - 15h00','15h00 - 16h00','16h00 - 17h00','17h00 - 18h00','18h00 - 19h00','19h00 - 20h00','20h00 - 21h00','21h00 - 22h00','22h00 - 23h00'],
                    datasets: [
                      {
                        label: ' الحوادث',
                        data: [accOne, accTwo,accThree,accFour,accFive,accSix,accSeven,accEight,accNine,accTen,accEleven,accTwelve,accThirteen,accForteen,accFifteen,accSixteen,accSeventeen,accEighteen,accNineteen,accTwenty,accTwentyone,accTwentytwo,accTwentythree],
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
                      title: { display: true, text: 'عدد الحوادث حسب ساعات اليوم',font: { size: 40 }  },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "عدد الضحايا",
                        },
                        ticks: {
                          stepSize: 1,
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "الساعات",
                        },
                        ticks: {
                            font: {
                              size: 14,
                            },
                      },
                    },
                  },
                  }}
                  height={100}
                />
              </div>
              <div ref={chartInjurRefHoraire}>
                <Bar
                  data={{
                    labels: ['0h00 - 1h00', '1h00 - 2h00','2h00 - 3h00','3h00 - 4h00','4h00 - 5h00','5h00 - 6h00','6h00 - 7h00','7h00 - 8h00','8h00 - 9h00','9h00 - 10h00','10h00 - 11h00','11h00 - 12h00','12h00 - 13h00','13h00 - 14h00','14h00 - 15h00','15h00 - 16h00','16h00 - 17h00','17h00 - 18h00','18h00 - 19h00','19h00 - 20h00','20h00 - 21h00','21h00 - 22h00','22h00 - 23h00'],
                    datasets: [
                      {
                        label: 'جرحى',
                        
                        data: [deadOne, deadTwo,deadThree,deadFour,deadFive,deadSix,deadSeven,deadEight,deadNine,deadTen,deadEleven,deadTwelve,deadThirteen,deadForteen,deadFifteen,deadSixteen,deadSeventeen,deadEighteen,deadNineteen,deadTwenty,deadTwentyone,deadTwentytwo,deadTwentythree],
                        backgroundColor: 'blue',
                        borderColor: 'grey',
                        borderWidth: 1,
                      },
                      {
                        label: 'موتى',
                        data: [injurOne, injurTwo,injurThree,injurFour,injurFive,injurSix,injurSeven,injurEight,injurNine,injurTen,injurEleven,injurTwelve,injurThirteen,injurForteen,injurFifteen,injurSixteen,injurSeventeen,injurEighteen,injurNineteen,injurTwenty,injurTwentyone,injurTwentytwo,injurTwentythree],
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
                      title: { display: true, text: 'عدد الجرحى و الموتى حسب ساعات اليوم',font: { size: 40 }  },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "عدد الضحايا",
                        },
                        ticks: {
                          stepSize: 1,
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "الساعات",
                        },
                        ticks: {
                            font: {
                              size: 14,
                            },
                          },
                      },
                    },
                  }}
                  height={100}
                />
              </div>
            </div>
            
          )}
            </div>
          </div><h1 className='title-layout'>احصائيات حوادث المرور حسب المكان</h1><div>
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
                            {filterData(data).length === 0  && (!startDate || !endDate) && Array.isArray(regionDirections(currentUserDistrict,currentUserAuto)) ? (<tbody><tr><td colSpan="7"><h5>الرجاء تعمير الجدول و اختيار التاريخ</h5></td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7"><h5>الرجاء اختيار التاريخ</h5></td></tr></tbody>) : startDate && endDate != null && filteredData(data,startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7"><h5>لا توجد بيانات في هذا التاريخ</h5></td></tr></tbody>) : (<tbody >
                                <tr>
                                <td>%{(injurTwentyLieu * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurTwentyLieu}</td>
                                <td>%{(deadTwentyLieu * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadTwentyLieu}</td>
                                <td>%{(accTwentyLieu * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accTwentyLieu}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[0]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[1]}</td>
                                <td rowSpan="8">{regionDirections(currentUserDistrict,currentUserAuto)[0]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurThirty * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurThirty}</td>
                                <td>%{(deadThirty * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadThirty}</td>
                                <td>%{(accThirty * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accThirty}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[1]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[2]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurForty * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurForty}</td>
                                <td>%{(deadForty * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadForty}</td>
                                <td>%{(accForty * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accForty}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[2]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[3]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurFifty * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurFifty}</td>
                                <td>%{(deadFifty * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadFifty}</td>
                                <td>%{(accFifty * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accFifty}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[3]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[4]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurSixty * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurSixty}</td>
                                <td>%{(deadSixty * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadSixty}</td>
                                <td>%{(accSixty * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accSixty}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[4]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[5]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurSeventy * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurSeventy}</td>
                                <td>%{(deadSeventy * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadSeventy}</td>
                                <td>%{(accSeventy * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accSeventy}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[5]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[6]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurEighty * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurEighty}</td>
                                <td>%{(deadEighty * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadEighty}</td>
                                <td>%{(accEighty * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accEighty}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[6]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[7]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurNinety * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurNinety}</td>
                                <td>%{(deadNinety * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadNinety}</td>
                                <td>%{(accNinety * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accNinety}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[7]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[8]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurTwentyy * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurTwentyy}</td>
                                <td>%{(deadTwentyy * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadTwentyy}</td>
                                <td>%{(accTwentyy * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accTwentyy}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[0]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[1]}</td>
                                <td rowSpan="8">{regionDirections(currentUserDistrict,currentUserAuto)[1]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurThirtyy * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurThirtyy}</td>
                                <td>%{(deadThirtyy * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadThirtyy}</td>
                                <td>%{(accThirtyy * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accThirtyy}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[1]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[2]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurFortyy * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurFortyy}</td>
                                <td>%{(deadFortyy * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadFortyy}</td>
                                <td>%{(accFortyy * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accFortyy}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[2]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[3]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurFiftyy * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurFiftyy}</td>
                                <td>%{(deadFiftyy * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadFiftyy}</td>
                                <td>%{(accFiftyy * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accFiftyy}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[3]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[4]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurSixtyy * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurSixtyy}</td>
                                <td>%{(deadSixtyy * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadSixtyy}</td>
                                <td>%{(accSixtyy * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accSixtyy}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[4]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[5]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurSeventyy * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurSeventyy}</td>
                                <td>%{(deadSeventyy * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadSeventyy}</td>
                                <td>%{(accSeventyy * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accSeventyy}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[5]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[6]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurEightyy * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurEightyy}</td>
                                <td>%{(deadEightyy * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadEightyy}</td>
                                <td>%{(accEightyy * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accEightyy}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[6]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[7]}</td>
                            </tr>
                            <tr>
                                <td>%{(injurNinetyy * 100 / sumInjurLieu).toFixed(2)}</td>
                                <td>{injurNinetyy}</td>
                                <td>%{(deadNinetyy * 100 / sumDeadLieu).toFixed(2)}</td>
                                <td>{deadNinetyy}</td>
                                <td>%{(accNinetyy * 100 / sumAccLieu).toFixed(2)}</td>
                                <td>{accNinetyy}</td>
                                <td>من  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[7]}  الى  ن.ك {regionNK(currentUserDistrict,currentUserAuto)[8]}</td>
                            </tr>
                                <tr>
                                    <td></td>
                                    <td>{sumInjurLieu}</td>
                                    <td></td>
                                    <td>{sumDeadLieu}</td>
                                    <td></td>
                                    <td>{sumAccLieu}</td>
                                    <td></td>
                                    <td>الاجمالي</td>
                                </tr>
                            </tbody>)}
                        </Table>
                        <div>{(!startDate || !endDate) ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(data,startDate,endDate).length === 0 ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>لا توجد بيانات في هذا التاريخ</h3>) : (
                                <div>
                                    <div ref={chartAccRefLieu}>
                                        <Bar
                                            data={{
                                                labels: ['من  ن.ك 317  الى  ن.ك 327', 'من  ن.ك 327  الى  ن.ك 337', 'من  ن.ك 337  الى  ن.ك 347', 'من  ن.ك 347  الى  ن.ك 357', 'من  ن.ك 357  الى  ن.ك 367', 'من  ن.ك 367  الى  ن.ك 377', 'من  ن.ك 377  الى  ن.ك 387', 'من  ن.ك 387  الى  ن.ك 391'],
                                                datasets: [
                                                    {
                                                        label: 'قابس',
                                                        data: [injurTwentyLieu, injurThirty, injurForty, injurFifty, injurSixty, injurSeventy, injurEighty, injurNinety],
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
                                                    title: { display: true, text: 'عددالحوادث حسب المكان', font: { size: 40 } },
                                                },
                                                scales: {
                                                    y: {
                                                      beginAtZero: true,
                                                      title: {
                                                        display: true,
                                                        text: "عدد الضحايا",
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
                                                      ticks: {
                                                        font: {
                                                          size: 14,
                                                        },
                                                      },
                                                    },
                                                  },
                                            }}
                                            height={100}
                                        />
                                    </div>
                                    <div ref={chartInjurRefLieu}>
                                        <Bar
                                            data={{
                                                labels: ['من  ن.ك 317  الى  ن.ك 327', 'من  ن.ك 327  الى  ن.ك 337', 'من  ن.ك 337  الى  ن.ك 347', 'من  ن.ك 347  الى  ن.ك 357', 'من  ن.ك 357  الى  ن.ك 367', 'من  ن.ك 367  الى  ن.ك 377', 'من  ن.ك 377  الى  ن.ك 387', 'من  ن.ك 387  الى  ن.ك 391'],
                                                datasets: [
                                                    {
                                                        label: 'جرحى',
                                                        data: [injurTwentyLieu, injurThirty, injurForty, injurFifty, injurSixty, injurSeventy, injurEighty, injurNinety],
                                                        backgroundColor: 'blue',
                                                        borderColor: 'grey',
                                                        borderWidth: 1,
                                                    },
                                                    {
                                                        label: 'موتى',
                                                        data: [deadTwentyLieu, deadThirty, deadForty, deadFifty, deadSixty, deadSeventy, deadEighty, deadNinety],
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
                                                    title: { display: true, text: `عدد الجرحى و الموتى حسب ${regionDirections(currentUserDistrict,currentUserAuto)[0]}`, font: { size: 40 } },
                                                },
                                                scales: {
                                                    y: {
                                                      beginAtZero: true,
                                                      title: {
                                                        display: true,
                                                        text: "عدد الضحايا",
                                                      },
                                                      ticks: {
                                                        stepSize: 1,
                                                      },
                                                    },
                                                    x: {
                                                      title: {
                                                        display: true,
                                                        text:  regionDirections(currentUserDistrict,currentUserAuto)[0],
                                                      },
                                                      ticks: {
                                                        font: {
                                                          size: 14,
                                                        },
                                                      },
                                                    },
                                                  },
                                            }}
                                            height={100}
                                        />
                                    </div>
                                    <div ref={chartInjurReffLieu}>
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
                                                    title: { display: true, text: `عدد الجرحى و الموتى حسب ${regionDirections(currentUserDistrict,currentUserAuto)[1]}`, font: { size: 40 } },
                                                },
                                                scales: {
                                                    y: {
                                                      beginAtZero: true,
                                                      title: {
                                                        display: true,
                                                        text: "عدد الضحايا",
                                                      },
                                                      ticks: {
                                                        stepSize: 1,
                                                      },
                                                    },
                                                    x: {
                                                      title: {
                                                        display: true,
                                                        text: regionDirections(currentUserDistrict,currentUserAuto)[1],
                                                      },
                                                      ticks: {
                                                        font: {
                                                          size: 14,
                                                        },
                                                      },
                                                    },
                                                  },
                                            }}
                                            height={100}
                                        />
                                    </div>
                                </div>
                            )}
                        </div><h1 className='title-layout'>احصائيات حوادث المرور حسب ايام الاسبوع</h1><div>
            <Table className="margin" striped bordered hover >
              <thead >
                <tr>
                  <th>%</th>
                  <th>جرحى </th>
                  <th>%</th>
                  <th>موتى</th>
                  <th>%</th>
                  <th>حوادث</th>
                  <th>أيام</th>
                </tr>
              </thead>
              {filterData(data).length === 0  && (!startDate || !endDate) ? (<tbody><tr><td colSpan="7"><h5>الرجاء تعمير الجدول و اختيار التاريخ</h5></td></tr></tbody>) : !startDate || !endDate ? (<tbody><tr><td colSpan="7"><h5>الرجاء اختيار التاريخ</h5></td></tr></tbody>) : startDate && endDate != null && filteredData(data,startDate,endDate).length === 0 ? (<tbody><tr><td colSpan="7"><h5>لا توجد بيانات في هذا التاريخ</h5></td></tr></tbody>) : (<tbody >
                <tr>
                  <td>%{(injurMonday * 100 / sumInjurSemaine).toFixed(2)}</td>
                  <td>{injurMonday}</td>
                  <td>%{(deadMonday * 100 / sumDeadSemaine).toFixed(2)}</td>
                  <td>{deadMonday}</td>
                  <td>%{(accMonday * 100 / sumAccSemaine).toFixed(2)}</td>
                  <td>{accMonday}</td>
                  <td>الأثنين</td>
                </tr>
                <tr>
                  <td>%{(injurTuesday * 100 / sumInjurSemaine).toFixed(2)}</td>
                  <td>{injurTuesday}</td>
                  <td>%{(deadTuesday * 100 / sumDeadSemaine).toFixed(2)}</td>
                  <td>{deadTuesday}</td>
                  <td>%{(accTuesday * 100 / sumAccSemaine).toFixed(2)}</td>
                  <td>{accTuesday}</td>
                  <td>الثلاثاء</td>
                </tr>
                <tr>
                  <td>%{(injurWednesday * 100 / sumInjurSemaine).toFixed(2)}</td>
                  <td>{injurWednesday}</td>
                  <td>%{(deadWednesday * 100 / sumDeadSemaine).toFixed(2)}</td>
                  <td>{deadWednesday}</td>
                  <td>%{(accWednesday * 100 / sumAccSemaine).toFixed(2)}</td>
                  <td>{accWednesday}</td>
                  <td>الأربعاء</td>
                </tr>
                <tr>
                  <td>%{(injurThursday * 100 / sumInjurSemaine).toFixed(2)}</td>
                  <td>{injurThursday}</td>
                  <td>%{(deadThursday * 100 / sumDeadSemaine).toFixed(2)}</td>
                  <td>{deadThursday}</td>
                  <td>%{(accThursday * 100 / sumAccSemaine).toFixed(2)}</td>
                  <td>{accThursday}</td>
                  <td>الخميس</td>
                </tr>
                <tr>
                  <td>%{(injurFriday * 100 / sumInjurSemaine).toFixed(2)}</td>
                  <td>{injurFriday}</td>
                  <td>%{(deadFriday * 100 / sumDeadSemaine).toFixed(2)}</td>
                  <td>{deadFriday}</td>
                  <td>%{(accFriday * 100 / sumAccSemaine).toFixed(2)}</td>
                  <td>{accFriday}</td>
                  <td>الجمعه</td>
                </tr>
                <tr>
                  <td>%{(injurSaturday * 100 / sumInjurSemaine).toFixed(2)}</td>
                  <td>{injurSaturday}</td>
                  <td>%{(deadSaturday * 100 / sumDeadSemaine).toFixed(2)}</td>
                  <td>{deadSaturday}</td>
                  <td>%{(accSaturday * 100 / sumAccSemaine).toFixed(2)}</td>
                  <td>{accSaturday}</td>
                  <td>السبت</td>
                </tr>
                <tr>
                  <td>%{(injurSunday * 100 / sumInjurSemaine).toFixed(2)}</td>
                  <td>{injurSunday}</td>
                  <td>%{(deadSunday * 100 / sumDeadSemaine).toFixed(2)}</td>
                  <td>{deadSunday}</td>
                  <td>%{(accSunday * 100 / sumAccSemaine).toFixed(2)}</td>
                  <td>{accSunday}</td>
                  <td>الأحد</td>
                </tr>
                <tr>
                  <td></td>
                  <td>{sumInjurSemaine}</td>
                  <td></td>
                  <td>{sumDeadSemaine}</td>
                  <td></td>
                  <td>{sumAccSemaine}</td>
                  <td>الاجمالي</td>
                </tr>
              </tbody>)}

            </Table>
            <div> {(!startDate || !endDate) ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>الرجاء اختيار التاريخ لرؤية الاحصائيات</h3>) : filteredData(data,startDate,endDate).length === 0 ? (<h3 style={{backgroundColor : "rgb(160, 206, 209)"}}>لا توجد بيانات في هذا التاريخ</h3>) : (
              <div>
                <div ref={chartAccRefSemaine}>
                  <Bar
                    data={{
                      labels: ['الأثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعه', 'السبت', 'الأحد'],
                      datasets: [

                        {
                          label: ['جرحى'],
                          data: [injurMonday, injurTuesday, injurWednesday, injurThursday, injurFriday, injurSaturday, injurSunday],
                          backgroundColor: 'blue',
                          borderColor: 'grey',
                          borderWidth: 1,
                        },
                        {
                          label: ['موتى'],
                          data: [deadMonday, deadTuesday, deadWednesday, deadThursday, deadFriday, deadSaturday, deadSunday],
                          backgroundColor: 'red',
                          borderColor: 'grey',
                          borderWidth: 1,
                        },
                        {
                          label: ['حوادث'],
                          data: [accMonday, accTuesday, accWednesday, accThursday, accFriday, accSaturday, accSunday],
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
                        title: { display: true, text: 'عدد الحوادث حسب ايام الاسبوع', font: { size: 40 } },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "عدد الحوادث",
                          },
                          ticks: {
                            stepSize: 1,
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "ايام الاسبوع",
                          },
                          ticks: {
                            font: {
                              size: 14,
                            },
                          },
                        },
                      },
                    }}
                    height={100}
                  />
                </div>
              </div>
            )}</div>
          </div><h1 className='title-layout'>احصائيات حوادث المرور حسب الاتجاه</h1><div>
          <Table className="margin" striped bordered hover>
            <thead>
              <tr>
                <th>%</th>
                <th>جرحى </th>
                <th>%</th>
                <th>موتى</th>
                <th>%</th>
                <th>حوادث</th>
                <th>الاتجاه</th>
              </tr>
            </thead>
            {filterData(data).length === 0 &&
            (!startDate || !endDate) &&
            Array.isArray(sense) ? (
              <tbody>
                <tr>
                  <td colSpan="7">
                    <h5>الرجاء تعمير الجدول و اختيار التاريخ</h5>
                  </td>
                </tr>
              </tbody>
            ) : !startDate || !endDate ? (
              <tbody>
                <tr>
                  <td colSpan="7">
                    <h5>الرجاء اختيار التاريخ</h5>
                  </td>
                </tr>
              </tbody>
            ) : startDate &&
              endDate != null &&
              filteredData(data, startDate, endDate).length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="7">
                    <h5>لا توجد بيانات في هذا التاريخ</h5>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td>%{((stats[sense[0]].injured * 100) / (stats[sense[0]].injured + stats[sense[1]].injured)).toFixed(2)}</td>
                  <td>{stats[sense[0]].injured}</td>
                  <td>%{((stats[sense[0]].dead * 100) / (stats[sense[0]].dead + stats[sense[1]].dead)).toFixed(2)}</td>
                  <td>{stats[sense[0]].dead}</td>
                  <td>%{((stats[sense[0]].accidents * 100) / (stats[sense[0]].accidents + stats[sense[1]].accidents)).toFixed(2)}</td>
                  <td>{stats[sense[0]].accidents}</td>
                  <td>{sense[0]}</td>
                </tr>
                <tr>
                  <td>%{((stats[sense[1]].injured * 100) / (stats[sense[0]].injured + stats[sense[1]].injured)).toFixed(2)}</td>
                  <td>{stats[sense[1]].injured}</td>
                  <td>%{((stats[sense[1]].dead * 100) / (stats[sense[0]].dead + stats[sense[1]].dead)).toFixed(2)}</td>
                  <td>{stats[sense[1]].dead}</td>
                  <td>%{((stats[sense[1]].accidents * 100) / (stats[sense[0]].accidents + stats[sense[1]].accidents)).toFixed(2)}</td>
                  <td>{stats[sense[1]].accidents}</td>
                  <td>{sense[1]}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>{(stats[sense[0]].injured + stats[sense[1]].injured)}</td>
                  <td></td>
                  <td>{(stats[sense[0]].dead + stats[sense[1]].dead)}</td>
                  <td></td>
                  <td>{(stats[sense[0]].accidents + stats[sense[1]].accidents)}</td>
                  <td>الاجمالي</td>
                </tr>
              </tbody>
            )}
          </Table>
          <div>
            {" "}
            {!startDate || !endDate ? (
              <h3 style={{ backgroundColor: "rgb(160, 206, 209)" }}>
                الرجاء اختيار التاريخ لرؤية الاحصائيات
              </h3>
            ) : filteredData(data, startDate, endDate).length === 0 ? (
              <h3 style={{ backgroundColor: "rgb(160, 206, 209)" }}>
                لا توجد بيانات في هذا التاريخ
              </h3>
            ) : (
              <div>
                <div ref={chartAccRefSense}>
                  <Bar
                    data={{
                      labels: [sense[0], sense[1]],
                      datasets: [
                        {
                          label: "عدد الحوادث",
                          data: [stats[sense[0]].accidents, stats[sense[1]].accidents],
                          backgroundColor: "grey",
                          borderColor: "rgba(75, 192, 192, 1)",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        title: {
                          display: true,
                          text: "عدد الحوادث حسب الاتجاه",
                          font: { size: 30 },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true, // Commence l’axe Y à zéro
                          title: {
                            display: true,
                            text: "عدد الحوادث", // Titre de l’axe Y
                          },
                          ticks: {
                            stepSize: 1, // Intervalle entre les valeurs de l’axe Y
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "الاتجاه", // Titre de l’axe X
                          },
                          ticks: {
                            font: {
                              size: 14,
                            },
                          },
                        },
                      },
                    }}
                    height={100}
                  />
                </div>
                <div ref={chartInjurRefSense}>
                  <Bar
                    data={{
                      labels: [sense[0], sense[1]],
                      datasets: [
                        {
                          label: "عدد الجرحى",
                          data: [stats[sense[0]].injured, stats[sense[1]].injured],
                          backgroundColor: "blue",
                          borderColor: "rgba(255, 206, 86, 1)",
                          borderWidth: 1,
                        },
                        {
                          label: "عدد الموتى",
                          data: [stats[sense[0]].dead, stats[sense[1]].dead],
                          backgroundColor: "red",
                          borderColor: "rgba(255, 99, 132, 1)",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        title: {
                          display: true,
                          text: "عدد الجرحى و الموتى حسب الاتجاه",
                          font: { size: 30 },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "عدد الضحايا",
                          },
                          ticks: {
                            stepSize: 1,
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: "الاتجاه",
                          },
                          ticks: {
                            font: {
                              size: 14,
                            },
                          },
                        },
                      },
                    }}
                    height={100}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </StyledTable>
    </div>

  );
};
export default HomeSemaine;