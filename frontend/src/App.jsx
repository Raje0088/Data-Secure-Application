import { useState } from "react";
import "./mobile.css";
import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Register from "./components/Register.jsx";
import Setting from "./components/Setting.jsx";
import ClientPage from "./components/ClientPage/ClientPage.jsx";
import Addplus from "./components/ClientPage/AddField.jsx";
import UserPage from "./components/UserPage/UserPage.jsx";
import ExecutiveDashboard from "./components/Dashboard/Executive/ExecutiveDashboard.jsx";
import SuperAdminDashboard from "./components/Dashboard/SuperAdmin/SuperAdminDashboard.jsx";
import AdminDashboard from "./components/Dashboard/Admin/AdminDashboard.jsx";
import Login from "./Pages/Login.jsx";
import Report from "./components/Report/Report.jsx";
import SearchClient from "./Pages/SearchClient.jsx";
import HomeNavigator from "./Pages/HomeNavigator.jsx";
import ViewExcel from "./Pages/ViewExcel.jsx";
import Backup from "./Pages/Backup.jsx";
// import Layout from "./Pages/Layout.jsx";
import AuthProvider from "./context-api/AuthContext.jsx";
import Protected from "./Pages/Protected.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <HomeNavigator />
        <Routes>
          <Route path="/client-page" element={<ClientPage />} />
          <Route path="/user-dashboard" element={<ExecutiveDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route
            path="/"
            element={
              <Protected>
                <SuperAdminDashboard />
              </Protected>
            }
          />
          {/* <Route path="/" element={<SuperAdminDashboard />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/add" element={<Addplus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<Report />} />
          <Route path="/search-client" element={<SearchClient />} />
          <Route path="/view-excel" element={<ViewExcel />} />
          <Route path="/backup" element={<Backup />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
