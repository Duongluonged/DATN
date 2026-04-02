import JobCard from "../../components/common/JobCard";

const Home = () => {
  return (
    <div>
      <h1>Chào mừng đến với VietJob</h1>
      {/* Chỉ hiển thị JobCard ở đây, Navbar/Footer đã có MainLayout lo */}
      <JobCard />
    </div>
  );
};

export default Home;