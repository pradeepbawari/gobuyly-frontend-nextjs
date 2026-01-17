'use client'

import { useState } from 'react'

// const ALLOWED_PINCODES = new Set(['110001', '110097'])
const ALLOWED_PINCODES = new Set<string>([
  '110001', '110002', '110003', '110004', '110005',
  '110006', '110007', '110008', '110009', '110010',
  '110011', '110012', '110013', '110014', '110015',
  '110016', '110017', '110018', '110019', '110020',
  '110021', '110022', '110023', '110024', '110025',
  '110026', '110027', '110028', '110029', '110030',
  '110031', '110032', '110033', '110034', '110035',
  '110036', '110037', '110038', '110039', '110040',
  '110041', '110042', '110043', '110044', '110045',
  '110046', '110047', '110048', '110049', '110050',
  '110051', '110052', '110053', '110054', '110055',
  '110056', '110057', '110058', '110059', '110060',
  '110061', '110062', '110063', '110064', '110065',
  '110066', '110067', '110068', '110069', '110070',
  '110071', '110072', '110073', '110074', '110075',
  '110076', '110077', '110078', '110079', '110080',
  '110081', '110082', '110083', '110084', '110085',
  '110086', '110087', '110088', '110089', '110090',
  '110091', '110092', '110093', '110094', '110095',
  '110096'
])


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
