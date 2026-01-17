'use client'

import { useRef } from 'react'
import HeaderPincodeChecker from '@/components/layout/HeaderPincodeChecker'
import { useParams } from 'next/navigation';

export interface Address {
  name: string
  mobile_number: string
  email:string
  password: string
  pincode: string
  area: string
  city: string
  state: string
}

interface Props {
  value: Address
  onChange: (address: Address, isValid: boolean) => void
  page: string
}

const AddressForm = ({ value, onChange, page }: Props) => {
  const formRef = useRef<HTMLFormElement>(null)

  // Handle any input change
  const handleInputChange = (field: keyof Address, val: string) => {
    const updated = { ...value, [field]: val }

    const formValid = isFormValid(updated)
    const enabled = formValid && isPincodeValid(updated.pincode)

    onChange(updated, enabled)
  }

  // Called when pincode is checked
  const handlePincode = (result: { valid: boolean; pincode: string }) => {
    const updated = { ...value, pincode: result.pincode }

    const formValid = isFormValid(updated)
    const enabled = formValid && result.valid

    onChange(updated, enabled)
  }

  // Form validity check (all required fields filled)
  const isFormValid = (addr: Address) => {
    return (
      addr.name.trim() !== '' &&
      addr.mobile_number.trim() !== '' &&
      addr.area.trim() !== '' &&
      addr.city.trim() !== '' &&
      addr.state.trim() !== '' &&
      page === 'register' ? addr.pincode.trim() !== '' : addr.pincode.trim() !== ''
    )
  }

  // For UI, you can optionally highlight valid/invalid pincode
  const isPincodeValid = (pin: string) => {
    // Optional: if you want a default pincode validation here
    return pin.length === 6
  }

  return (
    <form ref={formRef} className="w-full" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-3 max-w-sm mt-10">
        <input
          required
          className="px-2 py-2.5 border rounded w-full"
          placeholder="Full name"
          value={value.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />

        <input
          required
          className="px-2 py-2.5 border rounded w-full"
          placeholder="Phone number"
          value={value.mobile_number}
          onChange={(e) => handleInputChange('mobile_number', e.target.value)}
        />
        {page === 'register' && (
            <><input
          required
          className="px-2 py-2.5 border rounded w-full"
          placeholder="Email"
          value={value.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />

        <input
          required
          className="px-2 py-2.5 border rounded w-full"
          placeholder="Password"
          value={value.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
        /></>)}

        <textarea
          required
          rows={4}
          className="px-2 py-2.5 border rounded w-full resize-none"
          placeholder="Address (Area and Street)"
          value={value.area}
          onChange={(e) => handleInputChange('area', e.target.value)}
        />

        <div className="flex gap-3">
          <input
            required
            className="px-2 py-2.5 border rounded w-full"
            placeholder="City/District/Town"
            value={value.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
          <input
            required
            className="px-2 py-2.5 border rounded w-full"
            placeholder="State"
            value={value.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
          />
        </div>

        {/* REGISTER PAGE → manual pincode input */}
{page === 'register' && (
  <input
    required
    maxLength={6}
    className="px-2 py-2.5 border rounded w-full"
    placeholder="Pincode"
    value={value.pincode}
    onChange={(e) => handleInputChange('pincode', e.target.value)}
  />
)}

{/* OTHER PAGES → pincode checker */}
{page !== 'register' && (
  <HeaderPincodeChecker onResult={handlePincode} />
)}
      </div>
    </form>
  )
}

export default AddressForm
