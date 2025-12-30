// components/HeaderPincodeChecker.tsx
'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faCheck, faTimes, faTruck } from '@fortawesome/free-solid-svg-icons'

// Only these pincodes are allowed
const ALLOWED_PINCODES = [
  '110094', '110093',
  '110001', '110020', '110025',
  '400001', '500001', '560001',
  '600001', '700001', '411001',
  '122001', '201301'
]

export default function HeaderPincodeChecker() {
  const [pincode, setPincode] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [savedPincode, setSavedPincode] = useState<string | null>(null)

  const checkPincode = () => {
    if (pincode.length !== 6) {
      setIsValid(false)
      return
    }

    setIsChecking(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const isValidPincode = ALLOWED_PINCODES.includes(pincode)
      setIsValid(isValidPincode)
      setIsChecking(false)
      
      if (isValidPincode) {
        setSavedPincode(pincode)
        localStorage.setItem('userPincode', pincode)
      }
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkPincode()
    }
  }

  const clearPincode = () => {
    setPincode('')
    setIsValid(null)
    setSavedPincode(null)
    localStorage.removeItem('userPincode')	
  }
  
  const statusHandler = (e) => {
	  setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))
  }

  return (
    <div className="relative">
      {savedPincode ? (
        // Display saved pincode
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 text-sm" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-600">Deliver to</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{savedPincode}</span>
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
        // Pincode input form
        <div className="relative">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <div className="pl-3 pr-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-sm" />
            </div>
            
            <input
              type="text"
              value={pincode}
              onChange={(e) => statusHandler(e)}
              onKeyPress={handleKeyPress}
              placeholder="Enter pincode"
              className="px-2 py-1.5 text-sm w-32 outline-none border-none"
              maxLength={6}
            />
            
            <button
              onClick={checkPincode}
              disabled={isChecking || pincode.length !== 6}
              className="px-3 py-1.5 bg-emerald-500 text-white text-sm font-medium
                         hover:bg-emerald-600 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? 'Checking...' : 'Check'}
            </button>
          </div>

          {/* Validation message */}
          {isValid !== null && (
            <div className="absolute top-full left-0 right-0 mt-1 text-xs">
              {isValid ? (
                <div className="flex items-center gap-1 text-emerald-600">
                  <FontAwesomeIcon icon={faCheck} className="text-xs" />
                  <span>Delivery available to this pincode</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  <span>Delivery not available</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}