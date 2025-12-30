'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products?: any[] // Make optional
  loading?: boolean
}

export default function ProductGrid({ products = [], loading = false }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-6 bg-white p-5 rounded-xl border border-gray-200 animate-pulse">
            <div className="col-span-1">
              <div className="w-16 h-16 bg-gray-200 rounded mx-auto"></div>
            </div>
            <div className="col-span-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="col-span-2">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="col-span-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="col-span-2">
              <div className="h-8 bg-gray-200 rounded w-24 mx-auto"></div>
            </div>
            <div className="col-span-1">
              <div className="h-10 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : []

  if (safeProducts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Products Found</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Try adjusting your search or filter criteria. No products match your current selection.
        </p>
      </div>
    )
  }

  // Calculate pagination
  const totalPages = Math.ceil(safeProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentProducts = safeProducts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div>
      {/* Table Header - EXACT MOCKUP STYLE */}
      {/* <div className="grid grid-cols-12 gap-6 px-5 py-3 bg-emerald-50 rounded-t-xl border border-emerald-100 mb-2 font-medium text-gray-700 text-sm">
        <div className="col-span-1">PRODUCT</div>
        <div className="col-span-4">DETAILS</div>
        <div className="col-span-2">STOCK STATUS</div>
        <div className="col-span-2">PRICE</div>
        <div className="col-span-2">QUANTITY</div>
        <div className="col-span-1">ACTIONS</div>
      </div> */}

      {/* Products Display - Only Table View */}
      <div className="space-y-3">
        {currentProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>

      {/* Pagination - EXACT MOCKUP STYLE */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">
              {startIndex + 1}-{Math.min(startIndex + itemsPerPage, safeProducts.length)}
            </span> of <span className="font-medium text-gray-700">{safeProducts.length}</span> products
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center border rounded-lg ${
                  currentPage === page
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}