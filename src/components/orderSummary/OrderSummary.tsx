'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { createOrder } from '@/lib/api'

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
  const [pincodeMessage, setPincodeMessage] = useState('') // success/error for pincode check

  const dropdownRef = useRef<HTMLDivElement>(null)

  /* ------------------------------- Load Addresses ------------------------------- */
  useEffect(() => {
    if (user?.address) {
      try {
        const parsed = user.address
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAddresses(parsed)
          setSelectedAddress(parsed[0]) // default selection
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
      setPincodeMessage('Delivery available at this address ✅')
      return true
    } else {
      setPincodeMessage('Cannot deliver to this location ❌')
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
        // amount: Number((total + shippingCost + total).toFixed(2)),
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
    <div className="w-full md:w-96 bg-gray-50 p-5">
      <h2 className="text-xl font-medium text-gray-700">Order Summary</h2>

      <hr className="my-4" />

      {/* ---------------- Address Dropdown ---------------- */}
      <div className="mb-4 relative" ref={dropdownRef}>
        <p className="text-sm font-medium text-gray-600 mb-2">
          SELECT DELIVERY ADDRESS
        </p>

        {/* Selected Address */}
        <div
          onClick={() => setIsOpen(prev => !prev)}
          className="bg-white border p-3 cursor-pointer flex justify-between items-center"
        >
          <p className="text-sm text-gray-700">
            {selectedAddress
              ? `${selectedAddress?.name}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
              : 'Select Address'}
          </p>
          <span className="text-gray-500">⌄</span>
        </div>

        {/* Dropdown List */}
        {isOpen && (
          <div className="absolute z-20 w-full bg-white border mt-1 shadow">
            {addresses.map((addr, index) => (
              <div
                key={index}
                onClick={() => handleSelectAddress(addr)}
                className="p-3 text-sm cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
              >
                <p className="font-medium">{addr.name}</p>
                <p>{addr.area}, {addr.city}</p>
                <p>{addr.state}, {addr.pincode}</p>
              </div>
            ))}

            <div
              onClick={addressHandler}
              className="p-3 text-orange-600 text-sm cursor-pointer hover:bg-gray-50 border-t"
            >
              + Add New Address
            </div>
          </div>
        )}
      </div>

      {/* Show pincode delivery message */}
      {pincodeMessage && (
        <p className={`text-sm mt-1 ${pincodeMessage.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>
          {pincodeMessage}
        </p>
      )}

      <hr className="my-4" />

      {/* ---------------- Price Breakdown ---------------- */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Items ({itemCount})</span>
          <span>₹{total}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
        </div>

        <div>
          <input type='checkbox' checked={true} readOnly /> COD (cash on delivery)
        </div>

        <div className="flex justify-between font-medium text-lg border-t pt-2">
          <span>Total + GST</span>
          <span>₹{total + shippingCost}</span>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      <button
        onClick={placeOrder}
        disabled={placingOrder}
        className={`w-full mt-5 py-3 text-white ${
          placingOrder
            ? 'bg-gray-400'
            : 'bg-orange-600 hover:bg-orange-700'
        }`}
      >
        {placingOrder ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  )
}

export default OrderSummary
