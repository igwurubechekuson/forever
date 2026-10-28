import { useEffect, useRef, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../../assets/frontend_assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileMenuRef = useRef(null);

  const {
    getCartCount,
    setShowSearch,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(AppContext);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "COLLECTION", path: "/collection" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowProfileMenu(false);
    setVisible(false);
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <div className="flex items-center justify-between py-5 font-medium relative">
        <NavLink to="/">
          <img src={assets.logo} className="w-36" alt="logo" />
        </NavLink>

        <ul className="hidden sm:flex items-center gap-8 text-sm">
          {navLinks.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className="group flex flex-col items-center"
              >
                {({ isActive }) => (
                  <>
                    <p
                      className={`transition-colors duration-200 ${
                        isActive
                          ? "text-black"
                          : "text-gray-600 group-hover:text-black"
                      }`}
                    >
                      {item.name}
                    </p>
                    <hr
                      className={`border-none h-[1.5px] bg-gray-800 mt-1 transition-all duration-300 ${
                        isActive ? "w-1/2" : "w-0 group-hover:w-1/2"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          <img
            className="w-5 cursor-pointer"
            src={assets.search_icon}
            onClick={() => setShowSearch(true)}
            alt="search"
          />

          <Link to="/cart" className="relative">
            <img
              className="w-5 min-w-5 cursor-pointer"
              src={assets.cart_icon}
              alt="cart"
            />
            {getCartCount() > 0 && (
              <p className="absolute -right-2 -bottom-2 w-4 h-4 flex items-center justify-center bg-black text-white rounded-full text-[8px]">
                {getCartCount()}
              </p>
            )}
          </Link>

          <div className="relative" ref={profileMenuRef}>
            <img
              className="w-5 cursor-pointer"
              src={assets.profile_icon}
              alt="profile"
              onClick={() => {
                if (token) {
                  setShowProfileMenu((prev) => !prev);
                } else {
                  navigate("/login");
                }
              }}
            />

            {token && showProfileMenu && (
              <div className="absolute right-0 top-8 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <NavLink
                  to="/my-profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  My Profile
                </NavLink>

                <NavLink
                  to="/orders"
                  onClick={() => setShowProfileMenu(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Orders
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setVisible(true)}
          className="sm:hidden"
          aria-label="Open menu"
        >
          <img
            src={assets.menu_icon}
            className="w-5 cursor-pointer"
            alt="menu"
          />
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 bottom-0 z-50 bg-white shadow-xl transition-all duration-300 sm:hidden ${
          visible ? "w-[75%] max-w-[320px]" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b">
          <NavLink to="/" onClick={() => setVisible(false)}>
            <img src={assets.logo} className="w-28" alt="logo" />
          </NavLink>

          <button
            onClick={() => setVisible(false)}
            className="text-3xl leading-none"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `px-6 py-4 border-b text-sm transition ${
                  isActive
                    ? "bg-gray-100 text-black font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {token ? (
            <>
              <NavLink
                to="/my-profile"
                onClick={() => setVisible(false)}
                className="px-6 py-4 border-b text-sm text-gray-700 hover:bg-gray-50"
              >
                My Profile
              </NavLink>

              <NavLink
                to="/orders"
                onClick={() => setVisible(false)}
                className="px-6 py-4 border-b text-sm text-gray-700 hover:bg-gray-50"
              >
                Orders
              </NavLink>

              <button
                onClick={handleLogout}
                className="px-6 py-4 border-b text-sm text-left text-red-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setVisible(false)}
              className="px-6 py-4 border-b text-sm text-gray-700 hover:bg-gray-50"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>

      {visible && (
        <div
          className="fixed inset-0 bg-black/30 z-40 sm:hidden"
          onClick={() => setVisible(false)}
        />
      )}
    </>
  );
};

export default Navbar;