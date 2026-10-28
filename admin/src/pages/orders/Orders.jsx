import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { backendUrl, currency } from "../../App";

const Orders = ({ token }) => {
  const boxIcon =
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  const ORDER_STATUS_OPTIONS = [
    "Order Placed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const fetchAllOrders = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/v1/order/all-orders`,
        {
          headers: {
            aToken: token,
          },
        }
      );

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("fetchAllOrders error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllOrders();
    }
  }, [token]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);

      const previousOrders = [...orders];

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );

      const statusMessageMap = {
        "Order Placed": "Your order has been placed successfully.",
        Shipped: "Your package has left our warehouse.",
        "Out for Delivery": "Rider is on the way to deliver your order.",
        Delivered: "Your order has been delivered successfully.",
        Cancelled: "Your order has been cancelled.",
      };

      const { data } = await axios.post(
        `${backendUrl}/api/v1/order/update-status`,
        {
          orderId,
          status,
          message: statusMessageMap[status] || "Order status updated.",
          location:
            status === "Shipped"
              ? "Warehouse"
              : status === "Out for Delivery"
                ? "Delivery Route"
                : "",
        },
        {
          headers: {
            aToken: token,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Order status updated");
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? data.order || { ...order, status } : order
          )
        );
      } else {
        setOrders(previousOrders);
        toast.error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("updateOrderStatus error:", error);
      toast.error(error.response?.data?.message || error.message);
      fetchAllOrders();
    } finally {
      setUpdatingOrderId("");
    }
  };

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

  const formatAmount = (amount) => {
    return `${currency}${Number(amount || 0).toLocaleString()}`;
  };

  const getPaymentText = (order) => {
    if (order.paymentMethod === "PAYSTACK") {
      return order.payment ? "Paid" : "Pending";
    }

    if (order.paymentMethod === "COD") {
      return order.payment ? "Paid" : "Pay on delivery";
    }

    return order.payment ? "Paid" : "Pending";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-yellow-100 text-yellow-700";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  if (loading) {
    return (
      <div className="md:p-10 p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-lg font-medium mb-6">Orders List</h2>

        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-black/10 animate-ping"></div>
          </div>

          <p className="text-gray-500 text-sm animate-pulse">
            Fetching orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-10 p-4 space-y-4 w-full">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-medium">Orders List</h2>

        <button
          onClick={fetchAllOrders}
          className="border border-gray-300 px-4 py-2 cursor-pointer rounded-md text-sm hover:bg-black hover:text-white transition"
        >
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-md p-6 text-gray-500">
          No orders found.
        </div>
      ) : (
        orders.map((order, index) => (
          <div
            key={order._id || index}
            className="flex flex-col md:grid md:grid-cols-[2.2fr_1.4fr_1fr_1.2fr_1fr] md:items-center gap-5 p-5 w-full rounded-md border border-gray-300 text-gray-800 bg-white"
          >
            <div className="flex gap-4">
              <img
                className="w-12 h-12 object-cover opacity-70 mt-1"
                src={boxIcon}
                alt="boxIcon"
              />

              <div className="space-y-2">
                {(order.items || []).map((item, itemIndex) => (
                  <div key={itemIndex} className="flex flex-col justify-center">
                    <p className="font-medium">
                      {item.name || item?.product?.name || "Product"}
                      <span
                        className={`text-indigo-500 ml-1 ${
                          Number(item.quantity) < 2 ? "hidden" : ""
                        }`}
                      >
                        x {item.quantity}
                      </span>
                    </p>
                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-3">
                      <span>Size: {item.size || "N/A"}</span>
                      <span>Price: {formatAmount(item.price)}</span>
                    </div>
                  </div>
                ))}

                <div className="text-xs text-gray-500 pt-1">
                  <p>
                    Order ID:{" "}
                    <span className="font-medium text-gray-700">
                      {order.orderNumber || order._id}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm">
              <p className="font-medium mb-1">
                {order.address?.firstName} {order.address?.lastName}
              </p>
              <p>
                {order.address?.street}, {order.address?.city},{" "}
                {order.address?.state}, {order.address?.zipcode},{" "}
                {order.address?.country}
              </p>
              <p className="mt-1 text-gray-500">{order.address?.phone}</p>
              <p className="text-gray-500">{order.address?.email}</p>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-base text-black/70">
                {formatAmount(order.amount)}
              </p>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status || "Order Placed"}
              </span>
            </div>

            <div className="flex flex-col text-sm">
              <p>
                Method:{" "}
                <span className="font-medium">
                  {order.paymentMethod || order.paymentType || "N/A"}
                </span>
              </p>
              <p>
                Date:{" "}
                <span className="font-medium">
                  {formatDate(order.createdAt || order.orderDate || order.date)}
                </span>
              </p>
              <p>
                Payment:{" "}
                <span className="font-medium">{getPaymentText(order)}</span>
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">Update Status</label>
              <select
                value={order.status || "Order Placed"}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                disabled={updatingOrderId === order._id}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-black bg-white cursor-pointer"
              >
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              {updatingOrderId === order._id && (
                <p className="text-xs text-blue-500">Updating...</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
