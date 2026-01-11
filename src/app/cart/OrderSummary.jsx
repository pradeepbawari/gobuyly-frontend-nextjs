'use client'

import { useEffect, useState } from 'react'
import { load } from '@cashfreepayments/cashfree-js'
import { calculateShipping, checkPincode, orderPlace } from '@/lib/productApi'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'

export default function OrderSummary() {
  const router = useRouter()
  const { cart, total } = useCart()

  const [selectedAddress, setSelectedAddress] = useState(null)
  const [userAddresses, setUserAddresses] = useState([])
  const [shippingCost, setShippingCost] = useState(0)
  const [pincode, setPincode] = useState('')
  const [error, setError] = useState('')
  const [disabled, setDisabled] = useState(true)

  // 🔹 Example: fetch user addresses from API or auth context
  useEffect(() => {
    fetchAddresses().then(setUserAddresses)
  }, [])

  // 🔹 Shipping calculation
  useEffect(() => {
    if (!pincode) return

    const fetchShipping = async () => {
      const res = await calculateShipping({
        cartItems: cart,
        deliveryPincode: pincode,
        isCOD: false,
      })

      setShippingCost(res?.shippingCharge || 0)

      const pinCheck = await checkPincode(pincode)
      setDisabled(pinCheck.success !== 'Delivery pincode is serviceable')
    }

    fetchShipping()
  }, [pincode, cart])

  const placeOrder = async () => {
    if (!selectedAddress) {
      setError('Please select delivery address')
      return
    }

    const payload = {
      cartItems: cart,
      address: selectedAddress,
      amount: total + shippingCost,
    }

    const data = await orderPlace(payload)

    const cashfree = await load({
      mode: process.env.NEXT_PUBLIC_CASHFREE_ENV || 'sandbox',
    })

    cashfree.checkout({
      paymentSessionId: data.payment_session_id,
      redirectTarget: '_self',
    })
  }

  const createOrder = async () => {
  if (!userData?.user) {
    router.push("/auth");
    return;
  }

  if (!selectedAddress) {
    setAddressNotFound("Please select a delivery address.");
    return;
  }

  try {
    const selectedProducts = Object.values(cartItems);
    let referal = localStorage.getItem('referal') || '';
    const amount = getCartAmountTotal() + shippingCost;

    const orderPayload = {
      userId: userData?.user?.id,
      address: selectedAddress,
      cartItems: selectedProducts,
      amount,
      referral: referal,
      paymentDetails: {
        razorpay_payment_id: 21212,
        razorpay_order_id: 455454,
        razorpay_signature: 6562,
      },
      customerName: userData?.user?.name,
      customerEmail: userData?.user?.email,
      customerPhone: userData?.user?.mobile_number,
    };

    const res = await orderPlace(orderPayload);
    const data = await res;

    if (!data.order_id || !data.payment_session_id) {
      console.error("Create order failed:", data);
      alert("Unable to start payment. Try again.");
      return;
    }

    const paymentSessionId = data.payment_session_id;
    console.log("Payment session id:", paymentSessionId);
	console.log("Payment session id:", process.env.NEXT_PUBLIC_CASHFREE_ENV);
	
    // ✅ Proper Cashfree SDK usage
    const cashfree = await load({
      mode: process.env.NEXT_PUBLIC_CASHFREE_ENV || "sandbox", // "sandbox" or "production"
    });

    cashfree.checkout({
      paymentSessionId,
      redirectTarget: "_self",
    });

  } catch (err) {
    console.error("Payment initiation failed", err);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {/* Address */}
      <select
        className="w-full border p-2 mb-3"
        onChange={(e) => {
          const addr = userAddresses.find(a => a.id === e.target.value)
          setSelectedAddress(addr)
          setPincode(addr?.pincode)
        }}
      >
        <option>Select Address</option>
        {userAddresses.map(addr => (
          <option key={addr.id} value={addr.id}>
            {addr.fullName}, {addr.city}
          </option>
        ))}
      </select>

      {/* Summary */}
      <div className="space-y-2 text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{shippingCost}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total + shippingCost}</span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        disabled={disabled}
        onClick={createOrder}
        className={`w-full mt-4 py-3 rounded-lg text-white
          ${disabled ? 'bg-gray-300' : 'bg-emerald-500 hover:bg-emerald-600'}`}
      >
        Place Order
      </button>
    </div>
  )
}
