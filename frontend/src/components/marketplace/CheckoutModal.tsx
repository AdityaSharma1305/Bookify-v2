import React, { useState } from 'react';
import { api } from '../../api';
import { ListingItem } from '../../types';
import { X, ShieldCheck, CreditCard, CheckCircle2, Lock, Truck } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

interface CheckoutModalProps {
  listing: ListingItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const total = (listing.listingPrice || 0) + (listing.shippingFee || 0);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setError('Please provide a delivery address');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // 1. Create order and get payment intent
      const res = await api.checkoutOrder({
        listingId: listing.id,
        shippingAddress: shippingAddress.trim(),
      });
      const orderId = res.data.data.orderId;

      // 2. Confirm order paid
      await api.confirmOrderPaid(orderId);

      setCompleted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {completed ? (
          <div className="py-10 text-center space-y-4">
            <CheckCircle2 className="text-green-500 mx-auto" size={54} />
            <h2 className="font-serif text-2xl font-bold text-primary">Payment Successful!</h2>
            <p className="text-xs text-gray-600 max-w-xs mx-auto">
              Your order is confirmed! The seller has been notified to pack and ship your book.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-accent-light text-accent rounded-full text-[11px] font-semibold">
                <Lock size={12} />
                <span>Secure Escrow Checkout</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-primary">Instant Purchase</h2>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
                {error}
              </div>
            )}

            {/* Book Item Summary */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 aspect-[2/3] bg-gray-200 rounded overflow-hidden shrink-0">
                  {listing.book?.coverImage && (
                    <img src={listing.book.coverImage} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-primary line-clamp-1">{listing.book?.title}</h4>
                  <p className="text-[11px] text-gray-500">Seller: {listing.seller?.name}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                    {listing.conditionGrade.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-primary">{formatPrice(listing.listingPrice)}</p>
                {listing.discountPercentage ? (
                  <p className="text-[10px] text-accent font-semibold">{listing.discountPercentage}% OFF</p>
                ) : null}
              </div>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              {/* Shipping Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Truck size={13} className="text-accent" /> Shipping Address
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Street address, City, State, ZIP Code, Country"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Payment Details */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <CreditCard size={13} className="text-accent" /> Card Payment (Stripe / Test Card: 4242...)
                </label>
                <input
                  type="text"
                  placeholder="Card Number (4242 4242 4242 4242)"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    required
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="CVC (123)"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-2 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Item price</span>
                  <span>{formatPrice(listing.listingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping fee</span>
                  <span>{listing.shippingFee > 0 ? formatPrice(listing.shippingFee) : 'Free'}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-primary pt-1 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-[11px] text-gray-400">
                <ShieldCheck size={15} className="text-green-600 shrink-0" />
                <span>Buyer Protection: Money is held securely until you receive the book.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent text-white font-bold text-sm rounded-xl hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? 'Processing Payment...' : `Pay ${formatPrice(total)} & Order`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
