import { assets } from "../../assets/admin_assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="min-h-screen bg-white border-r">
      <ul className="text-[#515151]">
        <NavLink
          to="/admin/add-product"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#ffebf5] border-r-4 border-[#c586a5]" : ""
            }`
          }
        >
          <img src={assets.add_icon} alt="Add product icon" />
          <p className="hidden md:block">Add Product</p>
        </NavLink>

        <NavLink
          to="/admin/list-products"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#ffebf5] border-r-4 border-[#c586a5]" : ""
            }`
          }
        >
          <img src={assets.order_icon} alt="add doctor icon" />
          <p className="hidden md:block">List Products</p>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
              isActive ? "bg-[#ffebf5]  border-r-4 border-[#c586a5]" : ""
            }`
          }
        >
          <img src={assets.order_icon} alt="doctors list icon" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
      </ul>
    </div>
  );
};

export default Sidebar;
