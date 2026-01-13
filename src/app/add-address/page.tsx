'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { updateUserAddress } from '@/lib/api'
import AddressForm, { Address } from '@/components/forms/AddressForm'

export default function AddAddressPage() {
  const router = useRouter()
  const { user, login } = useAuth()

  const [address, setAddress] = useState<Address>({
    name: '',
    mobile_number: '',
    email: '',
    password: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [isEnabled, setIsEnabled] = useState(false)
  const [error, setError] = useState('')

  // Called by AddressForm whenever inputs or pincode change
  const handleAddressChange = (updatedAddress: Address, valid: boolean) => {
    setAddress(updatedAddress)
    setIsEnabled(valid)
  }

  const onSubmitHandler = async () => {
    if (!isEnabled) return

    try {
      const existingAddresses = Array.isArray(user?.address)
        ? user.address
        : []

      const updatedAddresses = [...existingAddresses, address]

      const payload = {
        id: user?.id,
        userData: {
          ...user,
          address: updatedAddresses,
        },
      }

      const res = await updateUserAddress(payload)

      if (res?.error) {
        setError(res.error)
        return
      }

      login(res.user)
      router.push('/cart')
    } catch (err) {
      console.error('Add address failed:', err)
      setError('Unable to save address')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Add New Address</h1>

      <AddressForm value={address} onChange={handleAddressChange} page='add-address' />

      {error && (
        <p className="text-red-600 text-sm mt-3">{error}</p>
      )}

      <button
        onClick={onSubmitHandler}
        disabled={!isEnabled}
        className={`max-w-sm w-full mt-6 py-3 text-white uppercase ${
          isEnabled
            ? 'bg-orange-600 hover:bg-orange-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Save address
      </button>
    </div>
  )
}
