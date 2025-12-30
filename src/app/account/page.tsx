'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBox, faMapMarkerAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons'

export default function AccountPage() {
  const orders = [
    { id: 'ORD-001', date: '2025-12-20', total: 2499, status: 'Delivered' },
    { id: 'ORD-002', date: '2025-12-15', total: 1599, status: 'Processing' },
    { id: 'ORD-003', date: '2025-12-10', total: 3499, status: 'Delivered' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-emerald-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">John Doe</h3>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link
                href="/account"
                className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 text-emerald-600 font-medium"
              >
                <FontAwesomeIcon icon={faUser} />
                Account Overview
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <FontAwesomeIcon icon={faBox} />
                My Orders
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                Addresses
              </Link>
              <Link
                href="/account/payment"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <FontAwesomeIcon icon={faCreditCard} />
                Payment Methods
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
              <Link
                href="/account/orders"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-medium text-gray-700">Order ID</th>
                    <th className="text-left py-3 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 font-medium text-gray-700">Total</th>
                    <th className="text-left py-3 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 font-medium">{order.id}</td>
                      <td className="py-4 text-gray-600">{order.date}</td>
                      <td className="py-4 font-medium">₹{order.total.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Personal Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Name:</span> John Doe</p>
                  <p><span className="text-gray-500">Email:</span> john@example.com</p>
                  <p><span className="text-gray-500">Phone:</span> +91 9876543210</p>
                </div>
                <button className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
                  Edit Profile →
                </button>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Default Shipping Address</h3>
                <div className="space-y-2">
                  <p>123 Main Street</p>
                  <p>Mumbai, Maharashtra 400001</p>
                  <p>India</p>
                </div>
                <button className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
                  Manage Addresses →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}