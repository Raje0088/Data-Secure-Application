import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Register from "../components/Register.jsx";
import Setting from "../components/Setting.jsx";
import UserPage from "../components/UserPage/UserPage.jsx";
import ExecutiveDashboard from "../components/Dashboard/Executive/ExecutiveDashboard.jsx";
import SuperAdminDashboard from "../components/Dashboard/SuperAdmin/SuperAdminDashboard.jsx";
import Report from "../components/Report/Report.jsx";
import SearchClient from "./SearchClient.jsx";
import ClientPage from "../components/ClientPage/ClientPage.jsx";
import styles from "./HomeNavigator.module.css";
import { FaHome } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaRegistered } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { FaSearchengin } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
import { FaUsers } from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import { RiLogoutCircleRLine } from "react-icons/ri";
const HomeNavigator = () => {
  const navigate = useNavigate()
  const handleLogout = ()=>{
    localStorage.removeItem("userLoginId")
    navigate("/login")
  }
  return (
    <div className={styles.main}>
      <div className={styles.home}>
        <Link to="/" element={<SuperAdminDashboard />}>
          <h2>
            <FaHome className={styles.icon} />
          </h2>
        </Link>
        <Link to="/user-dashboard" element={<ExecutiveDashboard />}>
          <h2>
            <FaUsers className={styles.icon} />
          </h2>
        </Link>
        <Link to="/register" element={<Register />}>
          <h2>
            <FaRegistered className={styles.icon} />
          </h2>
        </Link>
        <Link to="/setting" element={<Setting />}>
          <h2>
            <IoSettings className={styles.icon} />
          </h2>
        </Link>
        <Link to="/client-page" element={<ClientPage />}>
          <h2>
            <GrUserAdmin className={styles.icon} />
          </h2>
        </Link>
        <Link to="/userpage" element={<UserPage />}>
          <h2>
            <FaUserCircle className={styles.icon} />
          </h2>
        </Link>
        <Link to="/report" element={<Report />}>
          <h2>
            <TbReport className={styles.icon} />
          </h2>
        </Link>
        <Link to="/search-client" element={<SearchClient />}>
          <h2>
            <FaSearchengin className={styles.icon} />
          </h2>
        </Link>
          <h2>
            <RiLogoutCircleRLine className={styles.icon} style={{color:"red"}} onClick={handleLogout}/>
          </h2>
      </div>
    </div>
  );
};

export default HomeNavigator;
