'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar,
  faShippingFast,
  faCartPlus,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faSearchPlus,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  product?: any
}

export default function ProductCard({ product = {} }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [showZoom, setShowZoom] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { addToCart } = useCart()

  // Handle undefined product
  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center bg-white p-4 rounded-lg border border-gray-200 mb-3 gap-4">
        <div className="w-full text-center py-8 text-gray-500">
          Product data not available
        </div>
      </div>
    )
  }

  const price = parseFloat(product.price) || 0
  const salePrice = parseFloat(product.sale_price) || 0
  const finalPrice = salePrice > 0 ? salePrice : price
  const hasDiscount = salePrice > 0 && salePrice < price

  // Get all images
  const allImages = [
    product.primary_image?.image_url,
    ...(product.images?.map((img: any) => img.image_url) || []),
  ].filter(Boolean)

  const mainImage = allImages[selectedImageIndex] || null

  const handleImageClick = () => {
    if (allImages.length > 0) {
      setShowZoom(true)
      document.body.style.overflow = 'hidden'
    }
  }

  const closeZoom = () => {
    setShowZoom(false)
    document.body.style.overflow = 'auto'
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    )
  }

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(prev + 1, product.stock))
  }

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleAddToCart = () => {
    if (quantity > product.stock || product.stock <= 0) return
    addToCart(product, quantity)
    setQuantity(1)
  }

  useEffect(() => {
  if (!showZoom) return

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeZoom()
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  return () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
}, [showZoom])


  return (
    <>
      {/* Single HTML structure for both mobile and desktop */}
      <div className="flex flex-col items-center sm:grid sm:grid-cols-[72px_repeat(12,1fr)] bg-white rounded-lg border-b border-gray-200 mb-0 
                      transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-50
                      p-3 sm:p-2 sm:pr-0 gap-3 sm:gap-4">
        
        {/* Product Image - Mobile: Full width, Desktop: Fixed column */}
        <div 
          className="w-full flex justify-center sm:block cursor-pointer"
          onClick={handleImageClick}
        >
          <div className="relative w-24 h-24 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-16 lg:h-16">
            {mainImage ? (
              <>
                <Image
                  src={mainImage}
                  alt={product.sku || 'Product'}
                  fill
                  className="object-cover rounded-lg"
                  unoptimized
                />
                
              </>
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details - Mobile: Below image, Desktop: Middle columns */}
        <div className="sm:col-span-5 lg:col-span-6">
          {/* Brand & Title */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 mb-2">
            <h4 className="font-normal text-[#2D2926] text-sm sm:text-base line-clamp-2 flex-1">
              {product?.displayTitle || 'Product Title'}
            </h4>
            {/* {product?.title?.company_id && (
              <span className="text-xs font-medium text-gray-600 px-2 py-1 
                             bg-gray-100 rounded uppercase self-start sm:self-auto">
                {product.title.company_id}
              </span>
            )} */}
          </div>

          {/* Rating & Delivery */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
            {/* <div className="flex items-center text-xs sm:text-sm">
              <FontAwesomeIcon icon={faStar} className="text-amber-400 mr-1 text-xs sm:text-sm" />
              <span className="font-medium">{product.rating || 4.5}</span>
              <span className="text-gray-400 ml-0.5">/5</span>
            </div>
            <span className="text-gray-300 text-xs sm:text-sm">•</span> */}
            <div className="text-gray-400 text-xs sm:text-sm flex items-center">
              <FontAwesomeIcon icon={faShippingFast} className="mr-1 text-xs sm:text-sm" />
              <span>2 Days</span>
            </div>
          </div>

          {/* Price - Mobile: Inline, Desktop: In its own column */}
          <div className="sm:hidden mb-3">
            <div className="font-bold text-green-800 text-lg">
              ₹{finalPrice.toLocaleString()}
            </div>
            {hasDiscount && (
              <div className="text-xs text-gray-500 line-through">
                ₹{price.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Price - Desktop Only */}
        <div className="hidden sm:block sm:col-span-2 text-center">
          <div className="font-normal text-green-700 text-base lg:text-lg">
            ₹ {finalPrice.toLocaleString()}
          </div>
          {hasDiscount && (
            <div className="text-xs text-gray-500 line-through">
              ₹ {price.toLocaleString()}
            </div>
          )}
        </div>

        {/* Quantity Controls - Mobile: Below details, Desktop: Next column */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between sm:justify-center gap-2">
            <span className="text-sm text-gray-600 sm:hidden">Quantity:</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleDecrease}
                disabled={quantity === 1}
                className="w-8 h-8 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded border border-gray-300 bg-white
                         flex items-center justify-center font-normal cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-gray-50 active:bg-gray-100"
              >
                <FontAwesomeIcon icon={faMinus} className="text-xs text-gray-600" />
              </button>

              <span className="min-w-6 sm:min-w-8 text-center font-normal text-sm">
                {quantity}
              </span>

              <button
                onClick={handleIncrease}
                disabled={quantity >= product.stock}
                className="w-8 h-8 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded border border-gray-300 bg-white
                         flex items-center justify-center font-normal cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-gray-50 active:bg-gray-100"
              >
                <FontAwesomeIcon icon={faPlus} className="text-xs text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Add to Cart Button - Mobile: Full width, Desktop: Last column */}
        <div className="sm:col-span-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full bg-[#E41F26] text-white font-normal text-sm rounded-lg cursor-pointer
                     flex items-center justify-center gap-2
                     hover:bg-emerald-600 transition-colors active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed
                     py-2.5 sm:py-2 md:py-1.5"
          >
            <FontAwesomeIcon icon={faCartPlus} className="text-sm" />
            <span className="sm:hidden">Add to Cart</span>
            <span className="hidden sm:inline md:hidden">Add</span>
            <span className="hidden md:inline lg:hidden">Add to Cart</span>
            <span className="hidden lg:inline">Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Image Zoom Modal - Responsive */}
      {showZoom && (
        <div className='fixed w-[60%] h-[80%] m-auto z-50 inset-0'>
          
        <div className="inset-0 relative z-50 bg-white flex items-center justify-center p-2 sm:p-4 rounded-md">
          {/* Close button */}
          <button
            onClick={closeZoom}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-black/60 text-xl sm:text-2xl z-10
                     hover:text-emerald-400 transition-colors p-2"
            aria-label="Close zoom"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute z-50 left-2 sm:left-4 top-1/2 -translate-y-1/2
                         text-black/60 text-xl sm:text-2xl p-2 sm:p-3 
                         hover:text-emerald-400 transition-colors"
                aria-label="Previous image"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onClick={nextImage}
                className="absolute z-50 right-2 sm:right-4 top-1/2 -translate-y-1/2
                         text-black/60 text-xl sm:text-2xl p-2 sm:p-3
                         hover:text-emerald-400 transition-colors"
                aria-label="Next image"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </>
          )}

          {/* Main zoomed image */}
          <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] max-w-4xl">
            <Image
              src={mainImage!}
              alt={product.sku || 'Product'}
              fill
              className="object-contain"
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw"
            />
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="absolute z-50 bottom-2 sm:bottom-4 left-0 right-0 px-2">
              <div className="flex justify-center gap-1 sm:gap-2 overflow-x-auto py-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg border-2 overflow-hidden
                              transition-all ${selectedImageIndex === index
                                ? 'border-emerald-500 scale-105'
                                : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image counter */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 text-white bg-black/50 
                        px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
            {selectedImageIndex + 1} / {allImages.length}
          </div>
        </div>
        <div className='fixed inset-0 bg-black/90 opacity-15'></div>
        </div>
      )}
    </>
  )
}