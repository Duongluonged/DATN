import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import Home from "../../pages/home/Home";
import Login from "../../pages/Auth/Login";
import Home_candidate from "../../pages/candidate/home_page_candidate";
import JobDetail from "../../pages/candidate/JobDetail";
import CreateCV from "../../pages/candidate/CreateCV";
import Tongquan from "../../pages/candidate/Tong_quan";
import HSo_Dinh_Kem from "../../pages/candidate/HSo_Dinh_Kem";
import Hoso from "../../pages/candidate/Hoso";
import ViecLamCuaToi from "../../pages/candidate/Vieclamcuatoi";
import Loimoicongviec from "../../pages/candidate/Loimoicv";
import Thongbao from "../../pages/candidate/Thongbao";
import Caidat from "../../pages/candidate/Caidat";
import ApplyJob from "../../pages/candidate/CreateCV";


// Đảm bảo bạn không import React từ một nguồn khác ở đây
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/job-detail/:id" element={<JobDetail />} />
          <Route path="/home_candidate" element={<Home_candidate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-cv" element={<CreateCV />} />
          <Route path="/Tong_quan" element={<Tongquan />} />
          <Route path="/HSo_Dinh_Kem" element={<HSo_Dinh_Kem />} />
          <Route path="/candidate/Hoso" element={<Hoso />} />
          <Route path="/candidate/Vieclamcuatoi" element={<ViecLamCuaToi />} />
          <Route path="/candidate/Loimoicv" element={<Loimoicongviec />} />
          <Route path="/candidate/Thongbao" element={<Thongbao />} />
          <Route path="/candidate/Caidat" element={<Caidat />} />
          <Route path="/candidate/CreateCV" element={<ApplyJob />} />
          

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;