import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./UserPage.module.css";
import AddField from "../ClientPage/AddField";
import CustomInput from "../../UI/CustomInput";
import CustomSelect from "../CustomSelect";

import { BsShieldCheck } from "react-icons/bs";
import { BsShieldX } from "react-icons/bs";
import { BsDatabaseFillDown } from "react-icons/bs";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import TimePickerComponent from "../../UI/TimePickerComponent";
import { FaFlag } from "react-icons/fa";
import { FaUserClock } from "react-icons/fa6";
import History from "../HistoryPage/History";
import { HiOutlineRefresh } from "react-icons/hi";

const UserPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const executiveId = state?.userId || "E02_SA";
  const [getSelectedTime, setGetSelectedTime] = useState("");
  const taskDetails = state?.taskdata || "";
  // console.log("executiveId--", executiveId);
  // console.log("taskDetails--", taskDetails);
  const [region, setRegion] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [verifiedByEmployee, setVerifiedByEmploye] = useState("SA");
  const [countryOptions, setCountryOptions] = useState([]);
  const [quotationYesNo, setQuotationYesNo] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [isUnsavedNewForm, setIsUnsavedNewForm] = useState(false);
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
    { label: "Support", value: "support_db" },
    { label: "Training", value: "training_db" },
    { label: "Hot", value: "hot_db" },
    { label: "Lost", value: "lost_db" },
    { label: "Follow up", value: "follow_up_db" },
    { label: "Recovery", value: "recovery_db" },
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
  const [userIdArray, setUserIdArray] = useState([]);
  const [userIndex, setUserIndex] = useState(0);
  const [currentClientId, setCurrentClientId] = useState("");
  const [isTaskMode, setIsTaskMode] = useState(false);
  const [clientCount, setClientCount] = useState("");
  const [currentClientCount, setCurrentClientCount] = useState(1);
  const [isClientIdAvailableInDb, setIsClientIdAvailableInDb] = useState("");
  const [userLoginId, setUserLoginId] = useState("E02_SA");
  const [checkRecovery, setCheckRecovery] = useState(true);
  const [checkInstallation, setCheckInstallation] = useState(false);
  const [checkHotClient, setCheckHotClient] = useState(false);
  const [checkDisplaySearchClients, setCheckDisplaySearchClients] =
    useState(false);
  const [allSearchClientData, setAllSearchClientData] = useState([]);
  const [selectedUserProduct, setSelectedUserProduct] = useState([]);
  const [storedtotalAmount, setStoredTotalAmount] = useState("");
  const [storedPaidAmount, setStoredPaidAmount] = useState("");
  const [storedBalanceAmount, setStoredBalanceAmount] = useState("");
  const [refreshHistory, setRefreshHistory] = useState(false);

  useEffect(() => {
    const fetchUserIds = async () => {
      const getIds = await axios.get(
        "http://localhost:3000/subscribe-user/get-usersubscribeids"
      );
      console.log("getIds", getIds.data.result);
      if (getIds.data.result && getIds.data.result.length > 0) {
        const userSubscribeIds = getIds.data.result.map(
          (ids) => ids.client_subscription_id
        );
        setUserIdArray(userSubscribeIds);
        setCurrentClientId(userSubscribeIds[userIndex] || userSubscribeIds[0]);
      } else {
        if (state) {
          setCurrentClientId(state);
        } else {
          const userSubscriptionId = localStorage.getItem(
            "user-subscription-id"
          );
          if (!localStorage.getItem("user-subscription-id")) {
            localStorage.setItem("user-subscription-id", userSubscriptionId);
          }
          // console.log("usersubscriptionId", userSubscriptionId);
          setCurrentClientId(userSubscriptionId);
        }
      }
    };
    fetchUserIds();
  }, []);

  useEffect(() => {
    if (userIdArray.length > 0) {
      setCurrentClientId(userIdArray[userIndex]);
    }
    console.log("ids index ==>", userIdArray[userIndex]);
    console.log(" index ==>", userIndex);
  }, [userIdArray, userIndex]);

  useEffect(() => {
    if (!currentClientId) return; // Prevent call if ID is empty
    const fetchUserData = async () => {
      try {
        const result = await axios.get(
          ` http://localhost:3000/subscribe-user/search-subscribe-user/${currentClientId}`
        );
        const detail = result?.data?.result;
        console.log("details", detail);

        const businessFields = [
          { label: "Business Name", value: detail.optical_name1_db },
          { label: "Business Name 2", value: detail.optical_name2_db },
          { label: "Business Name 3", value: detail.optical_name3_db },
        ];
        const emails = [
          { label: "Email 1", value: detail.email_1_db },
          { label: "Email 2", value: detail.email_2_db },
          { label: "Email 3", value: detail.email_3_db },
        ];
        const addresses = [
          { label: "Address 1", value: detail.address_1_db },
          { label: "Address 2", value: detail.address_2_db },
          { label: "Address 3", value: detail.address_3_db },
        ];

        const mobiles = [
          { label: "Primary Number", value: detail.mobile_1_db },
          { label: "Secondary Number", value: detail.mobile_2_db },
          { label: "Tertiary Number", value: detail.mobile_3_db },
        ];
        const todayDate = todaysDate();

        setSelectedStageOptions(
          (detail.stage_db || []).filter((item) =>
            stageOptions.some((stg) => stg.value === item.value)
          )
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
          userSubscriptionId: detail.client_subscription_id,
          clientName: detail.client_name_db,
          quotationShare: detail.quotationShare_db,
          followUpDate: detail.expectedDate_db || todayDate,
          expectedDate: "",
          callType: detail.callType_db,
          verifiedBy: detail.verifiedBy_db,
          time: detail.time_db,

          website: detail.website_db,
          database: detail.database_status_db,
          bussinessNames: businessFields,
          numbers: mobiles,
          emails: emails,
          addresses: addresses,
          pincode: detail.pincode_db,
          district: detail.district_db,
          state: detail.state_db,
          country: detail.country_db,
          remarks: detail.remarks_db,
          amountDetails: detail.amountDetails_db,
        }));
        setStoredTotalAmount(
          parseFloat(detail.amountDetails_db.totalAmount) || 0
        );
        setStoredPaidAmount(
          parseFloat(detail.amountDetails_db.paidAmount) || 0
        );
        setStoredBalanceAmount(
          parseFloat(detail.amountDetails_db.balanceAmount) || 0
        );
        setCheckHotClient(detail?.tracking_db?.hot_db?.completed);
      } catch (err) {
        console.log("internal error", err);
      }
    };

    fetchUserData();
  }, [currentClientId]);

  //WHEN PINCODE ENTER AUTO FETCH STATE,DISTRICT, DEBOUNCING USED
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (
        clientDetails.pincode ||
        clientDetails.district ||
        clientDetails.state
      ) {
        fetchRegionData();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [clientDetails.pincode, clientDetails.district, clientDetails.state]);

  const fetchRegionData = async () => {
    try {
      if (clientDetails.pincode) {
        const searching = {
          pincode: clientDetails.pincode,
          limit: 50,
          lastId: lastId || undefined,
        };

        const pincodeRes = await axios.get(
          `http://localhost:3000/pincode/search-pincode`,
          { params: searching }
        );
        const regionData = pincodeRes.data.data;
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
          district: uniqueDistricts[0] || prev.district,
          state: uniqueState[0] || prev.state,
          country: uniqueCountry[0] || prev.country,
        }));
      }

      // Second API for fetching based on names
      const placeData = await axios.get(
        `http://localhost:3000/pincode/search-getplaces`,
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
      setDistrictOptions(regionData.districtname);
      setStateOptions(regionData.statename);
    } catch (err) {
      console.error("Error fetching region data:", err);
    }
  };

  //FETCHING ASSING PRODUCT TO EXECUTIVE BY SA/ADMIN
  useEffect(() => {
    const userProductFetch = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3000/users/search-by-user/${userLoginId}`
        );
        console.log("product", result.data?.assignProduct);
        const productsList = result.data?.assignProduct.map((item) => ({
          label: item,
          value: item,
        }));
        console.log("product", productsList);
        setUserProductList(productsList);
      } catch (err) {
        console.log("internal error", err);
      }
    };
    userProductFetch();
  }, []);

  //FETCHING PERMISSION OF USER CREATE,UPDATE,DELETE
  useEffect(() => {
    async function fetch() {
      const result = await axios.get(
        `http://localhost:3000/users/search-by-permission/${executiveId}`
      );
      const permission = result.data;
      // console.log("permsison", permission);
      setCheckPermissionManagement(permission);
    }
    fetch();
  }, []);

  function todaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const TodaysDate = `${year}-${month}-${day}`;
    // console.log("date", TodaysDate);
    return TodaysDate;
  }

  const handleSearchInput = (name, value) => {
    console.log(value);
    setClientDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hanldeAmountChange = (fieldType, value) => {
    value = Math.abs(parseFloat(value)) || 0;
    const calculation = handleCalculation(fieldType, value);

    console.log(fieldType, "=>", value);

    setClientDetails((prev) => ({
      ...prev,
      amountDetails: {
        ...prev.amountDetails,
        [fieldType]: value,
        totalAmount: storedtotalAmount,
        paidAmount: calculation.paidAmount,
        balanceAmount: calculation.balanceAmount,
      },

      amountHistory: [
        ...prev.amountHistory,
        {
          date: new Date().toLocaleDateString("en-GB"),
          time: new Date().toLocaleTimeString(),
          updatedBy: userLoginId,
          finalCost: prev.amountDetails.finalCost,
          extraCharges: prev.amountDetails.extraCharges,
          newAmount:
            fieldType === "newAmount" ? value : prev.amountDetails.newAmount,
          totalAmount: calculation.totalAmount,
          paidAmount: calculation.paidAmount,
          balanceAmount: calculation.balanceAmount,
        },
      ],
    }));
    console.log("clientDetails.amountDetails=>", clientDetails.amountDetails);
  };

  const handleCalculation = (fieldType, value) => {
    const totalAmount = parseFloat(storedtotalAmount) || 0;
    const paidAmount = parseFloat(storedPaidAmount) || 0;
    const balanceAmount = parseFloat(storedBalanceAmount) || 0;

    let updatedPaidAmount = paidAmount;
    let updatedBalanceAmount = balanceAmount;

    if (fieldType === "newAmount") {
      const newPayment = parseFloat(value) || 0;
      updatedPaidAmount = paidAmount + newPayment;
      updatedBalanceAmount = balanceAmount - newPayment;
    }

    return {
      totalAmount,
      paidAmount: updatedPaidAmount,
      balanceAmount: updatedBalanceAmount,
    };
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
  const handleSelectedUserProduct = (selectOptions) => {
    console.log("product list", selectOptions);
    setSelectedUserProduct(selectOptions);
  };
  const handleSwichTo = () => {
    navigate("/client-page");
  };

  const handleTimeChange = (time) => {
    if (time === "HH:MM:SS AM/PM") {
      time = "NA";
    }
    setGetSelectedTime(time);
  };
  const handlePrevButton = () => {
    if (userIndex > 0) {
      setUserIndex((prev) => prev - 1);
    }
  };
  const handleNextButton = () => {
    if (userIndex < userIdArray.length - 1) {
      setUserIndex((prev) => prev + 1);
    }
  };
  const handleUpdateUserDetails = async () => {
    console.log("selectedUserProduct", selectedUserProduct);
    try {
      clientDetails.tracker.no_of_new_calls_db = {
        completed: true,
        completedDate: new Date().toLocaleDateString("en-GB"),
      };

      const result = await axios.put(
        `http://localhost:3000/subscribe-user/update-subscribe-user/${currentClientId}`,
        {
          clientSerialNo: clientDetails.sr_no,
          clientId: clientDetails.userSubscriptionId,
          userId: userLoginId || clientDetails.assignTo,
          bussinessNames: clientDetails.bussinessNames,
          clientName: clientDetails.clientName,
          numbers: clientDetails.numbers,
          emails: clientDetails.emails,
          website: clientDetails.website,
          addresses: clientDetails.addresses,
          pincode: clientDetails.pincode,
          district: clientDetails.district,
          state: clientDetails.state,
          assignBy: clientDetails.assignBy,
          assignTo: clientDetails.assignTo || userLoginId,
          product: selectedUserProduct.map((item) => ({
            label: item.label,
            value: item.label,
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
          action: clientDetails.action,
          database: clientDetails.database,
          tracker: clientDetails.tracker,
          amountDetails: clientDetails.amountDetails,
          amountHistory: clientDetails.amountHistory,
          followUpTime: getSelectedTime,
          action: "update User",
        }
      );

      console.log("User Updated Successfully", result);

      const resultHistory = await axios.post(
        "http://localhost:3000/history/create-history",
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
          assignBy: taskDetails.assignBy_db || "NA",
          assignTo: taskDetails.assignTo_db || userLoginId,
          product: selectedUserProduct.map((item) => ({
            label: item.label,
            value: item.label,
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
          amountDetails: clientDetails.amountDetails,
          amountHistory: clientDetails.amountHistory,
          isUserPage: true,
          followUpTime: getSelectedTime,
          action: "update User",
        }
      );
      console.log("Client History Save Succressfully", resultHistory);
      if (result && resultHistory) {
        alert("User successfully Updated");
      }

      setRefreshHistory((prev) => !prev);
    } catch (err) {
      console.log("internal error", err);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <header className={styles.header}>
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
              style={{ padding: "2px 10px", width: "30%", textAlign: "center" }}
            />
            <input
              type="text"
              value={clientDetails.userSubscriptionId}
              readonly
              style={{ padding: "2px 10px", width: "40%", textAlign: "center" }}
            />
          </div>
          <div style={{ width: "40%", position: "relative" }}>
            <h2 style={{ fontSize: "30px" }}>
              User{" "}
              <strong
                style={{
                  fontSize: "30px",
                  color: "white",
                  WebkitTextStroke: "1px red",
                }}
              >
                Details
              </strong>
            </h2>
            {checkHotClient && (
              <FaUserClock
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
                  background: "red",
                }}
              >
                {verifiedByEmployee ? (
                  <span
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "red",
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
                <span
                  style={{
                    border: "1px solid",
                    backgroundColor: "white",
                    padding: "2px 10px",
                  }}
                >
                  {clientDetails.time}
                </span>
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
              initialLabel={"Business Name"}
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
              initialLabel={"Primary Number"}
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
                  value={"NA"}
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
                  value={userLoginId}
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
          <div className={styles.feedback}>
            <h2 style={{ fontSize: "18px" }}>Feedback </h2>
          </div>
          <div className={styles["formlayout-down"]}>
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
                <label
                  htmlFor=""
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  Quotation Share{" "}
                  <span>
                    <label htmlFor="yes">Yes </label>
                    <input
                      type="radio"
                      name="quotation"
                      id="yes"
                      value="yes"
                      checked={quotationYesNo === true}
                      style={{ marginRight: "5px" }}
                      onChange={() => {
                        setQuotationYesNo(true);
                      }}
                    />
                    <label htmlFor="no">No </label>
                    <input
                      type="radio"
                      name="quotation"
                      id="no"
                      value="no"
                      checked={quotationYesNo === false}
                      onChange={() => {
                        setQuotationYesNo(false);
                        handleSearchInput("quotationShare", "");
                      }}
                    />
                  </span>
                </label>

                {quotationYesNo && (
                  <input
                    type="text"
                    name=""
                    id=""
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
                <TimePickerComponent onTimeChange={handleTimeChange} />
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
            {checkRecovery ? (
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
                    readonly={true}
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
                    readonly={true}
                    label={"Paid"}
                    value={clientDetails.amountDetails.paidAmount}
                    onChange={(e) => {
                      hanldeAmountChange("paidAmount", e.target.value);
                    }}
                  />
                  <CustomInput
                    type="number"
                    label={"Balance"}
                    readonly={true}
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
          <div className={styles.btn}>
            <div
              className={styles["arrow-icon"]}
              style={{
                position: "relative",
                backgroundColor: userIndex === 0 ? "white" : "",
              }}
              onClick={handlePrevButton}
            >
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
              <HiOutlineRefresh style={{ fontSize: "40px", color: "white" }} />
            </div>
            <button onClick={handleUpdateUserDetails}>Update</button>
            <button>Search</button>
            <button>Deactivate</button>

            <div
              className={styles["arrow-icon"]}
              style={{
                position: "relative",
                backgroundColor:
                  userIndex === userIdArray.length - 1 ? "white" : "",
              }}
              onClick={handleNextButton}
            >
              <FaAngleRight />
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
  );
};

export default UserPage;
