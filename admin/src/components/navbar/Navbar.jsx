import { assets } from "../../assets/admin_assets/assets";
import { toast } from "react-hot-toast";

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token"); // 🔥 important
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex items-center justify-between px-[4%] mt-5 mb-4">
      <img
        className="w-20 sm:w-24 md:w-28 object-contain"
        src={assets.logo}
        alt="logo"
      />
      <button
        onClick={handleLogout}
        className="bg-gray-800 text-white px-6 py-2 sm:px-8 sm:py-2 rounded-full cursor-pointer"
        type="button"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
