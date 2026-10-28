import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Collection from "./pages/collection/Collection";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Product from "./pages/product/Product";
import Cart from "./pages/cart/Cart";
import Login from "./pages/login/Login";
import PlaceOrder from "./pages/place-order/PlaceOrder";
import Signup from "./pages/signup/Signup";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Orders from "./pages/orders/Orders";
import MyProfile from "./pages/my-profile/MyProfile";
import DeliveryInformation from "./pages/delivery-information/DeliveryInformation";
import FAQs from "./pages/faqs/FAQs.jsx";
import ReturnRefund from "./pages/return-and-refund/ReturnRefund";
import VerifyPayment from "./pages/verify-payment/VerifyPayment";
import TrackOrder from "./pages/track-order/TrackOrder";
import Search from "./components/search/Search";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Toaster position="top-center" reverseOrder={false} />

      <Navbar />
      <Search />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/delivery-information" element={<DeliveryInformation />} />
        <Route path="/returns" element={<ReturnRefund />} />
        <Route path="/verify-payment" element={<VerifyPayment />} />
        <Route path="/orders/:orderId/track" element={<TrackOrder />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;