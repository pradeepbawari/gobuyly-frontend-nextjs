'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { getOrders } from '@/lib/api'

const Orders = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  /* ---------------- Redirect if not logged in ---------------- */
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, router])

  /* ---------------- Fetch Orders ---------------- */
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.id) {
      fetchOrders(user.id)
    }
  }, [isLoading, isAuthenticated, user])

  const fetchOrders = async (userId: number) => {
    try {
      setLoading(true)
      const data = await getOrders(userId)
      setOrders(data)
    } catch (err) {
      console.error('Failed to fetch orders', err)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || !isAuthenticated) return null

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>

      {loading && <p>Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <div className="bg-white shadow rounded-xl p-4">
          No orders found
        </div>
      )}

      {orders.map(order => (
        <div key={order.id} className="bg-white border border-gray-400 rounded-xl p-4 space-y-4">

          {/* Order Header */}
          <div className="flex justify-between">
            <p className="font-semibold text-gray-700">
              Order #{order.order_id}
            </p>
            <p className="text-sm text-yellow-600 font-semibold">
              {order.status}
            </p>
          </div>

          {/* Shipping Address */}
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Shipping Address</p>
            <p>{order.address.name}</p>
            <p>{order.address.area}</p>
            <p>
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
            <p>Mobile: {order.address.mobile_number}</p>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            {order.orderItems.map((item: any) => {
              const image =
                item?.variantOrder?.productImages?.[0]?.Image?.image_url ||
                '/placeholder.png'

              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row gap-4 border border-gray-300 rounded-lg p-3 bg-gray-50"
                >
                  {/* Product Image */}
                  <div className='w-full xs:w-20 sm:w-24 h-48 xs:h-24 sm:h-28 relative flex-shrink-0'>
                  <Image
                    src={image}
                    alt="Product"
                    fill
                        className="object-cover rounded-lg"
                        unoptimized
                  />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-gray-800">
                      {item.variantOrder?.displayTitle}
                    </p>
                    <p className="text-gray-500">
                      {item.variantOrder?.size}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-1 text-gray-600">
                      <p>SKU: {item.sku}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: ₹{item.price}</p>
                      <p className="text-yellow-600">
                        Status: {item.status}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Total Amount */}
          <div className="text-right font-semibold text-gray-800 pt-2 text-sm">
            <p>Shipping: <span className='text-green-600'>₹ {order.shipping || 0}</span></p>
            <p>Total: <span className='text-green-600'>₹ {order.amount}</span></p>
            <p>Subtotal: <span className='text-green-600'>₹{order.amount + (order.shipping || 0)}</span></p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Orders
