'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faHeart, faSignInAlt, faHome, faShoppingBag, faBox, faHeadset } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useCart } from '@/context/CartContext' // ADD THIS IMPORT
import Image from 'next/image'
import Logo from '../../../public/gobuyly.png'
import HeaderPincodeChecker from './HeaderPincodeChecker'

export default function Header() {
  const { itemCount } = useCart() // GET CART COUNT FROM CONTEXT

  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex text-lg text-gray-800">
          <Image src={Logo} alt='GoBuyly' className='w-12' /> Gobuyly
        </Link>
      </div>
       <div className="relative">
            <HeaderPincodeChecker />
        </div>

      <nav className="hidden md:flex gap-8 font-medium text-gray-700">
        <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <FontAwesomeIcon icon={faHome} className="text-sm" /> Home
        </Link>
        <Link href="/products" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <FontAwesomeIcon icon={faShoppingBag} className="text-sm" /> Shop
        </Link>
        <Link href="/account/orders" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <FontAwesomeIcon icon={faBox} className="text-sm" /> Orders
        </Link>
        <Link href="/support" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <FontAwesomeIcon icon={faHeadset} className="text-sm" /> Support
        </Link>
      </nav>

      <div className="flex items-center gap-5">
        
        <Link href="/cart" className="relative text-gray-700 hover:text-emerald-600 transition-colors">
          <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
          {itemCount > 0 && ( // USE itemCount FROM CONTEXT
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
        
        <div className="h-6 w-px bg-gray-200"></div>
        
        <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg transition-all hover:scale-[1.02]">
          <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />Sign In
        </button>
      </div>
    </header>
  )
}