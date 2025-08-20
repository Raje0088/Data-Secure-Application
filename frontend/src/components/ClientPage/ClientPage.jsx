import React, { Fragment } from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "./ClientPage.module.css";
import { BsShieldCheck } from "react-icons/bs";
import { BsShieldX } from "react-icons/bs";
import { BsDatabaseFillDown } from "react-icons/bs";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import AddField from "./AddField";
import History from "../HistoryPage/History";
import { data, useNavigate, useLocation } from "react-router-dom";
import TimePickerComponent from "../../UI/TimePickerComponent";
import CustomSelect from "../../components/CustomSelect";
import { FaFileSignature } from "react-icons/fa6";
import { FaUserClock } from "react-icons/fa6";
import DisplaySearchClientsPortal from "./DisplaySearchClientsPortal";
import { HiOutlineRefresh } from "react-icons/hi";
import CustomInput from "../../UI/CustomInput";
import { AuthContext } from "../../context-api/AuthContext";
import { base_url } from "../../config/config";

const SearchPincode = () => {
  const navigate = useNavigate();
  const { userLoginId } = useContext(AuthContext);
  const { state, from } = useLocation();
  const executiveId = state?.userId || "E02_SA";
  const [getSelectedTime, setGetSelectedTime] = useState("");
  const [taskDetails, setTaskDetails] = useState(null);

  const [region, setRegion] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [verifiedByEmployee, setVerifiedByEmploye] = useState("SA");
  const [countryOptions, setCountryOptions] = useState([]);
  const [quotationYesNo, setQuotationYesNo] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [isUnsavedNewForm, setIsUnsavedNewForm] = useState(false);
  const [getSelectedNewTime, setGetSelectedNewTime] = useState("");
  const [clientDetails, setClientDetails] = useState({
    sr_no: "",
    clientId: "",
    bussinessNames: {},
    clientName: "",
    userSubscriptionId: "",
    numbers: {},
    emails: {},
    website: "",
    addresses: {},
    pincode: "",
    district: "",
    state: "",
    country: "",
    assignBy: "",
    assignTo: "",
    product: [],
    stage: [],
    quotationShare: "",
    expectedDate: "",
    remarks: "",
    callType: "",
    followUpDate: "",
    verifiedBy: "",
    time: "",
    action: "",
    database: "",
    tracker: {
      new_data_db: { completed: false, completedDate: "" },
      leads_db: { completed: false, completedDate: "" },
      training_db: { completed: false, completedDate: "" },
      follow_up_db: { completed: false, completedDate: "" },
      installation_db: { completed: false, completedDate: "" },
      demo_db: { completed: false, completedDate: "" },
      recovery_db: { completed: false, completedDate: "", recoveryHistory: [] },
      target_db: { completed: false, completedDate: "" },
      no_of_new_calls_db: { completed: false, completedDate: "" },
      support_db: { completed: false, completedDate: "" },
      out_bound_db: { completed: false, completedDate: "" },
      in_bound_db: { completed: false, completedDate: "" },
      hot_db: { completed: false, completedDate: "" },
      lost_db: { completed: false, completedDate: "" },
      create_db: { completed: false, completedDate: "" },
      update_db: { completed: false, completedDate: "" },
      deactivate_db: { completed: false, completedDate: "" },
    },
    label: "",
    completion: {
      receivedProduct: "",
      status: "",
      newExpectedDate: "",
      newTime: "",
      newRemark: "",
      newStage: "",
    },
    amountDetails: {
      totalAmount: "",
      paidAmount: "",
      extraCharges: "",
      finalCost: "",
      newAmount: "",
      balanceAmount: "",
    },
    amountHistory: [
      {
        date: "",
        time: "",
        totalAmount: "",
        paidAmount: "",
        extraCharges: "",
        finalCost: "",
        newAmount: "",
        balanceAmount: "",
        updatedBy: "",
      },
    ],
  });
  const [stageOptions, setStageOptions] = useState([
    { label: "Demo", value: "demo_db" },
    { label: "Installation", value: "installation_db" },
    { label: "Hot", value: "hot_db" },
    { label: "Lost", value: "lost_db" },
    { label: "Follow up", value: "follow_up_db" },
    { label: "In-process", value: "in-process_db" },
    { label: "Dispatched", value: "dispatched_db" },
  ]);

  const [selectedStageOptions, setSelectedStageOptions] = useState([]);
  const [userProductList, setUserProductList] = useState([]);
  const [mapClientAllHistory, setMapClientAllHistory] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState(true);
  const [newClientFormId, setNewClientFormId] = useState("");
  const [checkPermissionManagement, setCheckPermissionManagement] = useState(
    {}
  );
  const [taskClientIdArray, setTaskClientIdArray] = useState([]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [currentClientId, setCurrentClientId] = useState("");
  const [isTaskMode, setIsTaskMode] = useState(false);
  const [clientCount, setClientCount] = useState("");
  const [currentClientCount, setCurrentClientCount] = useState(1);
  const [isClientIdAvailableInDb, setIsClientIdAvailableInDb] = useState("");
  const [checkRecovery, setCheckRecovery] = useState(false);
  const [checkInstallation, setCheckInstallation] = useState(false);
  const [checkHotClient, setCheckHotClient] = useState(false);
  const [checkDisplaySearchClients, setCheckDisplaySearchClients] =
    useState(false);
  const [allSearchClientData, setAllSearchClientData] = useState([]);
  const [selectedUserProduct, setSelectedUserProduct] = useState([]);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [isNewDataEntry, setIsNewDataEntry] = useState(false);
  const [stageTab, setStageTab] = useState("Planner");

  //FETCHING ASSIGN TASK BY SA/ADMIN TO USER BY USING ARRAY TO
  // useEffect(() => {
  //   console.log("taskDetails?.clientId_db", taskDetails?.clientId_db);
  //   if (taskDetails?.clientIds_db?.length > 0 || taskDetails) {
  //     let taskIds = [];
  //     if (taskDetails?.clientIds_db?.length > 1) {
  //       taskIds = taskDetails?.clientIds_db.map((ids) => ids.clientId_db);
  //     } else {
  //       taskIds = [taskDetails?.clientId_db];
  //     }
  //     console.log("taskId", taskIds);
  //     setTaskClientIdArray(taskIds);
  //     setCurrentClientId(taskIds[0]);
  //     setTaskIndex(0);
  //     setIsTaskMode(true);
  //     setClientCount(taskIds.length);
  //     console.log("isTaskMode", isTaskMode);
  //     console.log("ids hai", taskIds);
  //     console.log("ids", taskIds[0]);
  //   } else {
  //     const storeId = localStorage.getItem("lastClientId");
  //     if (storeId) {
  //       setCurrentClientId(storeId);
  //     } else {
  //       const newId = "C0000001";
  //       setCurrentClientId(newId);
  //       localStorage.setItem("lastClientId", newId);
  //     }
  //     setIsTaskMode(false);
  //   }
  // }, [isTaskMode]);

  useEffect(() => {
    setClientDetails((prev) => ({
      ...prev,
      completion: {
        ...prev.completion,
        newTime: getSelectedNewTime,
      },
    }));
  }, [getSelectedNewTime]);

  useEffect(() => {
    if (state?.from === "searchClient") {
      setTaskDetails(state?.selectedClients);
    } else if (state?.from === "remainder") {
      setTaskDetails([state?.id]);
    } else {
      setTaskDetails(state?.taskdata ? [state.taskdata] : []);
    }

    // console.log("executiveId--", userLoginId);
    console.log("taskDetails--", taskDetails);
  }, [state]);

  useEffect(() => {
    if (!taskDetails) return;
    console.log("taskDetails in useEffect", taskDetails);
    if (taskDetails?.length > 0) {
      setTaskClientIdArray(taskDetails);
      setCurrentClientId(taskDetails[0]);
      setTaskIndex(0);
      setIsTaskMode(true);
      setClientCount(taskDetails.length);
    } else {
      const storeId = localStorage.getItem("lastClientId");
      console.log("taskDetails in useEffect else part bor", storeId);
      if (storeId) {
        setCurrentClientId(storeId);
      } else {
        const newId = "C0000001";
        setCurrentClientId(newId);
        localStorage.setItem("lastClientId", newId);
      }
      setIsTaskMode(false);
    }
  }, [taskDetails]);

  // FETCHING CLIENT DETAILS THROUGH CURRENCLIENTID FROM RAW DB AND CLIENT DB
  useEffect(() => {
    if (!currentClientId) return;

    const fetch = async () => {
      console.log("oo", currentClientId);
      const checkAndRedirectToUserPage = await axios.get(
        `${base_url}/subscribe-user/check-user-subscription/${currentClientId}`
      );
      console.log("you are here ", checkAndRedirectToUserPage);
      if (
        checkAndRedirectToUserPage.data.result &&
        checkAndRedirectToUserPage.data.result.client_subscription_id
      ) {
        console.log("moving to user page");
        // const currentId = localStorage.getItem("lastClientId") || "C0000001";
        // const numId = parseInt(currentId.replace("C", "")) + 1;
        // const nextId = `C${String(numId).padStart(7, "0")}`;
        // localStorage.setItem("lastClientId", nextId);
        const confirm = window.confirm("User Found.Please Switch to User Page");
        if (confirm)
          navigate("/userpage", {
            state:
              checkAndRedirectToUserPage.data.result.client_subscription_id,
          });
        // return;
      }
      console.log("you are there");

      // CLIENT HISTORY ROUTES TAKES BECOZ LAST UPDATE DATA NEEDS HERE FOR FOLLOWUP DATE
      const checkClientHistoryIdRecord = await axios.get(
        `${base_url}/history/get-last-updated-clienthistory/${currentClientId}`
      );
      let detail;
      if (checkClientHistoryIdRecord.data.result) {
        detail = checkClientHistoryIdRecord.data.result;
        console.log(
          "client id get from Client data",
          checkClientHistoryIdRecord.data
        );
        // alert("id from client db");
      } else {
        const result = await axios.get(
          `${base_url}/raw-data/search-raw-data/${currentClientId}`
        );
        detail = result.data.result;
        // alert("id from Raw db");
        console.log("client id get from raw data", result.data.result);
      }
      console.log("detail data", detail);

      if (detail) {
        const businessFields = [
          { label: "Business Name *", value: detail.optical_name1_db },
          { label: "Business Name 2", value: detail.optical_name2_db },
          { label: "Business Name 3", value: detail.optical_name3_db },
        ];
        const mobiles = [
          { label: "Primary Number *", value: detail.mobile_1_db },
          { label: "Secondary Number", value: detail.mobile_2_db },
          { label: "Tertiary Number", value: detail.mobile_3_db },
        ];
        const addresses = [
          { label: "Address 1", value: detail.address_1_db },
          { label: "Address 2", value: detail.address_2_db },
          { label: "Address 3", value: detail.address_3_db },
        ];
        const emails = [
          { label: "Email 1", value: detail.email_1_db },
          { label: "Email 2", value: detail.email_2_db },
          { label: "Email 3", value: detail.email_3_db },
        ];
        const todayDate = todaysDate();
        if (detail.stage_db) {
          setFeedback(true);
        } else {
          setFeedback(false);
        }
        setSelectedStageOptions(
          (detail.stage_db || []).map((stage) => ({
            label: stage.label,
            value: stage.value,
          }))
        );
        setSelectedUserProduct(
          (detail.product_db || []).map((item) => ({
            label: item.label,
            value: item.value,
          }))
        );

        setClientDetails((prev) => ({
          ...prev,
          sr_no: detail.client_serial_no_id,
          clientId: detail.client_id,
          addresses: addresses,
          pincode: detail.pincode_db,
          clientName: detail.client_name_db,
          bussinessNames: businessFields,
          followUpDate: detail.expectedDate_db || todayDate,
          numbers: mobiles,
          emails: emails,
          quotationShare: detail.quotationShare_db,
          expectedDate: "",
          remarks: detail.remarks_db,
          callType: detail.callType_db,
          verifiedBy: detail.verifiedBy_db,
          time: detail.time_db,
          label: detail.label_db,
          website: detail.website_db,
          database: detail.database_status_db,
          completion: {
            ...prev.completion,
            receivedProduct: detail?.product_db?.[0]?.label || "",
          },
        }));
        if (
          detail.quotationShare_db &&
          detail.quotationShare_db.trim() !== ""
        ) {
          setQuotationYesNo(true);
        } else {
          setQuotationYesNo(false);
        }
        setDatabaseStatus(detail.database_status_db);
        setCheckHotClient(detail?.tracking_db?.hot_db?.completed);
        console.log("checkhotclient", detail?.tracking_db?.hot_db?.completed);
      }

      const checkClientIdPresent = await axios.get(
        `${base_url}/clients/check-clientid-present/${currentClientId}`
      );
      const message = checkClientIdPresent.data.message;
      if (message === "present") {
        setIsClientIdAvailableInDb(true);
      } else {
        setIsClientIdAvailableInDb(false);
      }
    };
    fetch();
  }, [currentClientId, refresh]);

  //WHEN PINCODE ENTER AUTO FETCH STATE,DISTRICT, DEBOUNCING USED
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (clientDetails.pincode) {
        const fetch = async () => {
          const searching = {
            pincode: clientDetails.pincode,
            limit: 50,
            lastId: lastId || undefined,
          };
          try {
            const pincode = await axios.get(
              `${base_url}/pincode/search-pincode`,
              {
                params: searching,
              }
            );
            const regionData = pincode.data.data;
            const uniqueDistricts = Array.from(
              new Set(regionData.map((place) => place.district_db))
            );
            const uniqueState = Array.from(
              new Set(regionData.map((place) => place.state_db))
            );
            const uniqueCountry = Array.from(
              new Set(regionData.map((place) => place.country_db))
            );
            setDistrictOptions(uniqueDistricts);
            setStateOptions(uniqueState);
            setCountryOptions(uniqueCountry);

            setClientDetails((prev) => ({
              ...prev,
              district: uniqueDistricts[0] || "",
              state: uniqueState[0] || "",
              country: uniqueCountry[0] || "",
            }));
            // console.log("regionData", regionData);
          } catch (err) {
            console.error("Error fetching pincodes:", err);
          }
        };
        fetch();
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [clientDetails.pincode]);

  //DISPLAY STATE,DISTRICT NAME AND FETCH ACCORDING TO NAMES
  useEffect(() => {
    const fetch = async () => {
      try {
        const placeData = await axios.get(
          `${base_url}/pincode/search-getplaces`,
          {
            params: {
              state: clientDetails.state,
              district: clientDetails.district,
              village: clientDetails.village,
              pincode: clientDetails.pincode,
              taluka: clientDetails.taluka,
            },
          }
        );
        const regionData = placeData.data;
        // console.log("regionData bolte bhai", regionData);
        const uniqueDistricts = regionData.districtname;
        // console.log("districts", uniqueDistricts);
        const uniqueState = regionData.statename;
        setDistrictOptions(uniqueDistricts);
        setStateOptions(uniqueState);

        // console.log("regionData", regionData);
      } catch (err) {
        console.error("Error fetching pincodes:", err);
      }
    };
    fetch();
  }, [clientDetails.pincode, clientDetails.district, clientDetails.state]);

  const handleSearchInput = (name, value) => {
    console.log(name, value);
    setClientDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //FETCHING USER PRODUCTLIST ASSIGN BY SA
  useEffect(() => {
    const fetch = async () => {
      try {
        const tempUserId = localStorage.getItem("userLoginId");
        let result;
        let productsList;
        if (tempUserId === "SA" || userLoginId === "SA") {
          result = await axios.get(
            `${base_url}/setting/get-superadmin-product`
          );
          // console.log("SA bro");
          // console.log("product", result?.data.result);
          productsList = result?.data?.result?.map((prod) => ({
            label: prod.assign_product_name,
            value: prod.assign_product_name,
          }));
        } else {
          result = await axios.get(
            `${base_url}/users/search-by-user/${userLoginId}`
          );
          // console.log("User");
          // console.log("product", result?.data?.assignProduct);
          productsList = result?.data?.assignProduct?.map((item) => ({
            label: item,
            value: item,
          }));
        }

        // console.log("product============", productsList);
        setUserProductList(productsList);
      } catch (err) {
        console.log("internal error", err);
      }
    };
    fetch();
  }, []);

  //FETCHING PERMISSION OF USER CREATE,UPDATE,DELETE
  useEffect(() => {
    async function fetch() {
      const result = await axios.get(
        `${base_url}/users/search-by-permission/${userLoginId}`
      );
      const permission = result.data;
      // console.log("permsison", permission);
      setCheckPermissionManagement(permission);
    }
    fetch();
  }, []);

  // RAW DB -> CLIENT DB && CLIENTHISTORY --> SAVING DETAILS AND ALSO SEND COPY TO CLIENT HISTORY
  const handleSaveRawDBDetails = async () => {
    try {
      const result = await axios.post(`${base_url}/raw-data/create-raw-data`, {
        clientDetails: clientDetails,
      });
      console.log("record successfully save in raw db", result.data);
      return true;
    } catch (err) {
      console.log("internal error", err);
      return false;
    }
  };

  const handleSaveSubscribeUserDetails = async (
    updatedHistory = clientDetails.amountHistory
  ) => {
    console.log("tracker", clientDetails.tracker);
    try {
      if (isUnsavedNewForm) {
        await new Promise((resolve) => {
          setClientDetails((prev) => ({
            ...prev,
            tracker: {
              new_data_db: {
                completed: true,
                completedDate: new Date().toLocaleDateString("en-GB"),
              },
            },
          }));
          resolve();
        });
      }

      const result = await axios.post(
        `${base_url}/subscribe-user/create-subscribe-user`,
        {
          clientSerialNo: clientDetails.sr_no,
          clientId: clientDetails.clientId,
          userId: userLoginId,
          bussinessNames: clientDetails.bussinessNames,
          clientName: clientDetails.clientName,
          numbers: clientDetails.numbers,
          emails: clientDetails.emails,
          website: clientDetails.website,
          addresses: clientDetails.addresses,
          pincode: clientDetails.pincode,
          district: clientDetails.district,
          state: clientDetails.state,
          country: clientDetails.country,
          assignBy: taskDetails?.assignBy_db || "NA",
          assignTo: taskDetails?.assignTo_db || userLoginId,
          product: selectedUserProduct.map((prod) => ({
            label: prod.label,
            value: prod.value,
          })),
          stage: selectedStageOptions.map((stage) => ({
            label: stage.label,
            value: stage.value,
          })),
          quotationShare: clientDetails.quotationShare,
          expectedDate: clientDetails.expectedDate,
          remarks: clientDetails.remarks,
          callType: clientDetails.callType,
          followUpDate: clientDetails.followUpDate,
          verifiedBy: clientDetails.verifiedBy,
          tracker: clientDetails.tracker,
          label: clientDetails.label,
          amountDetails: clientDetails.amountDetails,
          amountHistory: updatedHistory,
          followUpTime: getSelectedTime,
          completion: clientDetails.completion,
          action: "create User",
        },
        {
          headers: {
            generateuniqueid: taskDetails?.assignTo_db || userLoginId,
            "Content-Type": "application/json",
          },
        }
      );

      if (result) {
        alert("User successfully Saved");
      }
      setRefresh((prev) => !prev);
      setIsUnsavedNewForm(false);
    } catch (err) {
      console.log("internal err", err);
    }
  };

  const handleSaveClientDetails = async () => {
    // console.log("tracker", clientDetails.tracker);
    console.log("tracker", userLoginId);
    if (!clientDetails.bussinessNames[0]?.value) {
      return alert("First business name cannot be Empty");
    }
    if (!clientDetails.numbers[0]?.value) {
      return alert("First Mobile Field cannot be Empty");
    }
    try {
      if (isNewDataEntry) {
        clientDetails.tracker.new_data_db = {
          completed: true,
          completedDate: new Date().toLocaleDateString("en-GB"),
        };
      }
      if (
        clientDetails.tracker.new_data_db.completed === true &&
        clientDetails.tracker.follow_up_db.completed === true
      ) {
        clientDetails.tracker.leads_db = {
          completed: true,
          completedDate: new Date().toLocaleDateString("en-GB"),
        };
      }
      clientDetails.tracker.no_of_new_calls_db = {
        completed: true,
        completedDate: new Date().toLocaleDateString("en-GB"),
      };

      let updatedHistory = clientDetails.amountHistory;
      if (
        clientDetails.tracker &&
        clientDetails.tracker.installation_db &&
        clientDetails.tracker.installation_db.completed === true
      ) {
        const { totalAmount, paidAmount, balanceAmount } = handleCalculation(
          null,
          0
        );

        const historyRecord = {
          date: new Date().toLocaleDateString("en-GB"),
          time: new Date().toLocaleTimeString(),
          updatedBy: userLoginId,
          ...clientDetails.amountDetails,
          totalAmount: totalAmount,
          paidAmount: paidAmount,
          balanceAmount: balanceAmount,
        };
        updatedHistory = [...clientDetails.amountHistory, historyRecord];
        setClientDetails((prev) => ({
          ...prev,
          amountHistory: updatedHistory,
        }));

        await handleSaveSubscribeUserDetails(updatedHistory);
      }

      const rawRecord = await axios.get(
        `${base_url}/raw-data/search-raw-data/${clientDetails.clientId}`
      );
      if (!rawRecord.data || !rawRecord.data.result) {
        // console.log("Record not found in Raw DB, saving...");
        const rawSaved = await handleSaveRawDBDetails();
        if (!rawSaved) {
          console.error("Failed to save in Raw DB, aborting client save");
          return;
        }
      }

      if (isUnsavedNewForm) {
        await new Promise((resolve) => {
          setClientDetails((prev) => ({
            ...prev,
            tracker: {
              new_data_db: {
                completed: true,
                completedDate: new Date().toLocaleDateString("en-GB"),
              },
            },
          }));
          resolve();
        });
      }

      const result = await axios.post(
        `${base_url}/clients/create-client-detail`,
        {
          clientSerialNo: clientDetails.sr_no,
          clientId: clientDetails.clientId,
          userId: userLoginId,
          bussinessNames: clientDetails.bussinessNames,
          clientName: clientDetails.clientName,
          numbers: clientDetails.numbers,
          emails: clientDetails.emails,
          website: clientDetails.website,
          addresses: clientDetails.addresses,
          pincode: clientDetails.pincode,
          district: clientDetails.district,
          state: clientDetails.state,
          country: clientDetails.country,
          assignBy: taskDetails?.assignBy_db || "NA",
          assignTo: taskDetails?.assignTo_db || userLoginId || "NA",
          product: selectedUserProduct.map((prod) => ({
            label: prod.label,
            value: prod.value,
          })),
          stage: selectedStageOptions.map((stage) => ({
            label: stage.label,
            value: stage.value,
          })),
          quotationShare: clientDetails.quotationShare,
          expectedDate: clientDetails.expectedDate,
          remarks: clientDetails.remarks,
          callType: clientDetails.callType,
          followUpDate: clientDetails.followUpDate,
          verifiedBy: clientDetails.verifiedBy,
          tracker: clientDetails.tracker,
          label: clientDetails.label,
          amountDetails: clientDetails.amountDetails,
          amountHistory: updatedHistory,
          followUpTime: getSelectedTime,
          completion: clientDetails.completion,
          action: "create",
        },
        {
          headers: {
            generateuniqueid: taskDetails?.assignTo_db || userLoginId || "NA",
            "Content-Type": "application/json",
          },
        }
      );

      const historyId = clientDetails.clientId.replace("C", "H_C");
      console.log("historyId", historyId);

      const resultHistory = await axios.post(
        `${base_url}/history/create-history`,
        {
          clientSerialNo: clientDetails.sr_no,
          clientId: clientDetails.clientId,
          userId: userLoginId,
          bussinessNames: clientDetails.bussinessNames,
          clientName: clientDetails.clientName,
          numbers: clientDetails.numbers,
          emails: clientDetails.emails,
          website: clientDetails.website,
          addresses: clientDetails.addresses,
          pincode: clientDetails.pincode,
          district: clientDetails.district,
          state: clientDetails.state,
          country: clientDetails.country,
          assignBy: taskDetails?.assignBy_db || "NA",
          assignTo: taskDetails?.assignTo_db || userLoginId || "NA",
          product: selectedUserProduct.map((prod) => ({
            label: prod.label,
            value: prod.value,
          })),
          stage: selectedStageOptions.map((stage) => ({
            label: stage.label,
            value: stage.value,
          })),
          quotationShare: clientDetails.quotationShare,
          expectedDate: clientDetails.expectedDate,
          remarks: clientDetails.remarks,
          callType: clientDetails.callType,
          followUpDate: clientDetails.followUpDate,
          verifiedBy: clientDetails.verifiedBy,
          database: "client_db",
          tracker: clientDetails.tracker,
          completion: clientDetails.completion,
          label: clientDetails.label,
          amountDetails: clientDetails.amountDetails,
          amountHistory: updatedHistory,
          followUpTime: getSelectedTime,
          action: "create",
        }
      );
      console.log(
        "Client History Save Succressfully",
        resultHistory.data.result
      );
      console.log("Client Save Succressfully", result.data.result);

      if (result && resultHistory) {
        alert("Client successfully Saved");
      }

      setIsUnsavedNewForm(false);
      setRefreshHistory((prev) => !prev);
      setIsNewDataEntry(false);
      // console.log("FINAL tracker being sent:", clientDetails.tracker);
      // window.location.reload();
      setRefresh((prev) => !prev);
    } catch (err) {
      console.log("internal err", err);
      if (err) {
        return alert("Shop Name required");
      }
    }
  };
  // console.log("yo",selectedUserProduct)

  const handleUpdateClientDetails = async () => {
    console.log("tracker fgffd", clientDetails.tracker);

    if (!clientDetails.bussinessNames[0]?.value) {
      return alert("First business name cannot be Empty");
    }
    if (!clientDetails.numbers[0]?.value) {
      return alert("First Mobile Field cannot be Empty");
    }
    try {
      clientDetails.tracker.no_of_new_calls_db = {
        completed: true,
        completedDate: new Date().toLocaleDateString("en-GB"),
      };
      let updatedHistory = clientDetails.amountHistory;
      if (clientDetails.tracker.installation_db.completed === true) {
        const { totalAmount, paidAmount, balanceAmount } = handleCalculation(
          null,
          0
        );

        const historyRecord = {
          date: new Date().toLocaleDateString("en-GB"),
          time: new Date().toLocaleTimeString(),
          updatedBy: userLoginId,
          ...clientDetails.amountDetails,
          totalAmount: totalAmount,
          paidAmount: paidAmount,
          balanceAmount: balanceAmount,
        };
        updatedHistory = [...clientDetails.amountHistory, historyRecord];
        setClientDetails((prev) => ({
          ...prev,
          amountHistory: updatedHistory,
        }));

        await handleSaveSubscribeUserDetails(updatedHistory);
      }
      let userResult;
      let result;
      if (clientDetails.tracker.installation_db.completed === true) {
        userResult = await handleSaveSubscribeUserDetails();
      } else {
        result = await axios.put(
          `${base_url}/clients/update-client/${currentClientId}`,
          {
            clientSerialNo: clientDetails.sr_no,
            userId: userLoginId,
            bussinessNames: clientDetails.bussinessNames,
            clientName: clientDetails.clientName,
            numbers: clientDetails.numbers,
            emails: clientDetails.emails,
            website: clientDetails.website,
            addresses: clientDetails.addresses,
            pincode: clientDetails.pincode,
            district: clientDetails.district,
            state: clientDetails.state,
            country: clientDetails.country,
            assignBy: taskDetails?.assignBy_db || "NA",
            assignTo: taskDetails?.assignTo_db || userLoginId,
            product: selectedUserProduct.map((prod) => ({
              label: prod.label,
              value: prod.value,
            })),
            stage: selectedStageOptions.map((stage) => ({
              label: stage.label,
              value: stage.value,
            })),
            quotationShare: clientDetails.quotationShare,
            expectedDate: clientDetails.expectedDate,
            remarks: clientDetails.remarks,
            followUpDate: clientDetails.followUpDate,
            verifiedBy: clientDetails.verifiedBy,
            database: "client_db",
            label: clientDetails.label,
            tracker: clientDetails.tracker,
            completion: clientDetails.completion,
            followUpTime: getSelectedTime,
            action: "update",
          }
        );

        console.log("Client successfully Updated", result);
      }
      const resultHistory = await axios.post(
        `${base_url}/history/create-history`,
        {
          clientSerialNo: clientDetails.sr_no,
          clientId: clientDetails.clientId,
          userId: userLoginId,
          bussinessNames: clientDetails.bussinessNames,
          clientName: clientDetails.clientName,
          numbers: clientDetails.numbers,
          emails: clientDetails.emails,
          website: clientDetails.website,
          addresses: clientDetails.addresses,
          pincode: clientDetails.pincode,
          district: clientDetails.district,
          state: clientDetails.state,
          country: clientDetails.country,
          assignBy: taskDetails?.assignBy_db || "NA",
          assignTo: taskDetails?.assignTo_db || userLoginId,
          product: selectedUserProduct.map((prod) => ({
            label: prod.label,
            value: prod.value,
          })),
          stage: selectedStageOptions.map((stage) => ({
            label: stage.label,
            value: stage.value,
          })),
          quotationShare: clientDetails.quotationShare,
          expectedDate: clientDetails.expectedDate,
          remarks: clientDetails.remarks,
          callType: clientDetails.callType,
          followUpDate: clientDetails.followUpDate,
          verifiedBy: clientDetails.verifiedBy,
          database: "client_db",
          label: clientDetails.label,
          tracker: clientDetails.tracker,
          completion: clientDetails.completion,
          amountDetails: clientDetails.amountDetails,
          amountHistory: updatedHistory,
          followUpTime: getSelectedTime,
          action: "update",
        }
      );
      console.log("Client History Save Succressfully", resultHistory);
      if (result && resultHistory) {
        alert("Client successfully Updated");
      } else {
        alert("Installation Done User successfully Updated");
      }
      setRefreshHistory((prev) => !prev);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.log("internal error", err);
    }
  };

  //POINTER TO MOVE NEXT
  const handleNextClientDetails = () => {
    if (isTaskMode === true) {
      if (currentClientCount + 1 > clientCount) {
        return;
      }
      if (taskIndex < taskClientIdArray.length - 1) {
        const newIndex = taskIndex + 1;
        setTaskIndex(newIndex);
        setCurrentClientCount(newIndex + 1);
        setCurrentClientId(taskClientIdArray[newIndex]);

        console.log("nextcount", newIndex + 1);

        // console.log("next taskClientIdArray Id", taskClientIdArray[newIndex]);
      }
    } else {
      const id = localStorage.getItem("lastClientId");
      if (id) {
        const currentIdNumber = parseInt(id.replace("C", ""));
        const nextCount = currentIdNumber + 1;
        // console.log("nextCount", nextCount);
        const nextId = `C${String(nextCount).padStart(7, "0")}`;
        // console.log("nextId", nextId);
        setCurrentClientId(nextId);
        localStorage.setItem("lastClientId", nextId);
      } else {
        const currentIdNumber = parseInt(currentClientId.replace("C", ""));
        const nextCount = currentIdNumber + 1;
        const nextId = `C${String(nextCount).padStart(7, "0")}`;
        setCurrentClientId(nextId);
        localStorage.setItem("lastClientId", nextId);
      }
      setNewClientFormId(null);
      console.log("lastClient save in localstorage", currentClientId);
    }
    setIsUnsavedNewForm(false);
    handleTimeChange("HH:MM:SS AM/PM");
    handleNewTimeChange("HH:MM:SS AM/PM");
  };

  //POINTER TO MOVE PREVIOUSz
  const handlePrevClientDetails = () => {
    if (isTaskMode) {
      if (taskIndex > 0) {
        const newIndex = taskIndex - 1;
        setTaskIndex(newIndex);
        setCurrentClientId(taskClientIdArray[newIndex]);
        setCurrentClientCount(newIndex + 1);

        console.log("prevcount", newIndex + 1);
        console.log("prev taskClientIdArray Id", taskClientIdArray[newIndex]);
      }
    } else {
      const id = localStorage.getItem("lastClientId");
      if (id) {
        const currentIdNumber = parseInt(id.replace("C", ""));
        if (currentIdNumber <= 1) return;
        const nextCount = currentIdNumber - 1;
        console.log("nextCount", nextCount);
        const nextId = `C${String(nextCount).padStart(7, "0")}`;
        setCurrentClientId(nextId);
        setNewClientFormId(null);
        localStorage.setItem("lastClientId", nextId);
        console.log("lastClient save in localstorage", nextId);
      }
    }

    setIsUnsavedNewForm(false);
    handleTimeChange("HH:MM:SS AM/PM");
  };

  //CREATE NEW FORM FOR CLIENT DB
  const handleClientNewForm = async () => {
    try {
      const result = await axios.get(`${base_url}/raw-data/get-last-client-id`);
      console.log("result hai", result.data.lastClientId);
      const newSrno = result.data.lastClientId.client_serial_no_id + 1;
      const lastClientId = result.data.lastClientId.client_id;
      const numCount = parseInt(lastClientId.replace("C", ""));
      const clientNewId = `C${String(numCount + 1).padStart(7, "0")}`;
      const TodaysDate = new Date().toISOString().split("T")[0];
      setClientDetails({
        sr_no: newSrno,
        clientId: clientNewId,
        followUpDate: TodaysDate,
        bussinessNames: [{ label: "Business Name", value: "" }],
        clientName: "",
        numbers: [{ label: "Primary Number", value: "" }],
        emails: [{ label: "Email 1", value: "" }],
        website: "",
        addresses: [{ label: "Address 1", value: "" }],
        pincode: "",
        district: "",
        state: "",
        country: "",
        assign: { assignBy: "", assignTo: "" },
        product: "",
        stage: "",
        quotationShare: "",
        expectedDate: "",
        remarks: "",
        callType: "",
        verifiedBy: "",
        label: "",
        tracker: {
          new_data_db: { completed: false, completedDate: "" },
          leads_db: { completed: false, completedDate: "" },
          training_db: { completed: false, completedDate: "" },
          follow_up_db: { completed: false, completedDate: "" },
          installation_db: { completed: false, completedDate: "" },
          demo_db: { completed: false, completedDate: "" },
          recovery_db: {
            completed: false,
            completedDate: "",
            recoveryHistory: [],
          },
          target_db: { completed: false, completedDate: "" },
          no_of_new_calls_db: { completed: false, completedDate: "" },
          support_db: { completed: false, completedDate: "" },
          out_bound_db: { completed: false, completedDate: "" },
          in_bound_db: { completed: false, completedDate: "" },
          hot_db: { completed: false, completedDate: "" },
          lost_db: { completed: false, completedDate: "" },
          create_db: { completed: false, completedDate: "" },
          update_db: { completed: false, completedDate: "" },
          deactivate_db: { completed: false, completedDate: "" },
        },
        amountDetails: {
          totalAmount: 0,
          paidAmount: 0,
          balanceAmount: 0,
          extraCharges: 0,
          finalCost: 0,
          newAmount: 0,
        },
        label: "",
        completion: {
          receivedProduct: "",
          status: "",
          newExpectedDate: "",
          newTime: "",
          newRemark: "",
        },
        amountHistory: [],
      });
      // setIsClientIdAvailableInDb(false)

      setCurrentClientId(clientNewId);
      setIsUnsavedNewForm(true);
      setSelectedStageOptions([]);
      setSelectedUserProduct([]);
      setCheckHotClient(false);
      setFeedback(false);
    } catch (err) {
      console.log("internal errro", err);
    }
  };

  //CURRENT DATE FUNCTION
  function todaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const TodaysDate = `${year}-${month}-${day}`;
    // console.log("date", TodaysDate);
    return TodaysDate;
  }

  //TIMEPICKERHANDLER FOR TIME
  const handleTimeChange = (time) => {
    if (time === "HH:MM:SS AM/PM") {
      time = "NA";
    }
    setGetSelectedTime(time);
    // console.log("Selected Time:", time);
  };
  const handleNewTimeChange = (time) => {
    if (time === "HH:MM:SS AM/PM") {
      time = "NA";
    }
    setGetSelectedNewTime(time);
    // console.log("Selected Time:", time);
  };

  const handleStageChange = (selectedOptions) => {
    console.log("Full Selected Objects:", selectedOptions);

    let updatedOptions = [...(selectedOptions || [])];
    const tempStageValues = updatedOptions.map((item) => item.value);
    // console.log("ream",selectedStageValues)

    if (tempStageValues.includes("hot_db")) {
      updatedOptions = updatedOptions.filter((opt) => opt.value !== "lost_db");
    } else if (tempStageValues.includes("lost_db")) {
      updatedOptions = updatedOptions.filter((opt) => opt.value !== "hot_db");
    }
    setSelectedStageOptions(updatedOptions);
    // Recalculate selectedStageValues after removing hot/lost conflict
    const selectedStageValues = updatedOptions.map((item) => item.value);

    if (selectedStageValues.includes("recovery_db")) {
      setCheckRecovery(true);
    } else {
      setCheckRecovery(false);
    }

    if (selectedStageValues.includes("installation_db")) {
      setCheckInstallation(true);
    } else {
      setCheckInstallation(false);
      setClientDetails((prev) => ({
        ...prev,
        totalAmount: "",
        paidAmount: "",
      }));
    }

    setClientDetails((prev) => {
      const updatedTracker = { ...(prev.tracker || {}) };
      //Loop over all tracker keys and update based on selection
      console.log("updatedTracker", updatedTracker);
      Object.keys(updatedTracker).forEach((key) => {
        // Object.keys(updatedTracker) contains all keys from tracker object ---> ["follow_up", "installation_db", "demo_db", "hot_db", "lost_db"]
        if (selectedStageValues.includes(key)) {
          updatedTracker[key] = {
            completed: true,
            completedDate: new Date().toLocaleDateString("en-GB"),
          };
        } else {
          updatedTracker[key] = {
            completed: false,
            completedDate: "",
          };
        }
        console.log(
          `Key: ${key}, Completed: ${updatedTracker[key].completed}, Date: ${updatedTracker[key].completedDate}`
        );
      });

      return {
        ...prev,
        tracker: updatedTracker,
      };
    });
    // console.log("yooo")
  };

  //FUNCTION FOR FETCH ALL SEARCH CLIENT DATA
  const handleAllSearchClientData = async () => {
    try {
      console.log(
        "searches are",
        clientDetails.clientName,
        clientDetails.bussinessNames[0].value,
        clientDetails.numbers[0].value,
        clientDetails.addresses[0].value,
        clientDetails.emails[0].value,
        clientDetails.pincode,
        clientDetails.district,
        clientDetails.state,
        clientDetails.clientId
      );
      const result = await axios.get(
        `${base_url}/clients/search-allclient-match`,
        {
          params: {
            name: clientDetails.clientName || "",
            opticalName: clientDetails.bussinessNames[0].value || "",
            mobile: clientDetails.numbers[0].value || "",
            address: clientDetails.addresses[0].value || "",
            email: clientDetails.emails[0].value || "",
            pincode: clientDetails.pincode || "",
            district: clientDetails.district || "",
            state: clientDetails.state || "",
            clientId: clientDetails.clientId || "",
          },
        }
      );
      setAllSearchClientData(result.data);
      console.log("search found", result.data);
    } catch (err) {
      console.log("internal error", err);
    }
  };

  const handleClientIdClick = (clickId) => {
    console.log("client page ", clickId);
    setCurrentClientId(clickId);
  };

  const handleSwichTo = () => {
    navigate("/userpage");
  };

  const handleSelectedUserProduct = (selectedOptions) => {
    setSelectedUserProduct(selectedOptions);
  };

  const hanldeAmountChange = (fieldType, value) => {
    value = Math.abs(parseFloat(value)) || 0;
    const calculation = handleCalculation(fieldType, value);
    setClientDetails((prev) => ({
      ...prev,
      amountDetails: {
        ...prev.amountDetails,
        [fieldType]: value,
        totalAmount: calculation.totalAmount,
        paidAmount: calculation.paidAmount,
        balanceAmount: calculation.balanceAmount,
      },
    }));
  };

  const handleCalculation = (fieldType, value) => {
    const finalCost = parseFloat(clientDetails.amountDetails.finalCost) || 0;
    const extraCharges =
      parseFloat(clientDetails.amountDetails.extraCharges) || 0;
    const newAmount = parseFloat(clientDetails.amountDetails.newAmount) || 0;

    let updatedFinalCost = finalCost;
    let updatedExtraCharges = extraCharges;
    let updatedNewAmount = newAmount;

    if (fieldType === "finalCost") updatedFinalCost = value || 0;
    if (fieldType === "extraCharges") updatedExtraCharges = value || 0;
    if (fieldType === "newAmount") updatedNewAmount = value || 0;

    const totalAmount = updatedFinalCost + updatedExtraCharges;
    const paidAmount = updatedNewAmount;
    const balanceAmount = totalAmount - paidAmount;

    return { totalAmount, paidAmount, balanceAmount };
  };

  const handleNewVisit = () => {
    setSelectedUserProduct([]);
    setSelectedStageOptions([]);
    handleTimeChange("HH:MM:SS AM/PM");
    setCheckInstallation(false);
    setClientDetails((prev) => ({
      ...prev,
      followUpTime: "",
      expectedDate: "",
      remarks: "",
      callType: "",
      quotationShare: "",
      label: "",
      completion: {
        receivedProduct: "",
        status: "",
        newExpectedDate: "",
        newTime: "",
        newRemark: "",
      },
      tracker: {
        new_data_db: { completed: false, completedDate: "" },
        leads_db: { completed: false, completedDate: "" },
        training_db: { completed: false, completedDate: "" },
        follow_up_db: { completed: false, completedDate: "" },
        installation_db: { completed: false, completedDate: "" },
        demo_db: { completed: false, completedDate: "" },
        recovery_db: {
          completed: false,
          completedDate: "",
          recoveryHistory: [],
        },
        target_db: { completed: false, completedDate: "" },
        no_of_new_calls_db: { completed: false, completedDate: "" },
        support_db: { completed: false, completedDate: "" },
        out_bound_db: { completed: false, completedDate: "" },
        in_bound_db: { completed: false, completedDate: "" },
        hot_db: { completed: false, completedDate: "" },
        lost_db: { completed: false, completedDate: "" },
        create_db: { completed: false, completedDate: "" },
        update_db: { completed: false, completedDate: "" },
        deactivate_db: { completed: false, completedDate: "" },
      },
      amountDetails: {
        totalAmount: "",
        paidAmount: "",
        extraCharges: "",
        finalCost: "",
        newAmount: "",
        balanceAmount: "",
      },
      amountHistory: [
        {
          date: "",
          time: "",
          totalAmount: "",
          paidAmount: "",
          extraCharges: "",
          finalCost: "",
          newAmount: "",
          balanceAmount: "",
          updatedBy: "",
        },
      ],
    }));
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.content}>
          <header
            className={styles.header}
            style={{
              display: "flex",
              justifyContent: "end",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "30%",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "start",
                height: "100%",
                padding: "10px",
                // background: "red",
                gap: "5px",
              }}
            >
              <label
                htmlFor=""
                style={{
                  // background: "white",
                  padding: "3px 10px",
                  width: "15%",
                  textAlign: "cnter",
                }}
              >
                SrNo
              </label>
              <input
                type="text"
                value={clientDetails.sr_no}
                readonly
                style={{
                  padding: "2px 10px",
                  width: "30%",
                  textAlign: "center",
                }}
              />
              <input
                type="text"
                value={clientDetails.clientId}
                onChange={(e) => {
                  handleSearchInput("clientId", e.target.value);
                }}
                style={{
                  padding: "2px 10px",
                  width: "40%",
                  textAlign: "center",
                }}
              />
            </div>
            <div style={{ width: "40%", position: "relative" }}>
              <h2 style={{ fontSize: "30px" }}>
                {" "}
                <strong style={{ fontSize: "30px", color: "red" }}>
                  Client
                </strong>{" "}
                Details
              </h2>
              {checkHotClient && (
                <FaUserClock
                  title="Hot Client"
                  style={{
                    fontSize: "40px",
                    color: "black",
                    position: "absolute",
                    right: "20%",
                    top: "0px",
                    background: "white",
                    padding: "2px",
                    borderRadius: "100%",
                  }}
                />
              )}
            </div>
            <div
              style={{
                width: "30%",
                display: "flex",
                gap: "5px",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                // background:'red'
              }}
            >
              {databaseStatus === "raw_db" ? (
                <span
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <BsDatabaseFillDown
                    title="Raw DB"
                    style={{
                      color: "red",
                      backgroundColor: "white",
                      fontSize: "18px",
                      borderRadius: "5px",
                    }}
                  />
                </span>
              ) : databaseStatus === "client_db" ? (
                <span
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                    // background: "red",
                  }}
                >
                  {verifiedByEmployee ? (
                    <span
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                        // background: "red",
                      }}
                    >
                      {" "}
                      Verified by {verifiedByEmployee}
                      <BsShieldCheck
                        style={{
                          color: "green",
                          backgroundColor: "white",
                          fontSize: "18px",
                          borderRadius: "20px",
                        }}
                      />
                    </span>
                  ) : (
                    <span
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                      }}
                    >
                      {" "}
                      Verified
                      <BsShieldX
                        style={{
                          color: "red",
                          backgroundColor: "white",
                          fontSize: "18px",
                          borderRadius: "20px",
                        }}
                      />{" "}
                    </span>
                  )}
                  <BsDatabaseFillDown
                    title="Client DB"
                    style={{
                      color: "blue",
                      backgroundColor: "white",
                      fontSize: "18px",
                      borderRadius: "5px",
                    }}
                  />
                </span>
              ) : (
                <span
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  {" "}
                  Verified
                  <BsShieldX
                    style={{
                      color: "red",
                      backgroundColor: "white",
                      fontSize: "18px",
                      borderRadius: "20px",
                    }}
                  />{" "}
                </span>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                }}
              >
                <label htmlFor="">
                  Follow Up Date{" "}
                  {clientDetails.time && (
                    <span
                      style={{
                        border: "1px solid",
                        backgroundColor: "white",
                        padding: "2px 10px",
                      }}
                    >
                      {clientDetails.time}
                    </span>
                  )}
                </label>

                <input
                  type="date"
                  name=""
                  id=""
                  style={{ padding: "0px 10px" }}
                  value={clientDetails.followUpDate}
                  onChange={(e) => {
                    handleSearchInput("followUpDate", e.target.value);
                  }}
                />
              </div>
            </div>
          </header>

          <div className={styles.basicform}>
            <div className={styles.basic}>
              <h2 style={{ fontSize: "18px" }}>Basic </h2>
            </div>
            <div className={styles["formlayout-down"]}>
              <div>
                <CustomInput
                  type={"text"}
                  label={"Client Name"}
                  name={"clientName"}
                  id={"clientName"}
                  value={clientDetails.clientName}
                  onChange={(e) => {
                    handleSearchInput("clientName", e.target.value);
                  }}
                  placeholder={"Enter Client Name"}
                  required={false}
                />
              </div>
            </div>

            <div className={styles["formlayout-up"]}>
              <AddField
                fieldType={"text"}
                initialLabel={"Bussiness Name *"}
                initialFields={clientDetails.bussinessNames}
                onChange={(values) => {
                  console.log("Bussiness name values", values);
                  const businessNames = values;
                  setClientDetails((prev) => ({
                    ...prev,
                    bussinessNames: businessNames,
                  }));
                }}
              />
              <AddField
                fieldType={"number"}
                initialLabel={"Primary Number *"}
                initialFields={clientDetails.numbers}
                onChange={(values) => {
                  console.log("numbers", values);
                  setClientDetails((prev) => ({
                    ...prev,
                    numbers: values,
                  }));
                }}
              />
              <AddField
                fieldType={"email"}
                initialLabel={"Email 1"}
                initialFields={clientDetails.emails}
                onChange={(values) => {
                  console.log("Email", values);
                  setClientDetails((prev) => ({
                    ...prev,
                    emails: values,
                  }));
                }}
              />
              <AddField
                fieldType={"text"}
                initialLabel={"Address 1"}
                initialFields={clientDetails.addresses}
                onChange={(values) => {
                  console.log("Bussiness name values", values);
                  setClientDetails((prev) => ({
                    ...prev,
                    addresses: values,
                  }));
                }}
              />
            </div>
            <div className={styles["formlayout-down"]}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <div style={{ width: "100%" }}>
                  <CustomInput
                    type={"text"}
                    label={"Website"}
                    name={"website"}
                    id={"website"}
                    value={clientDetails.website}
                    onChange={(e) => {
                      handleSearchInput("website", e.target.value);
                    }}
                    placeholder={"Enter Website"}
                    required={false}
                  />
                </div>
                <div style={{ display: "flex", width: "100%" }}>
                  <CustomInput
                    type={"text"}
                    label={"Assign By"}
                    name={"assign_by"}
                    id={"assign_by"}
                    value={taskDetails?.assignBy_db || "NA"}
                    readonly={true}
                    onChange={(e) => {
                      handleSearchInput("assignBy", e.target.value);
                    }}
                    required={false}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Assign To"}
                    name={"assign_to"}
                    id={"assign_to"}
                    value={taskDetails?.assignTo_db || userLoginId}
                    readonly={true}
                    onChange={(e) => {
                      handleSearchInput("assignTo", e.target.value);
                    }}
                    required={false}
                  />
                </div>
              </div>
              <div>
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <CustomInput
                    type={"number"}
                    label={"Pincode"}
                    name={"pincode"}
                    id={"pincode"}
                    value={clientDetails.pincode}
                    onChange={(e) => {
                      handleSearchInput("pincode", e.target.value);
                    }}
                    placeholder={"Enter pincode"}
                    required={false}
                  />
                  <CustomInput
                    type={"text"}
                    label={"District"}
                    name={"district"}
                    id={"district"}
                    value={clientDetails.district}
                    onChange={(e) => {
                      handleSearchInput("district", e.target.value);
                    }}
                    placeholder={"Enter district"}
                    required={false}
                  />
                </div>
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <CustomInput
                    type={"text"}
                    label={"State"}
                    name={"state"}
                    id={"state"}
                    value={clientDetails.state}
                    onChange={(e) => {
                      handleSearchInput("state", e.target.value);
                    }}
                    placeholder={"Enter state"}
                    required={false}
                  />
                  <CustomInput
                    type={"text"}
                    label={"Country"}
                    name={"country"}
                    id={"country"}
                    value={clientDetails.country}
                    onChange={(e) => {
                      handleSearchInput("country", e.target.value);
                    }}
                    placeholder={"Enter Country"}
                    required={false}
                  />
                </div>
              </div>
            </div>
            {/* =========================FEEDBACK================================ */}
            <div className={styles.feedback}>
              <div className={styles.scheduleTab}>
                <p
                  onClick={() => {
                    setStageTab("Planner");
                  }}
                  className={stageTab === "Planner" && styles.scheduleTab1}
                >
                  Planner
                </p>
                <p
                  onClick={() => {
                    setStageTab("Completion");
                  }}
                  className={stageTab === "Completion" && styles.scheduleTab1}
                >
                  Completion
                </p>
              </div>
              <h2 style={{ fontSize: "18px" }}>Feedback </h2>
              <FaFileSignature
                style={{
                  fontSize: "30px",
                  color: feedback ? "#138808" : "red",
                  padding: "2px",
                }}
              />
              <div style={{ position: "absolute", right: "10px" }}>
                <button onClick={handleNewVisit}>New Visit</button>
              </div>
            </div>

            {/* ================================= PLANNER ============================================================= */}

            <div
              style={{ display: stageTab === "Planner" ? "" : "none" }}
              className={styles["formlayout-down"]}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "5px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <label
                    htmlFor=""
                    style={{ fontSize: "16px", fontWeight: "500" }}
                  >
                    Product
                  </label>
                  <CustomSelect
                    options={userProductList}
                    value={selectedUserProduct}
                    onChange={(selectedOptions) => {
                      handleSelectedUserProduct(selectedOptions);
                    }}
                  />
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <span>Quotation Share</span>
                    <span>
                      <label htmlFor="yes">Yes</label>
                      <input
                        type="radio"
                        name="quotation"
                        id="yes"
                        value="yes"
                        checked={quotationYesNo === true}
                        style={{ marginRight: "5px", marginLeft: "3px" }}
                        onChange={() => {
                          setQuotationYesNo(true);
                        }}
                      />
                      <label htmlFor="no">No</label>
                      <input
                        type="radio"
                        name="quotation"
                        id="no"
                        value="no"
                        checked={quotationYesNo === false}
                        style={{ marginLeft: "3px" }}
                        onChange={() => {
                          setQuotationYesNo(false);
                          handleSearchInput("quotationShare", "");
                        }}
                      />
                    </span>
                  </div>

                  {quotationYesNo && (
                    <input
                      type="text"
                      style={{ padding: "3px 10px", width: "60%" }}
                      value={clientDetails.quotationShare}
                      onChange={(e) => {
                        handleSearchInput("quotationShare", e.target.value);
                      }}
                    />
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // background: "red",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "80%",
                  }}
                >
                  <label
                    htmlFor=""
                    style={{ fontSize: "16px", fontWeight: "500" }}
                  >
                    Stage
                  </label>

                  <CustomSelect
                    options={stageOptions}
                    value={selectedStageOptions}
                    onChange={(selected) => {
                      console.log("selected staget", selected);
                      handleStageChange(selected);
                    }}
                    isMulti={true}
                  />
                </div>
                <div style={{ position: "absolute", top: "0px", right: "10%" }}>
                  <label
                    htmlFor=""
                    style={{ fontSize: "16px", fontWeight: "500" }}
                  >
                    Follow Up Time
                  </label>
                  <TimePickerComponent
                    value={getSelectedTime}
                    onTimeChange={handleTimeChange}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginBottom: "5px",
                    }}
                  >
                    Expected Close Date
                    <input
                      type="date"
                      name=""
                      id=""
                      style={{ padding: "0px 10px", width: "60%" }}
                      value={clientDetails.expectedDate}
                      onChange={(e) => {
                        handleSearchInput("expectedDate", e.target.value);
                        setClientDetails((prev) => ({
                          ...prev,
                          tracker: {
                            ...prev.tracker,
                            leads_db: {
                              completed: true,
                              completedDate: new Date().toLocaleDateString(
                                "en-GB"
                              ),
                            },
                          },
                        }));
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginBottom: "5px",
                    }}
                  >
                    Call Type
                    <select
                      name=""
                      id=""
                      style={{ padding: "2px 10px", width: "60%" }}
                      value={clientDetails.callType}
                      onChange={(e) => {
                        const selectCallType = e.target.value;
                        if (selectCallType === "Out-bound") {
                          setClientDetails((prev) => ({
                            ...prev,
                            tracker: {
                              ...prev.tracker,
                              out_bound_db: {
                                completed: true,
                                completedDate: new Date().toLocaleDateString(
                                  "en-GB"
                                ),
                              },
                            },
                          }));
                        } else if (selectCallType === "In-bound") {
                          setClientDetails((prev) => ({
                            ...prev,
                            tracker: {
                              ...prev.tracker,
                              in_bound_db: {
                                completed: true,
                                completedDate: new Date().toLocaleDateString(
                                  "en-GB"
                                ),
                              },
                            },
                          }));
                        }
                        handleSearchInput("callType", e.target.value);
                      }}
                    >
                      <option value="Out-bound">Out-bound</option>
                      <option value="In-bound">In-bound</option>
                    </select>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    Label
                    <select
                      name=""
                      id=""
                      style={{ padding: "2px 10px", width: "60%" }}
                      value={clientDetails.label}
                      onChange={(e) => {
                        handleSearchInput("label", e.target.value);
                      }}
                    >
                      <option value="">NA</option>
                      <option value="Hot">Hot</option>
                      <option value="Interested">Interested</option>
                      <option value="Less Interested">Less Interested</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="">Remark</label>
                  <textarea
                    className={styles["remarks-field"]}
                    value={clientDetails.remarks}
                    onChange={(e) => {
                      handleSearchInput("remarks", e.target.value);
                    }}
                  ></textarea>
                </div>
              </div>
              {checkInstallation ? (
                <div
                  className={styles.recovery}
                  style={{ width: "90%", padding: "10px" }}
                >
                  <span style={{ display: "flex" }}>
                    <CustomInput
                      type="number"
                      label={"Final Cost"}
                      value={clientDetails.amountDetails.finalCost}
                      onChange={(e) => {
                        hanldeAmountChange("finalCost", e.target.value);
                      }}
                    />
                    <CustomInput
                      type="number"
                      label={"Extra Charges"}
                      value={clientDetails.amountDetails.extraCharges}
                      onChange={(e) => {
                        hanldeAmountChange("extraCharges", e.target.value);
                      }}
                    />
                    <CustomInput
                      type="number"
                      label={"Total"}
                      value={clientDetails.amountDetails.totalAmount}
                      onChange={(e) => {
                        hanldeAmountChange("totalAmount", e.target.value);
                      }}
                    />
                  </span>
                  <span style={{ display: "flex" }}>
                    <CustomInput
                      type="number"
                      label={"New Amount"}
                      value={clientDetails.amountDetails.newAmount}
                      onChange={(e) => {
                        hanldeAmountChange("newAmount", e.target.value);
                      }}
                    />
                    <CustomInput
                      type="number"
                      label={"Paid"}
                      value={clientDetails.amountDetails.paidAmount}
                      onChange={(e) => {
                        hanldeAmountChange("paidAmount", e.target.value);
                      }}
                      readonly={true}
                    />
                    <CustomInput
                      type="number"
                      label={"Balance"}
                      value={clientDetails.amountDetails.balanceAmount}
                      onChange={(e) => {
                        hanldeAmountChange("balanceAmount", e.target.value);
                      }}
                    />
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            {/* =================================== COMPLETION ========================================================             */}

            <div
              style={{ display: stageTab === "Completion" ? "" : "none" }}
              className={styles["formlayout-down"]}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "5px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  Product
                  <input
                    type="text"
                    name=""
                    id=""
                    style={{ padding: "2px 10px", width: "60%" }}
                    value={clientDetails.completion.receivedProduct}
                  />
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginBottom: "5px",
                    }}
                  >
                    Stage
                    <select
                      name=""
                      id=""
                      style={{ padding: "2px 10px", width: "60%" }}
                      value={clientDetails.completion.newStage}
                      onChange={(e)=>{setClientDetails((prev)=>({
                        ...prev,
                        completion:{
                          ...prev.completion,
                          newStage:e.target.value,
                        }
                      }))}}
                    >
                      <option value="">--Select--</option>
                      <option value="Demo">Demo</option>
                      <option value="FollowUp">FollowUp</option>
                      <option value="Installation">Installation</option>
                      <option value="Hot">Hot</option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // background: "red",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    marginBottom: "5px",
                  }}
                >
                  Expected Close Date
                  <input
                    type="date"
                    name=""
                    id=""
                    style={{ padding: "0px 10px", width: "30%" }}
                    value={clientDetails.completion.newExpectedDate}
                    onChange={(e) => {
                      setClientDetails((prev) => ({
                        ...prev,
                        completion: {
                          ...prev.completion,
                          newExpectedDate: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div style={{ position: "absolute", top: "0px", right: "10%" }}>
                  <label
                    htmlFor=""
                    style={{ fontSize: "16px", fontWeight: "500" }}
                  >
                    Follow Up Time
                  </label>
                  <TimePickerComponent
                    value={getSelectedNewTime}
                    onTimeChange={handleNewTimeChange}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "5px",
                  }}
                ></div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="">Remark</label>
                  <textarea
                    className={styles["remarks-field"]}
                    value={clientDetails.completion.newRemark}
                    onChange={(e) => {
                      setClientDetails((prev) => ({
                        ...prev,
                        completion: {
                          ...prev.completion,
                          newRemark: e.target.value,
                        },
                      }));
                    }}
                  ></textarea>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  marginBottom: "5px",
                }}
              >
                Status
                <select
                  name=""
                  id=""
                  style={{ padding: "2px 10px", width: "30%" }}
                  value={clientDetails.completion.status}
                  onChange={(e) => {
                    setClientDetails((prev) => ({
                      ...prev,
                      completion: {
                        ...prev.completion,
                        status: e.target.value,
                      },
                    }));
                  }}
                >
                  <option value="">--Select--</option>
                  <option value="Done">Done</option>
                  <option value="Postponed">Postponed</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </div>
            </div>

            <div className={styles.btn}>
              <div
                className={styles["arrow-icon"]}
                style={{
                  position: "relative",
                  backgroundColor:
                    currentClientCount - 1 === 0 ? "lightgray" : "",
                }}
                onClick={handlePrevClientDetails}
              >
                {isTaskMode && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      width: "15px",
                      height: "15px",
                      background: "red",
                      borderRadius: "100%",
                      fontSize: "12px",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {currentClientCount - 1}
                  </span>
                )}
                <FaAngleLeft />
              </div>
              <div
                style={{
                  width: "25px",
                  height: "25px",
                  backgroundColor: "rgb(92, 55, 55)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "100%",
                  fontSize: "140px",
                }}
                onClick={() => {
                  handleSwichTo();
                }}
              >
                <HiOutlineRefresh
                  style={{ fontSize: "40px", color: "white" }}
                />
              </div>
              <button
                disabled={!checkPermissionManagement?.create_P}
                onClick={() => {
                  handleClientNewForm();
                  setIsNewDataEntry(true);
                }}
              >
                New
              </button>
              {!isClientIdAvailableInDb && (
                <button onClick={handleSaveClientDetails}>Save</button>
              )}
              {isClientIdAvailableInDb && (
                <button
                  onClick={handleUpdateClientDetails}
                  disabled={!checkPermissionManagement?.update_P}
                >
                  Update
                </button>
              )}
              <button disabled={!checkPermissionManagement?.download_P}>
                Download
              </button>
              <button disabled={!checkPermissionManagement?.view_P}>
                View
              </button>
              <button disabled={!checkPermissionManagement?.uploadFile_P}>
                Upload
              </button>
              <button
                onClick={() => {
                  handleAllSearchClientData();
                  setCheckDisplaySearchClients((prev) => !prev);
                }}
              >
                Search
              </button>
              {checkDisplaySearchClients && (
                <DisplaySearchClientsPortal
                  onClientIdClick={handleClientIdClick}
                  onAllSearchClientData={allSearchClientData}
                  onClose={() => {
                    setCheckDisplaySearchClients(false);
                  }}
                />
              )}
              <div
                className={styles["arrow-icon"]}
                onClick={handleNextClientDetails}
                style={{
                  position: "relative",
                  backgroundColor:
                    currentClientCount === clientCount ? "lightgray" : "",
                }}
              >
                <FaAngleRight />
                {isTaskMode && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      width: "15px",
                      height: "15px",
                      background: "red",
                      borderRadius: "100%",
                      fontSize: "12px",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    {clientCount - currentClientCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <History
            onRefresh={refreshHistory}
            onCurrentClientId={clientDetails.clientId}
          />
        </div>
      </div>
    </>
  );
};

export default SearchPincode;
