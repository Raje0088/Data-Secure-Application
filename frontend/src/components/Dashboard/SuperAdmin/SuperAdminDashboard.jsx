import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SuperAdminDashboard.module.css";
import { useState } from "react";
import socket from "../../../socketio/socket";
import { useEffect } from "react";
import axios from "axios";
import MessagePortal from "../../../UI/MessagePortal";
import HomeNavigator from "../../../Pages/HomeNavigator";
import { AuthContext } from "../../../context-api/AuthContext";
import { useContext } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { base_url } from "../../../config/config";
// IPv4 Address. . . . . . . . . . . : 192.168.0.104

const SuperAdminDashboard = () => {
  const {userLoginId} =useContext(AuthContext)
 const navigate = useNavigate()

  const fileRef = useRef(null);
  const [membersList, setMembersList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [checkDumpData, setCheckDumpData] = useState(true);
  const [selectRawFile, setSelectRawFile] = useState(null);
  const [importButtonRawDB, setImportButtonRawDB] = useState(false);
  const [portalMsg, setPortalMsg] = useState("");
  const [portalMsg2, setPortalMsg2] = useState("");
  const [portalType, setPortalType] = useState("");
  const [filteredBy, setFilteredBy] = useState({
    member: "",
    state: "",
    district: "",
    businessName: "",
    mobile: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgess] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isAssignTask, setIsAssignTask] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const getPincode = await axios.get(
          "http://localhost:3000/pincode/search-getplaces",
          {
            params: {
              state: filteredBy.state,
              district: filteredBy.district,
            },
          }
        );
        const regionData = getPincode.data;
        const uniqueState = regionData.statename;
        const uniquedistrict = regionData.districtname;
        setStateList(uniqueState);
        setDistrictList(uniquedistrict);
      } catch (err) {
        console.error("Error fetching pincodes:", err);
      }
    };
    fetch();
  }, [filteredBy.state, filteredBy.district]);

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("✅ Socket connected:", socket.id);

      socket.emit("joinRoom", superAdminId);
      // console.log("✅ joinRoom emitted with:", executiveId);
    });

    socket.on("taskAssigned", (data) => {
      console.log("🔥 Received taskAssigned:", data);
      setTaskList((prev) => ({ ...prev, ...data }));
      alert(data.message);
    });

    return () => {
      socket.off("taskAssigned");
      socket.off("connect");
    };
  }, []);

  //fetching members
  useEffect(() => {
    const fetchUser = async () => {
      const userDetails = await axios.get(
        "http://localhost:3000/users/getUser"
      );
      const users = userDetails.data.usersdf;
      const usersId = users
        .filter((ids) => ids.generateUniqueId !== "SA")
        .map((ids) => ids.generateUniqueId);
      console.log("userIds", usersId);
      setMembersList(usersId);
    };
    fetchUser();
  }, []);

  const goToClientPage = () => {
    const userId = "SA";
    navigate("/client-page", { state: { userId } });
  };
  const goToSearchPage = () => {
    navigate("/search-client");
  };

  const handleChange = (e, name) => {
    console.log("heelo", name, e.target.value);
    setFilteredBy((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const assignTaskTo = async () => {
    try {
      const result = await axios.post(
        "http://localhost:3000/task/task-assign",
        {
          assignBy: userLoginId,
          assignTo: filteredBy.member,
        },
        {
          params: {
            state: filteredBy.state || undefined,
            district: filteredBy.district || undefined,
            businessName: filteredBy.businessName.trim() || undefined,
            mobile: filteredBy.mobile || undefined,
          },
        }
      );
      console.log(
        `task is assigned to ${filteredBy.member} sucessfully`,
        result
      );
    } catch (err) {
      console.log("internal error", err.response?.data?.message);
      if (err.response?.data?.message === "No matching raw data found") {
        alert(err.response?.data?.message);
      }
    }
  };

  // const handleViewExcel = async()=>{
  //   try{
  //     const result = await axios.post("")
  //   }
  // }

  const handleImportFile = async () => {
    if (!selectRawFile) {
      setPortalMsg("Please select a file first");
      setPortalType("error");
      return;
    }

    const formData = new FormData();
    formData.append("uploadExcelSheet", selectRawFile);
    setIsUploading(true);
    setStatusMessage("Uploading file...");
    setUploadProgess(0);
    setImportButtonRawDB(true);
    try {
      // STEP 1: Upload the file
      const uploadRes = await axios.post(
        `${base_url}/raw-data/raw-data-dump`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const filename = uploadRes.data.filename;
      setStatusMessage("Processing data...");

      // ✅ STEP 2: Use full backend URL for EventSource
      const eventSource = new EventSource(
        `${base_url}/raw-data/stream-insert/${filename}?userId=${userLoginId}`
      );

      eventSource.addEventListener("progress", (event) => {
        const data = JSON.parse(event.data);
        setUploadProgess(data.progress); // optional
        setStatusMessage(`Processing: ${data.progress}%`);
        console.log(`Progress: ${data.progress}%`);
      });

      eventSource.addEventListener("complete", (event) => {
        const data = JSON.parse(event.data);
        console.log("Upload Complete!", data);
        setStatusMessage("Upload Complete!");
        setPortalMsg(`Imported  Successfully`);
        setPortalMsg2(`Total Records: ${data.total}`);
        setPortalType("success");
        alert("Upload Complete");
        eventSource.close();
      });

      eventSource.addEventListener("error", (event) => {
        try {
          const data = JSON.parse(event.data);
          const stateErrors = data.errorsState?.length
            ? `Invalid States at row(s): ${data.errorsState.join(", ")}`
            : "No state errors";

          const distErrors = data.errorsDist?.length
            ? `Invalid Districts at row(s): ${data.errorsDist.join(", ")}`
            : "No district errors";

          setPortalMsg(distErrors);
          setPortalMsg2(stateErrors);
          console.error("Error during insert:", data);
        } catch {
          console.error("Unknown error during insert.");
        }
        eventSource.close();
        setStatusMessage("Upload failed during processing.");
      });

      fileRef.current.value = "";
    } catch (err) {
      console.error("Upload error", err);
      setPortalMsg("Upload failed.");
      setPortalType("error");
    }
  };

  // console.log("import", importButtonRawDB);
  // console.log("portalmsg", portalMsg);
  const goToExcelView = () => {
    navigate("/view-excel");
  };
  const handleSampleFile = ()=>{
    try{
      const link = document.createElement("a");
      link.href= `${base_url}/raw-data/samplefile`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      console.log("file downloaded Successfully")
    }catch(err){
      console.log("internal error",err)
    }
  }
  return (
    <div className={styles.main}>
      <HomeNavigator />
      <div className={styles["main-content"]}>
        <header className={styles.header}>
          <h3>{userLoginId} Dashboard</h3>
        </header>
        <div className={styles["box-div"]}>
          <div className={styles.box}>
            <button>Schedule Optima</button>
            <button
              onClick={() => {
                setIsAssignTask((prev) => !prev);
              }}
              style={{ position: "relative" }}
            >
              Assign Task
            </button>
            <button>Master Data</button>
            <button>Report</button>
            <button>Reminder</button>
          </div>
          <div className={styles["show-content"]}>
            {isAssignTask && (
              <div className={styles["show-content-div"]}>
                {" "}
                Select Executive{" "}
                <select
                  name=""
                  id=""
                  value={filteredBy.member}
                  onChange={(e) => {
                    handleChange(e, "member");
                  }}
                >
                  <option value="">--select</option>
                  {membersList.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
                <br />
                Select State{" "}
                <select
                  name=""
                  id=""
                  value={filteredBy.state}
                  onChange={(e) => {
                    handleChange(e, "state");
                  }}
                >
                  <option value="">--select--</option>
                  {stateList.map((list) => (
                    <>
                      <option value={list}>{list}</option>
                    </>
                  ))}
                </select>
                Select District{" "}
                <select
                  name=""
                  id=""
                  value={filteredBy.district}
                  onChange={(e) => {
                    handleChange(e, "district");
                  }}
                >
                  <option value="">--select--</option>
                  {districtList.map((list) => (
                    <>
                      <option value={list}>{list}</option>
                    </>
                  ))}
                </select>
                Business name{" "}
                <input
                  type="text"
                  value={filteredBy.businessName}
                  onChange={(e) => {
                    handleChange(e, "businessName");
                  }}
                />
                <br />
                <button onClick={assignTaskTo}>Create Task</button>
              </div>
            )}
            {/* ===========================ADD BUTTON=============================== */}
            {checkDumpData && (
              <>
                <div>
                  <span className={styles.sample}>
                    <h2>Import Excel Sheet (.csv / .xlsx format only) </h2>
                    <p>Sample file for upload </p>
                    <MdOutlineFileDownload onClick={handleSampleFile} className={styles["download-icon"]} />
                  </span>
                  <div className={styles.dumpdata}>
                    <input
                      type="file"
                      accept=".xlsx,.csv"
                      ref={fileRef}
                      onChange={(e) => {
                        setSelectRawFile(e.target.files[0]);
                      }}
                    />

                    <button
                      disabled={importButtonRawDB}
                      onClick={(e) => {
                        handleImportFile(e);
                        setImportButtonRawDB(true);
                      }}
                    >
                      Import
                    </button>
                    {portalMsg && (
                      <MessagePortal
                        message1={portalMsg}
                        message2={portalMsg2}
                        onClose={() => {
                          setPortalMsg("");
                          setImportButtonRawDB(false);
                        }}
                        type={portalType}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {isUploading && (
                      <div className={styles["progress-bar"]}>
                        <div
                          className={styles.progress}
                          style={{ width: `${uploadProgress}%` }}
                        >
                          <p>{statusMessage}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={styles.box}>
            <button onClick={goToSearchPage}>Search</button>
            <button
              onClick={() => {
                setCheckDumpData((prev) => !prev);
              }}
            >
              Add
            </button>
            <button>Delete</button>
            <div className={styles.selects}>
              <select name="" id="">
                <option value="All Data">All Data</option>
                <option value="Follow-ubutton">Follow-up</option>
                <option value="Demo">Demo</option>
                <option value="Hot">Hot</option>
                <option value="buttonayment Due">payment Due</option>
                <option value="buttonroduct">product</option>
                <option value="Won Or Client">Won Or Client</option>
                <option value="Near To Close">Near To Close</option>
                <option value="Defaulter">Defaulter</option>
                <option value="Installation/Hosting">
                  Installation/Hosting
                </option>
              </select>
            </div>
            <button>Calender</button>
            <button>Upload</button>
            <button>Download</button>
            <button>print</button>
            <button>Save</button>
            <button>Update</button>
            <button onClick={goToExcelView}>View Excel</button>
          </div>
        </div>
        <div>Report</div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
