'use client'

import { useState } from 'react'
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
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [showZoomCursor, setShowZoomCursor] = useState(false)
  const { addToCart } = useCart()

  // Handle undefined product
  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="grid grid-cols-12 gap-6 bg-white p-5 rounded-xl border border-gray-200 items-center mb-3">
        <div className="col-span-12 text-center py-8 text-gray-500">
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

  /* ---------------- Image Zoom Handlers ---------------- */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showZoomCursor) return

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  const handleImageClick = () => {
    if (allImages.length > 0) {
      setShowZoom(true)
      document.body.style.overflow = 'hidden' // Prevent scrolling
    }
  }

  const closeZoom = () => {
    setShowZoom(false)
    document.body.style.overflow = 'auto'
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length)
    setZoomPosition({ x: 50, y: 50 })
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    )
    setZoomPosition({ x: 50, y: 50 })
  }

  /* ---------------- Quantity handlers ---------------- */
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

  return (
    <>
      <div
        className="grid grid-cols-13 items-center gap-5 bg-white px-3 py-4 rounded-xl mb-3
                 shadow-sm border border-gray-200 transition-all duration-200
                 hover:shadow-md hover:border-emerald-500 hover:-translate-y-0.5"
      >
        {/* Product Image with Zoom Preview */}
        <div className="col-span-2 relative">
          {mainImage ? (
            <div
              className="relative w-18 h-18 mx-auto cursor-zoom-in group"
              onClick={handleImageClick}
              onMouseEnter={() => setShowZoomCursor(true)}
              onMouseLeave={() => setShowZoomCursor(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={mainImage}
                alt={product.sku || 'Product'}
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
              
              {/* Zoom icon overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faSearchPlus}
                  className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity text-lg"
                />
              </div>

              {/* Image counter badge */}
              {/* {allImages.length > 1 && (
                <div className="absolute -top-2 -left-10 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                  {allImages.length}
                </div>
              )} */}
            </div>
          ) : (
            <div 
              className="w-24 h-28 bg-gray-100 rounded-lg flex items-center justify-center mx-auto cursor-pointer"
              onClick={handleImageClick}
            >
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}

          {/* Thumbnail Strip (if multiple images) */}
          {allImages.length > 1 && (
            <div className="flex justify-start gap-1 mt-2">
              {allImages.slice(0, 3).map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImageIndex(index)
                  }}
                  className={`w-8 h-8 rounded border ${
                    selectedImageIndex === index
                      ? 'border-emerald-500'
                      : 'border-gray-300'
                  } overflow-hidden`}
                >
                  <Image
                    src={img}
                    alt={`Thumb ${index + 1}`}
                    width={20}
                    height={20}
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
              {allImages.length > 3 && (
                <div className="w-5 h-5 flex items-center justify-center text-xs text-gray-500">
                  +{allImages.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rest of your existing product card code remains the same */}
        {/* Product Details */}
        <div className="col-span-4">
		<div className="flex justify-between gap-3">
        <h4 className="font-semibold text-gray-800 text-lg">
          <span>
            {product?.product_name} {product?.title?.size} {product?.title?.materials} {product?.title?.color_id !== 'No Colour' ? product?.title?.color_id : ''}
          </span>
		  </h4>
<span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1.5 h-7 rounded uppercase">{product?.title?.company_id}</span>
</div>
          <p className="text-gray-500 text-[13px] mb-2 line-clamp-2">
            {product.description || 'Premium product'}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faStar} className="text-amber-400 mr-1" />
              <span className="text-sm font-medium">{product.rating || 4.5}</span>
              <span className="text-gray-400 text-sm ml-1">/ 5</span>
            </div>

            <span className="text-gray-400">•</span>

            <div className="text-gray-500 text-sm">
              <FontAwesomeIcon icon={faShippingFast} className="mr-1" />
              Delivery in 2 Days
            </div>
          </div>
        </div>

        {/* Stock */}
        <div className="col-span-2">
          <span className="stock-badge col-span-2 px-3 py-0.5">
            Stock
          </span>
          <p className="text-gray-500 text-xs mt-1">
            {product.stock || 0} available
          </p>
        </div>

        {/* Price */}
        <div className="col-span-1">
          <div className="font-bold text-gray-800 text-lg">
            ₹{finalPrice.toLocaleString()}
          </div>
          {hasDiscount && (
            <div className="text-xs text-gray-500 line-through">
              ₹{price.toLocaleString()}
            </div>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={handleDecrease}
              disabled={quantity === 1}
              className="w-8 h-8 p-4 rounded-lg border border-gray-300 bg-white
                         flex items-center justify-center font-semibold
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faMinus} className='text-xs text-gray-600' />
            </button>

            <span className="min-w-8 text-center font-semibold text-sm">
              {quantity}
            </span>

            <button
              onClick={handleIncrease}
              disabled={quantity >= product.stock}
              className="w-8 h-8 p-4 rounded-lg border border-gray-300 bg-white
                         flex items-center justify-center font-semibold
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faPlus} className='text-xs text-gray-600' />
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <div className="col-span-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="bg-emerald-500 w-full text-white px-4 py-2.5 rounded-lg
                       font-medium flex items-center justify-center gap-2
                       hover:bg-emerald-600 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faCartPlus} className="text-xs" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      {/* Image Zoom Modal/Overlay */}
      {showZoom && (
        <div className="fixed top-16 inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeZoom}
            className="absolute top-4 right-4 text-white text-2xl z-10
                     hover:text-emerald-400 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2
                         text-white text-2xl p-3 hover:text-emerald-400 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2
                         text-white text-2xl p-3 hover:text-emerald-400 transition-colors"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </>
          )}

          {/* Main zoomed image */}
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={mainImage!}
              alt={product.sku || 'Product'}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Thumbnail strip at bottom */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex justify-center gap-2 overflow-x-auto px-4 py-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden
                              transition-all ${
                                selectedImageIndex === index
                                  ? 'border-emerald-500 scale-105'
                                  : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${index + 1}`}
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
          <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
            {selectedImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  )
}