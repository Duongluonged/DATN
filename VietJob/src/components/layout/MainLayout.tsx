import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import Banner from "../common/Banner";
import { Outlet } from "react-router-dom";
import Stats from "../common/statistical";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar luôn ở trên cùng */}
      <Navbar />

      <Banner />
      {/* Outlet là nơi nội dung của các trang (Home, Jobs...) sẽ hiển thị */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
    
      {/* Footer luôn ở dưới cùng */}
      <Stats />
      <Footer />

    </div>
  );
};

export default MainLayout;