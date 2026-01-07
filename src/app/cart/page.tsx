'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faArrowLeft, faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext.'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateUser } from '@/lib/api'
import HeaderPincodeChecker from '@/components/layout/HeaderPincodeChecker'

export default function CartPage() {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart()
  const { user } = useAuth();
  const { login } = useAuth();
  const router = useRouter();
  const [addressChange, setAddressChange] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pincode, setPincode] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile_number: '',
    address: '',
    gstin: '',
    pincode: pincode,
  });
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faShoppingBag} className="text-3xl text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
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

  const addressHandler = () => {
    user ? setAddressChange(!addressChange) : router.push('/login')
  }

  const updateHandler = async (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value, pincode: pincode });
    const userData = await updateUser({
      form
    })
    let token: any = localStorage.getItem('token');
    login(userData?.user, token)
    setAddressChange(false)
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

  const handleProceed = () => {
    {user ? router.push('order')  : router.push('login')}
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-0 border-b-2 border-gray-200 pb-2">Shopping Cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Items in Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
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
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                  {/* Product Image */}
                  <div className="w-24 h-28 relative">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                        unoptimized={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                    <p className="text-gray-600 text-xs mb-2">SKU - {item.product.sku}</p>
                    <p className="text-emerald-600 font-bold">₹{item.product.price.toLocaleString()}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">

                      {/* DECREASE */}
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        disabled={item.quantity === 1}
                        className="w-8 h-8 rounded-lg border border-gray-300 bg-white
                 flex items-center justify-center
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-gray-50"
                      >
                        -
                      </button>

                      {/* QUANTITY */}
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>

                      {/* INCREASE */}
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            Math.min(item.quantity + 1, item.product.stock)
                          )
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="w-8 h-8 rounded-lg border border-gray-300 bg-white
                 flex items-center justify-center
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>

            <div className="space-y-0  mb-6 space-x-2 w-full">
              <div>
                Shipping Address : <span className='lowercase mr-3'>{user?.address}</span>
                PinCode : <span className='lowercase'>{user?.pincode}</span>
              </div>
              {addressChange && (<div className='bg-gray-200 p-3'>
                <div className='flex flex-col gap-2 mt-3'>
                  Shipping Address :
                  <input type='text'
                    name='address'
                    required
                    onChange={handleChange}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white" />
                  <div className="w-[220px] bg-white">
                    <HeaderPincodeChecker onChange={handlePincodeChange} />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={pincode == '000000'}
                  onClick={(e) => updateHandler(e)}
                  className={`text-white py-1 px-4 rounded-lg font-normal hover:bg-teal-700 transition mt-2 ${pincode == '000000' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600'}`}
                >Update</button>
              </div>)
              }
              <button onClick={addressHandler} className='text-blue-500'>{addressChange ? 'Cancel' : 'Change'}</button>
              <span>{error}</span>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18%)</span>
                <span>₹{(total * 0.18).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between font-bold text-lg text-gray-800">
                  <span>Total</span>
                  <span>₹{(total * 1.18).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button onClick={handleProceed} className={`block w-full py-3 rounded-lg font-semibold mb-4 text-center transition-colors bg-emerald-500 text-white hover:bg-emerald-600`}
            >Proceed to Checkout</button>

            {/* <Link
              href={user ? "/checkout" : "/login"}
              className={`block w-full py-3 rounded-lg font-semibold mb-4 text-center transition-colors bg-emerald-500 text-white hover:bg-emerald-600`}
            >
              Proceed to Checkout
            </Link> */}

            <Link
              href="/"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}