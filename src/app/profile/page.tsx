'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace('/login')
      }
    }, [isLoading, isAuthenticated, router])
  
    if (isLoading) {
      return null // or loader
    }
  
    if (!isAuthenticated) {
      return null
    }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold capitalize">
            {user?.name?.charAt(0)}
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-800 capitalize">
            {user?.name}
          </h2>
          <p className="text-gray-500 text-sm">
            {user?.email}
          </p>
        </div>

        {/* Info Card */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center p-0">
            <span className="text-gray-500 text-sm">Address</span>
            <span className="font-medium text-gray-800 lowercase">{user?.address}</span>
          </div>
          <div className="flex justify-between items-center p-0">
            <span className="text-gray-500 text-sm">Mobile</span>
            <span className="font-medium text-gray-800">{user?.mobile_number}</span>
          </div>
          <div className="flex justify-between items-center p-0">
            <span className="text-gray-500 text-sm">GST</span>
            <span className="font-medium text-gray-800">{user?.gst}</span>
          </div>

           </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => router.replace('/')}
          >
            Go to Home
          </button>

          <button
            className="w-full border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition"
            onClick={() => {
              logout()
              router.replace('/login')
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
