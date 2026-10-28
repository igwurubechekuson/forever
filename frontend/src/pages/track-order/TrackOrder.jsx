import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Title from "../../components/title/Title";

const TrackOrder = () => {
  const { orderId } = useParams();
  const { backendUrl, token, navigate } = useContext(AppContext);

  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTracking = async () => {
    try {
      setLoading(true);

      const activeToken = token || localStorage.getItem("token");

      if (!activeToken) {
        toast.error("Please login to track your order");
        navigate("/login");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/v1/order/track/${orderId}`,
        {
          headers: {
            token: activeToken,
          },
        }
      );

      if (data.success) {
        setTracking(data.tracking);
      } else {
        toast.error(data.message || "Unable to track order");
      }
    } catch (error) {
      console.error("fetchTracking error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchTracking();
  }, [orderId, token]);

  const formatDateTime = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStepStyle = (step) => {
    if (step.completed) {
      return {
        circle: "bg-green-600 border-green-600 text-white",
        text: "text-green-700",
        line: "bg-green-600",
      };
    }

    if (step.active) {
      return {
        circle: "bg-black border-black text-white",
        text: "text-black",
        line: "bg-gray-300",
      };
    }

    return {
      circle: "bg-white border-gray-300 text-gray-500",
      text: "text-gray-400",
      line: "bg-gray-300",
    };
  };

  return (
    <div className="border-t pt-16 min-h-[70vh]">
      <div className="text-2xl">
        <Title text1="TRACK" text2="ORDER" />
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-500">
          Loading tracking details...
        </div>
      ) : !tracking ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium text-gray-800">
            Tracking details not found
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="mt-6 bg-black text-white px-6 py-3 text-sm rounded-sm cursor-pointer"
          >
            BACK TO ORDERS
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Order No:
                  <span className="ml-2 font-medium text-gray-800">
                    {tracking.orderNumber}
                  </span>
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Current Status:
                  <span className="ml-2 font-medium text-gray-800">
                    {tracking.currentStatus}
                  </span>
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Payment Method:
                  <span className="ml-2 font-medium text-gray-800">
                    {tracking.paymentMethod}
                  </span>
                </p>
              </div>

              <div className="text-sm text-gray-500">
                Estimated Delivery:
                <span className="ml-2 font-medium text-gray-800">
                  {formatDate(tracking.estimatedDeliveryDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Order Progress
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(tracking.steps || []).map((step, index) => {
                const style = getStepStyle(step);

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className="flex items-center w-full justify-center">
                      {index !== 0 && (
                        <div className={`hidden md:block h-1 flex-1 ${style.line}`}></div>
                      )}

                      <div
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${style.circle}`}
                      >
                        {index + 1}
                      </div>

                      {index !== (tracking.steps || []).length - 1 && (
                        <div className="hidden md:block h-1 flex-1 bg-gray-300"></div>
                      )}
                    </div>

                    <p className={`mt-3 text-sm font-medium text-center ${style.text}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Tracking History
            </h3>

            {(tracking.history || []).length === 0 ? (
              <p className="text-sm text-gray-500">No tracking history yet.</p>
            ) : (
              <div className="space-y-5">
                {[...(tracking.history || [])]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="w-3 h-3 rounded-full bg-black mt-1"></span>
                        {index !== (tracking.history || []).length - 1 && (
                          <span className="w-px h-full bg-gray-300 mt-2"></span>
                        )}
                      </div>

                      <div className="pb-3">
                        <p className="font-medium text-gray-800">{event.status}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.message}
                        </p>

                        {event.location ? (
                          <p className="text-xs text-gray-500 mt-1">
                            Location: {event.location}
                          </p>
                        ) : null}

                        <p className="text-xs text-gray-400 mt-1">
                          {formatDateTime(event.date)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => navigate("/orders")}
              className="border px-6 py-3 text-sm font-medium rounded-sm cursor-pointer hover:bg-black hover:text-white transition"
            >
              BACK TO ORDERS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;