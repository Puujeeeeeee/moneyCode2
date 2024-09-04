import Navbar from "@/components/navbar/page";
// import UserProfile from "@/components/userProfile/page";
import DashboardHome from "@/components/dashboardHome/page";
export default function HomePage() {
  return (
    <div className="flex h-[100vh]">
      <Navbar />
      <DashboardHome />
      <UserProfile />
    </div>
  );
}
