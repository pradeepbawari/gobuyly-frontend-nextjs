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
        <div key={order.id} className="bg-white shadow rounded-xl p-4 space-y-4">

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
                  className="flex gap-4 border rounded-lg p-3 bg-gray-50"
                >
                  {/* Product Image */}
                  <Image
                    src={image}
                    alt="Product"
                    width={60}
                    height={60}
                    className="rounded bg-white"
                  />

                  {/* Item Details */}
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-gray-800">
                      {item.variantOrder.product.name}
                    </p>
                    <p className="text-gray-500">
                      {item.variantOrder.size}
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
          <div className="text-right font-bold text-gray-800 pt-2">
            Total: ₹{order.amount + (order.shipping || 0)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Orders



// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/context/AuthContext'
// import { getOrders } from '@/lib/api'

// const Orders = () => {
//   const { user, isAuthenticated, isLoading } = useAuth()
//   const router = useRouter()

//   const [orders, setOrders] = useState<any[]>([])
//   const [loading, setLoading] = useState(false)

//   // Redirect logic
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       router.replace('/login')
//     }
//   }, [isLoading, isAuthenticated, router])

//   // Fetch orders when user is available
//   useEffect(() => {
//     if (!isLoading && isAuthenticated && user?.id) {
//       fetchOrders(user.id)
//     }
//   }, [isLoading, isAuthenticated, user])

//   const fetchOrders = async (userId: number) => {
//     try {
//       setLoading(true)
//       const orderData = await getOrders(userId)
//       setOrders(orderData)
//     } catch (error) {
//       console.error('Failed to fetch orders', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Block render until auth resolved
//   if (isLoading || !isAuthenticated) {
//     return null // or loader
//   }

//   return (
//     <div>
//       <h2>My Orders</h2>
//       {loading ? 'Loading orders...' : <>
      
//       <div className="max-w-7xl mx-auto p-4 space-y-6">
//             <h1 className="text-2xl font-bold text-gray-800 flex gap-5">Your Orders </h1>
//           {orders && orders.length == 0 && (<div className="bg-white shadow rounded-xl p-4 space-y-4">{'0'} orders</div>)}
//             {orders && orders.length > 0 && orders.map((order) => (
//               <div key={order.id} className="bg-white shadow rounded-xl p-4 space-y-4">
//                 {/* Order Header */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//                   <div>
//                     <h2 className="text-md font-semibold text-gray-700">Order ID #{order.id}</h2>              
//                   </div>
//                   {/* <span className="px-3 py-1 mt-2 md:mt-0 bg-yellow-100 text-yellow-800 text-xs rounded-full">
//                     Payment ID: {order.paymentDetails.razorpay_payment_id}
//                   </span> */}
//                 </div>
      
//                 {/* Address */}
//                 <div className="text-gray-700 flex gap-1 flex-wrap">
//                   <p className="font-medium mr-5">Shipping to: </p>
//                   <p>{order.address.fullName}</p>
//                   <p>{order.address.area}</p>
//                   <p>
//                     {order.address.city}, {order.address.state} - {order.address.pincode}
//                   </p>
//                   <p>Phone: {order.address.phoneNumber}</p>
//                 </div>
      
//                 {/* Items */}
//                 <div className="space-y-1">
//                   <p className="text-sm font-semibold text-gray-800">Items:</p>
//                   {order.orderItems.map((item:any) => (
//                     <div
//                       key={item.id}
//                       className="flex gap-4 border p-2 rounded-lg items-start sm:items-center bg-gray-50"
//                     >
//                       {/* <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/product/${item.slug}`}>
//                       <Image
//                         src={item.images?.image_thumbnail_url || '/placeholder.png'}
//                         alt="Product"
//                         width={40}
//                         height={40}
//                         className="bg-white rounded"
//                       />
//                       </Link> */}
//                       <div className="text-md text-gray-800 w-full">
//                         <div className="w-full mb-2">{item.title}</div>
//                         <div className="text-md text-gray-500 md:flex gap-4 justify-between w-full">
//                           <p>SKU: {item?.sku}</p>
//                           <p>Quantity: {item.quantity}</p>
//                           <p className="text-yellow-600">Status: {item.status}</p>
//                           <p>Price: ₹{item.price}</p>                  
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
      
//                 {/* Payment Details */}
//                 <div className="text-sm text-gray-600 pt-2">
//                   {/* <p>Order ID: {order.paymentDetails.razorpay_order_id}</p> */}
//                   {/* <p>Signature: {order.paymentDetails.razorpay_signature}</p> */}
//                   <p className="text-sm text-gray-600 text-right pr-5 font-bold">Total: ₹{order.amount + (order?.shipping || 0)}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//       </>}
//     </div>
//   )
// }

// export default Orders
