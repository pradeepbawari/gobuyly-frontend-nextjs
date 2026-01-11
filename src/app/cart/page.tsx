'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faArrowLeft, faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateUser, createOrder } from '@/lib/api'
import HeaderPincodeChecker from '@/components/layout/HeaderPincodeChecker'

export default function CartPage() {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart()
  const { user, login } = useAuth()
  const router = useRouter()

  const [addressChange, setAddressChange] = useState(false)
  const [pincode, setPincode] = useState<string | number>(user?.pincode || 0)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    address: user?.address || '',
    pincode: user?.pincode || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  /* ---------------- ADDRESS UPDATE ---------------- */

  const addressHandler = () => {
    if (!user) {
      router.push('/login')
      return
    }
    setAddressChange(!addressChange)
  }

  const updateHandler = async () => {
    if (!pincode || pincode === '000000') return

    try {
      const payload = {
        address: form.address,
        pincode,
      }

      const userData = await updateUser(payload)
      const token = localStorage.getItem('token')

      if (userData?.user && token) {
        login(userData.user, token)
        setAddressChange(false)
        setError('')
      }
    } catch {
      setError('Failed to update address')
    }
  }

  const handlePincodeChange = (data: {
    pincode: string | null
    isValid: boolean | null
  }) => {
    if (data?.isValid === false) {
      setPincode('000000')
    } else {
      setPincode(data?.pincode)
    }
  }

  /* ---------------- CREATE ORDER ---------------- */

  const handleProceed = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!user.address || !user.pincode) {
      setError('Please select a delivery address.')
      return
    }

    try {
      const orderPayload = {
        userId: user.id,
        cartItems: cart.map(item => ({
          productId: item?.product.id,
          quantity: item?.quantity,
          price: item?.product.price,
          total: Number((total * 1.18).toFixed(2)),
          sku: item?.product?.sku,          
        })),
        paymentDetails: Number((total * 0.18).toFixed(2)),
        referral: 0,
        subtotal: total,
        tax: Number((total * 0.18).toFixed(2)),
        amount: Number((total * 1.18).toFixed(2)),
        address: user.address,
        pincode: user.pincode,
      }

      const response = await createOrder(orderPayload)

      router.push(`/orders`)
    } catch (err) {
      console.error(err)
      setError('Unable to place order. Please try again.')
    }
  }

  /* ---------------- EMPTY CART ---------------- */

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faShoppingBag} className="text-3xl text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            href="/"
            className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  /* ---------------- MAIN UI (UNCHANGED) ---------------- */

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-0 border-b-2 border-gray-200 pb-2">
        Shopping Cart
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Items in Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 flex items-center gap-2 text-sm font-medium"
              >
                <FontAwesomeIcon icon={faTrash} />
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {cart.map(item => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl"
                >
                  <div className="w-24 h-28 relative">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                    <p className="text-gray-600 text-xs mb-2">
                      SKU - {item.product.sku}
                    </p>
                    <p className="text-emerald-600 font-bold">
                      ₹{item.product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                      }
                      disabled={item.quantity === 1}
                      className="w-8 h-8 rounded-lg border"
                    >
                      -
                    </button>

                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          Math.min(item.quantity + 1, item.product.stock)
                        )
                      }
                      disabled={item.quantity >= item.product.stock}
                      className="w-8 h-8 rounded-lg border"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 p-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <p>
            Shipping Address: <span>{user?.address}</span>
          </p>
          <p>
            Pincode: <span>{user?.pincode}</span>
          </p>

          {addressChange && (
            <div className="bg-gray-200 p-3 mt-2">
              <input
                name="address"
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg w-full"
              />
              <HeaderPincodeChecker onChange={handlePincodeChange} />
              <button
                onClick={updateHandler}
                disabled={pincode === '000000'}
                className="bg-green-600 text-white px-4 py-1 rounded mt-2"
              >
                Update
              </button>
            </div>
          )}

          <button onClick={addressHandler} className="text-blue-500 mt-2">
            {addressChange ? 'Cancel' : 'Change'}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <div className="mt-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{(total * 0.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{(total * 1.18).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleProceed}
            className="w-full bg-emerald-500 text-white py-3 rounded-lg mt-6"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
