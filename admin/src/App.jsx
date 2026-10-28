import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import AddProduct from "./pages/add-product/AddProduct";
import ListProducts from "./pages/list-products/ListProducts";
import Orders from "./pages/orders/Orders";
import { useState } from "react";
import Login from "./pages/login/Login";
import { useEffect } from "react";

export const backendUrl = "https://forever-backend-phi-ten.vercel.app";

export const currency = "₦";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);
  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />

      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route
                  path="/admin/add-product"
                  element={<AddProduct token={token} />}
                />
                <Route
                  path="/admin/list-products"
                  element={<ListProducts token={token} />}
                />
                <Route
                  path="/admin/orders"
                  element={<Orders token={token} />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
