import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import Banner from "../common/Banner";
import { Outlet } from "react-router-dom";
import Stats from "../common/statistical";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Banner />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <Stats />
      <Footer />

    </div>
  );
};

export default MainLayout;