'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faHeart, faSignInAlt, faHome, faShoppingBag, faBox, faHeadset, faSignOutAlt, faUserAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export default function Header() {
  const { itemCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Main header */}
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="text-lg text-gray-800 font-semibold" onClick={closeMenu}>
              GoBuyly
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 font-normal text-gray-700">
            <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
              Home
            </Link>
            <Link href="/orders" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
              Orders
            </Link>
            <Link href="/support" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
              <FontAwesomeIcon icon={faHeadset} className="text-sm" /> Support
            </Link>
          </nav>

          {/* Right side icons and buttons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative text-gray-700 hover:text-emerald-600 transition-colors" onClick={closeMenu}>
              <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-700 hover:text-emerald-600 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-xl" />
            </button>

            {/* Desktop Auth */}
            <div className="hidden md:flex gap-4 items-center">
              {!isAuthenticated ? (
                <Link href="/login" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg transition-all hover:scale-[1.02]">
                  Login <FontAwesomeIcon icon={faSignInAlt} className="ml-2" />
                </Link>
              ) : (
                <div className="flex gap-4 items-center">
                  <span className='capitalize text-gray-600 hidden lg:inline-block'>{user?.name}</span>
                  <Link href="/profile" className="text-gray-700 hover:text-emerald-600 transition-colors">
                    <FontAwesomeIcon icon={faUserAlt} className="text-lg" />
                  </Link>
                  <button 
                    onClick={() => {
                      logout()
                      closeMenu()
                    }} 
                    className="text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer"
                    title="Logout"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-3 mb-4">
              <Link 
                href="/" 
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faHome} className="text-sm w-5" />
                Home
              </Link>
              <Link 
                href="/orders" 
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faBox} className="text-sm w-5" />
                Orders
              </Link>
              <Link 
                href="/support" 
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faHeadset} className="text-sm w-5" />
                Support
              </Link>
            </nav>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-100 pt-4">
              {!isAuthenticated ? (
                <Link 
                  href="/login" 
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Login
                </Link>
              ) : (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUserAlt} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium capitalize text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  {/* Profile & Logout */}
                  <div className="flex gap-2">
                    <Link 
                      href="/profile" 
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={closeMenu}
                    >
                      <FontAwesomeIcon icon={faUserAlt} />
                      Profile
                    </Link>
                    <button 
                      onClick={() => {
                        logout()
                        closeMenu()
                      }} 
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}