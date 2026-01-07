'use client'

import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

const ALLOWED_PINCODES = new Set([
  '110001', '110097',
])

/* ---------- Types ---------- */
export type PincodeStatus = {
  pincode: string | null
  isValid: boolean | null
}

type Props = {
  onChange?: (data: PincodeStatus) => void
}

/* ---------- Component ---------- */
export default function HeaderPincodeChecker({ onChange }: Props) {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<PincodeStatus>({
    pincode: null,
    isValid: null,
  })
  const [loading, setLoading] = useState(false)

  /* ---------- Init from localStorage ---------- */
  useEffect(() => {
    const stored = localStorage.getItem('userPincode')
    if (stored) {
      const initStatus = { pincode: stored, isValid: true }
      setStatus(initStatus)
      onChange?.(initStatus)
    }
  }, [onChange])

  /* ---------- Helpers ---------- */
  const updateStatus = useCallback(
    (data: PincodeStatus) => {
      setStatus(data)
      onChange?.(data)
    },
    [onChange]
  )

  const validatePincode = useCallback(() => {
    if (input.length !== 6) {
      updateStatus({ pincode: null, isValid: false })
      return
    }

    setLoading(true)

    setTimeout(() => {
      const isValid = ALLOWED_PINCODES.has(input)

      if (isValid) {
        localStorage.setItem('userPincode', input)
        updateStatus({ pincode: input, isValid: true })
      } else {
        updateStatus({ pincode: null, isValid: false })
      }

      setLoading(false)
    }, 400)
  }, [input, updateStatus])

  const clearPincode = () => {
    localStorage.removeItem('userPincode')
    setInput('')
    updateStatus({ pincode: null, isValid: null })
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.replace(/\D/g, '').slice(0, 6))
  }

  /* ---------- UI ---------- */
  return (
    <div className="relative">
      {status.pincode ? (
        /* ----- Saved View ----- */
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 text-sm" />
          <div>
            <span className="text-xs text-gray-500">Deliver to</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{status.pincode}</span>
              <button
                onClick={clearPincode}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ----- Input View ----- */
        <div>
          <div className="flex items-center border rounded-md overflow-hidden">
            <span className="px-3 text-gray-400">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </span>

            <input
              value={input}
              onChange={onInputChange}
              placeholder="Enter pincode"
              className="w-28 px-2 py-1.5 text-sm outline-none"
              maxLength={6}
            />

            <button
              onClick={validatePincode}
              disabled={loading || input.length !== 6}
              className="px-3 py-1.5 bg-emerald-500 text-white text-sm
                         disabled:opacity-50 hover:bg-emerald-600"
            >
              {loading ? 'Checking…' : 'Check'}
            </button>
          </div>

          {/* ----- Status Message ----- */}
          {status.isValid !== null && (
            <div className="mt-1 text-xs flex items-center gap-1">
              {status.isValid ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <FontAwesomeIcon icon={faCheck} />
                  Delivery available
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
                  <FontAwesomeIcon icon={faTimes} />
                  Delivery not available
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
