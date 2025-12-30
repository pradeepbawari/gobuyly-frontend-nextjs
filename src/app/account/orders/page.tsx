export default function OrdersPage() {
  const orders = [
    { id: 'ORD-001', date: '2025-12-20', total: 2499, status: 'Delivered', items: 3 },
    { id: 'ORD-002', date: '2025-12-15', total: 1599, status: 'Processing', items: 2 },
    { id: 'ORD-003', date: '2025-12-10', total: 3499, status: 'Delivered', items: 5 },
    { id: 'ORD-004', date: '2025-12-05', total: 1299, status: 'Cancelled', items: 1 },
    { id: 'ORD-005', date: '2025-12-01', total: 4999, status: 'Delivered', items: 4 }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 font-medium text-gray-700">Order ID</th>
                <th className="text-left py-3 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 font-medium text-gray-700">Items</th>
                <th className="text-left py-3 font-medium text-gray-700">Total Amount</th>
                <th className="text-left py-3 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 font-medium">{order.id}</td>
                  <td className="py-4 text-gray-600">{order.date}</td>
                  <td className="py-4">{order.items} items</td>
                  <td className="py-4 font-medium">₹{order.total.toLocaleString()}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'Processing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        View
                      </button>
                      {order.status === 'Delivered' && (
                        <button className="px-3 py-1 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600">
                          Reorder
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}