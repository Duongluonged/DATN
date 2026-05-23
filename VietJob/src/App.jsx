import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './pages/Auth/ProtectedRoute';
import MainLayout from "./components/layout/MainLayout";
import Home from './pages/home/Home';
import Login from './pages/Auth/Login';
import LoginEmployer from './pages/Auth/Login_Employer.jsx';
import Register from './pages/Auth/Register';
import JobDetail from './pages/candidate/JobDetail';
import './index.css';
import Tongquan from './pages/candidate/Tong_quan';
import HSo_Dinh_Kem from './pages/candidate/HSo_Dinh_Kem';
import HoSoDinhKem from './pages/candidate/HSo_Dinh_Kem';
import Hoso from './pages/candidate/Hoso';
import ViecLamCuaToi from './pages/candidate/Vieclamcuatoi';
import Loimoicongviec from './pages/candidate/Loimoicv';
import Thongbao from './pages/candidate/Thongbao';
import Caidat from './pages/candidate/Caidat';
import ApplyJob from './pages/candidate/ApplyJob';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Home_candidate from './pages/candidate/home_page_candidate.jsx';
import User_Manager from './pages/admin/User_Manager.jsx';
import JobPosting_Manager from './pages/admin/JobPosting_Manager.jsx';
import CourseManager from './pages/admin/Course_manager.jsx';
import Report_Management from './pages/admin/Report_Management.jsx';
import Statistical from './pages/admin/Statistical.jsx';
import Detail_company from './pages/candidate/Detail_company.jsx';
import SearchPage from './pages/candidate/SearchPage.jsx';
import EmployerRegisterForm from './pages/Auth/EmployerRegisterForm.jsx';
import Quan_ly_tin_tuyen_dung from './pages/employer/Quan_ly_tin_tuyen_dung.jsx';
import Quan_ly_ung_vien from './pages/employer/Quan_ly_ung_vien.jsx';
import Quan_Ly_Khoa_Hoc from './pages/employer/Quan_ly_khoa_hoc.jsx';
import Vi_tien from './pages/employer/Vi_tien.jsx';
import Quan_ly_tin_nhan from './pages/employer/Quan_ly_tin_nhan.jsx';
import Thongke_ntd from './pages/employer/Thong_ke_ntd.jsx';
import Quan_ly_Hoso_Cty from './pages/employer/Quan_ly_Hoso_Cty.jsx';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Employer', 'Admin']} />}>
          <Route path="/employer/dashboard" element={<div>Employer Dashboard (Coming Soon)</div>} />
          <Route path="/employer/Quan_ly_tin_tuyen_dung" element={<Quan_ly_tin_tuyen_dung />} />
          <Route path="/employer/Quan_ly_ung_vien" element={<Quan_ly_ung_vien />} />
          <Route path="/employer/Quan_ly_khoa_hoc" element={<Quan_Ly_Khoa_Hoc />} />
          <Route path="/employer/Quan_ly_tin_nhan" element={<Quan_ly_tin_nhan />} />
          <Route path="/employer/Vi_tien" element={<Vi_tien />} />
          <Route path="/employer/Thong_ke_ntd" element={<Thongke_ntd />} />
          <Route path="/employer/Quan_ly_Hoso_Cty" element={<Quan_ly_Hoso_Cty />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/login_employer" element={<LoginEmployer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/job-detail/:id" element={<JobDetail />} />
        <Route path="/Detail_company/:id" element={<Detail_company />} />
        <Route path="/candidate/Tong_quan" element={<Tongquan />} />
        <Route path="/candidate/HSo_Dinh_Kem" element={<HoSoDinhKem />} />
        <Route path="/candidate/Hoso" element={<Hoso />} />
        <Route path="/candidate/Vieclamcuatoi" element={<ViecLamCuaToi />} />
        <Route path="/candidate/Loimoicv" element={<Loimoicongviec />} />
        <Route path="/candidate/Thongbao" element={<Thongbao />} />
        <Route path="/candidate/Caidat" element={<Caidat />} />
        <Route path="/candidate/ApplyJob" element={<ApplyJob />} />
        <Route path="/candidate/home_page_candidate" element={<Home_candidate />} />
        <Route path="/admin/User_Manager" element={<User_Manager />} />
        <Route path="/admin/JobPosting_Manager" element={<JobPosting_Manager />} />
        <Route path="/admin/Course_Manager" element={<CourseManager />} />
        <Route path="/admin/Report_Management" element={<Report_Management />} />
        <Route path="/admin/Statistical" element={<Statistical />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/EmployerRegisterForm" element={<EmployerRegisterForm />} />


      </Routes>
    </BrowserRouter>
  );
};

export default App;