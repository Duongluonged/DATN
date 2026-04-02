import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import Home from "../../pages/home/Home";
import Login from "../../pages/Auth/Login";

// Đảm bảo bạn không import React từ một nguồn khác ở đây
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;