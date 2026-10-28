import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import Title from "../../components/title/Title";

const Orders = () => {
  const { currency, backendUrl, token, navigate } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserOrders = async (passedToken) => {
    try {
      setLoading(true);

      const activeToken = passedToken || token || localStorage.getItem("token");

      if (!activeToken) {
        toast.error("Please login to view your orders");
        navigate("/login");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/v1/order/user-orders`,
        {
          headers: {
            token: activeToken,
          },
        }
      );

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("fetchUserOrders error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [token]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (value) => {
    return `${currency}${Number(value || 0).toLocaleString()}`;
  };

  const getStatusMeta = (status) => {
    switch (status) {
      case "Pending Payment":
        return {
          text: "Pending Payment",
          dot: "bg-orange-500",
          badge: "bg-orange-100 text-orange-700",
        };
      case "Order Placed":
        return {
          text: "Order Placed",
          dot: "bg-blue-500",
          badge: "bg-blue-100 text-blue-700",
        };
      case "Payment Confirmed":
        return {
          text: "Payment Confirmed",
          dot: "bg-sky-500",
          badge: "bg-sky-100 text-sky-700",
        };
      case "Processing":
        return {
          text: "Processing",
          dot: "bg-indigo-500",
          badge: "bg-indigo-100 text-indigo-700",
        };
      case "Shipped":
        return {
          text: "Shipped",
          dot: "bg-yellow-500",
          badge: "bg-yellow-100 text-yellow-700",
        };
      case "Out for Delivery":
        return {
          text: "Out for Delivery",
          dot: "bg-purple-500",
          badge: "bg-purple-100 text-purple-700",
        };
      case "Delivered":
        return {
          text: "Delivered",
          dot: "bg-green-600",
          badge: "bg-green-100 text-green-700",
        };
      case "Cancelled":
        return {
          text: "Cancelled",
          dot: "bg-red-500",
          badge: "bg-red-100 text-red-700",
        };
      default:
        return {
          text: status || "Order Placed",
          dot: "bg-gray-400",
          badge: "bg-gray-100 text-gray-700",
        };
    }
  };

  const getPaymentText = (paymentMethod, payment) => {
    if (paymentMethod === "COD") {
      return payment ? "COD (Paid)" : "COD (Pay on delivery)";
    }

    if (paymentMethod === "PAYSTACK") {
      return payment ? "PAYSTACK (Paid)" : "PAYSTACK (Pending)";
    }

    return payment ? "Paid" : "Pending";
  };

  const ordersWithSummary = useMemo(() => {
    return (orders || []).map((order) => {
      const itemCount = (order.items || []).reduce(
        (acc, item) => acc + Number(item.quantity || 0),
        0
      );

      const firstImage =
        order.items?.[0]?.image ||
        "https://via.placeholder.com/120x120?text=Product";

      const firstItemName = order.items?.[0]?.name || "Order Item";

      return {
        ...order,
        itemCount,
        firstImage,
        firstItemName,
      };
    });
  }, [orders]);

  return (
    <div className="border-t pt-16 min-h-[70vh]">
      <div className="text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-500">Loading orders...</div>
      ) : ordersWithSummary.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium text-gray-800">No orders found yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Your placed orders will appear here.
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="mt-6 bg-black text-white px-6 py-3 text-sm rounded-sm cursor-pointer"
          >
            SHOP NOW
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {ordersWithSummary.map((order) => {
            const statusMeta = getStatusMeta(order.status);

            return (
              <div
                key={order._id}
                className="border rounded-xl p-4 sm:p-5 bg-white shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order No:
                      <span className="ml-2 font-medium text-gray-800">
                        {order.orderNumber || order._id}
                      </span>
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Placed on:
                      <span className="ml-2 font-medium text-gray-800">
                        {formatDate(order.createdAt || order.date)}
                      </span>
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Payment:
                      <span className="ml-2 font-medium text-gray-800">
                        {getPaymentText(order.paymentMethod, order.payment)}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium ${statusMeta.badge}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${statusMeta.dot}`}
                      ></span>
                      {statusMeta.text}
                    </div>

                    <button
                      onClick={() => navigate(`/orders/${order._id}/track`)}
                      className="border px-4 py-2.5 text-sm font-medium rounded-md cursor-pointer hover:bg-black hover:text-white transition"
                    >
                      Track Order
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={order.firstImage}
                      alt={order.firstItemName}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border"
                    />

                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-base sm:text-lg">
                        {order.firstItemName}
                        {order.items?.length > 1 && (
                          <span className="text-sm text-gray-500 font-normal ml-2">
                            +{order.items.length - 1} more item
                            {order.items.length - 1 > 1 ? "s" : ""}
                          </span>
                        )}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                        <p>
                          Items:
                          <span className="ml-1 font-medium text-gray-800">
                            {order.itemCount}
                          </span>
                        </p>
                        <p>
                          Delivery Fee:
                          <span className="ml-1 font-medium text-gray-800">
                            {formatAmount(order.deliveryFee)}
                          </span>
                        </p>
                        <p>
                          Total:
                          <span className="ml-1 font-medium text-gray-800">
                            {formatAmount(order.amount)}
                          </span>
                        </p>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        <p className="font-medium text-gray-800 mb-1">
                          Delivery Address
                        </p>
                        <p>
                          {order.address?.firstName} {order.address?.lastName}
                        </p>
                        <p>
                          {order.address?.street}, {order.address?.city},{" "}
                          {order.address?.state}
                        </p>
                        <p>
                          {order.address?.country} - {order.address?.zipcode}
                        </p>
                        <p>{order.address?.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {(order.items || []).map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="border rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-md border"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Size: {item.size || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-gray-800 mt-1">
                              {formatAmount(item.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.estimatedDeliveryDate && (
                    <div className="mt-4 text-sm text-gray-600">
                      Estimated Delivery:
                      <span className="ml-2 font-medium text-gray-800">
                        {formatDate(order.estimatedDeliveryDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;