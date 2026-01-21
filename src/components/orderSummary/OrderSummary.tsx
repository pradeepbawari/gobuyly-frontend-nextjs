'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/lib/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCheckCircle, faTimesCircle, faPlus } from '@fortawesome/free-solid-svg-icons'

// Example: allowed pincodes
const ALLOWED_PINCODES = new Set(['110001', '110097', '110002']) // add your allowed pincodes

const OrderSummary = () => {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { cart, total, itemCount, clearCart } = useCart()

  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const [shippingCost, setShippingCost] = useState(0)
  const [error, setError] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [pincodeMessage, setPincodeMessage] = useState('')

  const dropdownRef = useRef<HTMLDivElement>(null)

  /* ------------------------------- Load Addresses ------------------------------- */
  useEffect(() => {
    if (user?.address) {
      try {
        const parsed = user.address
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAddresses(parsed)
          setSelectedAddress(parsed[0])
        }
      } catch (err) {
        console.error('Invalid address JSON')
      }
    }
  }, [user])

  /* ------------------------------- Shipping Calculation ------------------------------- */
  useEffect(() => {
    if (!selectedAddress) return

    if (total >= 2000) {
      setShippingCost(0)
    } else {
      setShippingCost(250)
    }
  }, [total, selectedAddress])

  /* ------------------------------- Close dropdown on outside click ------------------------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /* ------------------------------- Check if selected address is deliverable ------------------------------- */
  const checkPincode = (pincode: string) => {
    if (ALLOWED_PINCODES.has(pincode)) {
      setPincodeMessage('Delivery available at this address')
      return true
    } else {
      setPincodeMessage('Cannot deliver to this location')
      return false
    }
  }

  /* ------------------------------- Place Order ------------------------------- */
  const placeOrder = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!selectedAddress) {
      setError('Please select a delivery address.')
      return
    }

    // ✅ Check delivery pincode
    if (!checkPincode(selectedAddress.pincode)) {
      setError('Cannot deliver to this address. Please select another address.')
      return
    }

    setPlacingOrder(true)
    setError('')

    try {
      const orderPayload = {
        userId: user?.id,
        cartItems: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          sku: item.product.sku,
          gst: item.product.gst_rate
        })),
        subtotal: total,
        tax: Number((total * 0.18).toFixed(2)),
        shipping: shippingCost,
        amount: total,
        address: selectedAddress,
        pincode: selectedAddress.pincode,
      }

      await createOrder(orderPayload)
      clearCart()
      router.push('/orders')
    } catch (err) {
      console.error(err)
      setError('Unable to place order. Please try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  const addressHandler = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    router.push('/add-address')
  }

  /* ------------------------------- Handle address selection ------------------------------- */
  const handleSelectAddress = (addr: any) => {
    setSelectedAddress(addr)
    checkPincode(addr.pincode)
    setIsOpen(false)
  }

  return (
    <div className="w-full bg-gray-50 p-4 sm:p-0 md:p-6 rounded-xl">
      <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">Order Summary</h2>

      <hr className="my-3 sm:my-4" />

      {/* ---------------- Address Dropdown ---------------- */}
      <div className="mb-4 relative" ref={dropdownRef}>
        <p className="text-sm font-medium text-gray-600 mb-2">
          SELECT DELIVERY ADDRESS
        </p>

        {/* Selected Address */}
        <div
          onClick={() => setIsOpen(prev => !prev)}
          className="bg-white border border-gray-300 rounded-lg p-3 cursor-pointer flex justify-between items-center hover:border-emerald-500 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 truncate">
              {selectedAddress
                ? `${selectedAddress?.name}, ${selectedAddress.area}, ${selectedAddress.city}`
                : 'Select Address'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {selectedAddress ? `${selectedAddress.state}, ${selectedAddress.pincode}` : 'Click to select'}
            </p>
          </div>
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={`text-gray-500 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Dropdown List */}
        {isOpen && (
          <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
            {addresses.length > 0 ? (
              <>
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-3 text-sm cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                      selectedAddress?.id === addr.id ? 'bg-emerald-50' : ''
                    }`}
                  >
                    <p className="font-medium text-gray-800">{addr.name}</p>
                    <p className="text-gray-600">{addr.area}, {addr.city}</p>
                    <p className="text-gray-500 text-xs">{addr.state}, {addr.pincode}</p>
                  </div>
                ))}
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No addresses saved
              </div>
            )}

            <div
              onClick={addressHandler}
              className="p-3 text-emerald-600 text-sm cursor-pointer hover:bg-emerald-50 border-t flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              Add New Address
            </div>
          </div>
        )}
      </div>

      {/* Show pincode delivery message */}
      {pincodeMessage && (
        <div className={`flex items-center gap-2 text-sm mt-2 p-2 rounded-lg ${
          pincodeMessage.includes('Cannot') 
            ? 'bg-red-50 text-red-600' 
            : 'bg-emerald-50 text-emerald-600'
        }`}>
          <FontAwesomeIcon 
            icon={pincodeMessage.includes('Cannot') ? faTimesCircle : faCheckCircle} 
            className="text-sm"
          />
          {pincodeMessage}
        </div>
      )}

      <hr className="my-4" />

      {/* ---------------- Price Breakdown ---------------- */}
      <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
        <div className="flex justify-between">
          <span className="text-gray-600">Items + GST ({itemCount})</span>
          <span className="font-medium">₹{total.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shippingCost === 0 ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              `₹${shippingCost}`
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <input 
            type='checkbox' 
            checked={true} 
            readOnly 
            className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400"
          />
          <span>COD (Cash on Delivery)</span>
        </div>

        <div className="flex justify-between font-semibold text-lg sm:text-xl border-t pt-3 sm:pt-4 mt-2 sm:mt-3">
          <span>Total Amount</span>
          <span>₹{(total + shippingCost).toLocaleString()}</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={placeOrder}
        disabled={placingOrder || !selectedAddress || pincodeMessage.includes('Cannot')}
        className={`w-full mt-5 sm:mt-6 py-3 sm:py-3.5 text-white font-medium rounded-lg transition-all
          ${placingOrder || !selectedAddress || pincodeMessage.includes('Cannot')
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98]'
          }`}
      >
        {placingOrder ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Placing Order...
          </span>
        ) : 'Place Order'}
      </button>

      {/* Mobile Continue Shopping Link */}
      <div className="lg:hidden mt-4 text-center">
        <button
          onClick={() => router.push('/')}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
        >
          ← Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default OrderSummary