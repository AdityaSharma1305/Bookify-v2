import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { OrderItem } from '../types';
import { Package, Truck, CheckCircle2, IndianRupee, Clock, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export const OrdersPage: React.FC = () => {
  const [tab, setTab] = useState<'PURCHASES' | 'SALES'>('PURCHASES');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingNumberInput, setTrackingNumberInput] = useState<{ [orderId: number]: string }>({});

  useEffect(() => {
    loadOrders();
  }, [tab]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = tab === 'PURCHASES' ? await api.getPurchases() : await api.getSales();
      setOrders(res.data.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShip = async (orderId: number) => {
    const tracking = trackingNumberInput[orderId] || 'USPS-STANDARD';
    try {
      await api.markOrderShipped(orderId, tracking);
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelivered = async (orderId: number) => {
    try {
      await api.markOrderDelivered(orderId);
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-[#FAF6F0] via-white to-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#EDE5D8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#C59B27] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Escrow Secured Transactions
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mt-2">Orders &amp; Marketplace Activity</h1>
          <p className="text-xs text-gray-500 mt-1">Track purchased shipments and manage fulfillment for books you sold</p>
        </div>
      </div>

      <div className="flex space-x-2 pb-2">
        <button
          onClick={() => setTab('PURCHASES')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            tab === 'PURCHASES'
              ? 'bg-[#C59B27] text-white shadow-md'
              : 'bg-white text-gray-600 border border-[#EDE5D8] hover:bg-[#FAF6F0]'
          }`}
        >
          📦 My Purchases (Books Bought)
        </button>
        <button
          onClick={() => setTab('SALES')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            tab === 'SALES'
              ? 'bg-[#C59B27] text-white shadow-md'
              : 'bg-white text-gray-600 border border-[#EDE5D8] hover:bg-[#FAF6F0]'
          }`}
        >
          🛍️ My Sales (Fulfill Orders)
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-[#C59B27] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="p-6 bg-white border border-[#EDE5D8] hover:border-[#C59B27]/40 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 aspect-[2/3] bg-[#FAF6F0] rounded-2xl overflow-hidden shadow-md border border-[#EDE5D8] shrink-0">
                  {o.listing?.book?.coverImage && (
                    <img src={o.listing.book.coverImage} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#C59B27] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{o.orderNumber}</span>
                  <h4 className="font-serif font-bold text-sm text-primary">{o.listing?.book?.title}</h4>
                  <p className="text-xs text-gray-500">
                    {tab === 'PURCHASES' ? `Sold by ${o.seller?.name}` : `Purchased by ${o.buyer?.name}`}
                  </p>
                  <p className="text-[11px] text-gray-400">Deliver to: {o.shippingAddress}</p>
                </div>
              </div>

              <div className="sm:text-right space-y-2 w-full sm:w-auto">
                <p className="font-serif font-bold text-lg text-primary">{formatPrice(o.totalAmount)}</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${
                  o.orderStatus === 'DELIVERED'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : o.orderStatus === 'SHIPPED'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {o.orderStatus}
                </span>

                {/* Seller Actions */}
                {tab === 'SALES' && o.orderStatus === 'PAID' && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Tracking #"
                      onChange={(e) => setTrackingNumberInput({ ...trackingNumberInput, [o.id]: e.target.value })}
                      className="px-3 py-1.5 text-xs border border-[#EDE5D8] rounded-xl w-32 focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                    />
                    <button
                      onClick={() => handleShip(o.id)}
                      className="px-3.5 py-1.5 bg-[#C59B27] hover:bg-[#A6811E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      Mark Shipped
                    </button>
                  </div>
                )}

                {/* Buyer Actions */}
                {tab === 'PURCHASES' && o.orderStatus === 'SHIPPED' && (
                  <button
                    onClick={() => handleConfirmDelivered(o.id)}
                    className="block w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    Confirm Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE5D8] p-8 space-y-2">
          <Package className="mx-auto text-gray-300" size={36} />
          <p className="font-serif font-bold text-sm text-primary">No orders found</p>
          <p className="text-xs text-gray-400">Your marketplace orders and sales will appear here.</p>
        </div>
      )}
    </div>
  );
};
