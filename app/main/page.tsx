import HomePageContainer from "@/components/homeMenu/LoanContent";
import DashboardHome from "@/components/dashboardHome/page";
import Navbar from "@/components/navbar/page";
import { UserProfile } from "@/components/userProfile/page";
// import UserProfile from "@/components/userProfile/page";
const MainContainer = () => {
  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-full">
        <Navbar />
      </div>
      <div className="flex-1 overflow-y-auto ml-[80px]">
        <DashboardHome />
      </div>
      <div className="">
        <UserProfile />
      </div>
    </div>
  );
};

export default MainContainer;
