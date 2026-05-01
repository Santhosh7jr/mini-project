import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/bookings");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#28364D] min-h-screen px-6 py-16">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-2xl text-[#EEF1F6] font-semibold mb-6">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-[#B2C0D7]">No bookings found.</p>
        ) : (
          <div className="space-y-4">

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#384B6B] p-5 rounded-xl border border-[#5875A7]"
              >
                <p className="text-[#EEF1F6] font-semibold">
                  {order.service_name}
                </p>

                <p className="text-sm text-[#B2C0D7]">
                  Worker: {order.worker_name}
                </p>

                <p className="text-sm text-[#B2C0D7]">
                  Date: {order.date}
                </p>

                <p className="text-sm text-[#B2C0D7]">
                  Status: {order.status}
                </p>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}