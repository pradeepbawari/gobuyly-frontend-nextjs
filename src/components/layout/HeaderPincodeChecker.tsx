'use client'

import { useState } from 'react'

const ALLOWED_PINCODES = new Set(['110001', '110097'])

export type PincodeResult = {
  pincode: string
  valid: boolean
}

export default function HeaderPincodeChecker({
  onResult,
}: {
  onResult: (result: PincodeResult) => void
}) {
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const checkPincode = () => {
    setChecked(true)
    setLoading(true)

    setTimeout(() => {
      const valid = ALLOWED_PINCODES.has(input)

      setIsValid(valid)
      onResult({ pincode: input, valid })

      if (valid) {
        localStorage.setItem('delivery_pincode', input)
      } else {
        localStorage.removeItem('delivery_pincode')
      }

      setLoading(false)
    }, 300)
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={input}
          maxLength={6}
          onChange={(e) => {
            setInput(e.target.value.replace(/\D/g, ''))
            setChecked(false)
            setIsValid(null)
          }}
          placeholder="Enter pincode"
          className="border px-2 py-1"
        />

        <button
          disabled={input.length !== 6 || loading}
          onClick={checkPincode}
          className="bg-green-600 text-white px-3 disabled:opacity-50"
        >
          {loading ? 'Checking…' : 'Check'}
        </button>
      </div>

      {/* ✅ Error shown ONLY when invalid */}
      {checked && !loading && isValid === false && (
        <p className="text-sm mt-1 text-red-600">
          Delivery not available at this location
        </p>
      )}

      {/* ✅ Optional success feedback */}
      {checked && !loading && isValid === true && (
        <p className="text-sm mt-1 text-green-600">
          Delivery available
        </p>
      )}
    </div>
  )
}
