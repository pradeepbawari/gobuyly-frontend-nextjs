'use client'

import ProductCard from './ProductCard'

interface Props {
  products: any[]
  loading: boolean
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export default function ProductGrid({
  products,
  loading,
  page,
  total,
  limit,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div className="text-gray-400 text-5xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
          {/* Results count */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{start}-{end}</span> of{' '}
            <span className="font-semibold">{total}</span> products
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Mobile: Simple prev/next */}
            <div className="sm:hidden flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-gray-50 active:bg-gray-100"
              >
                ← Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-gray-50 active:bg-gray-100"
              >
                Next →
              </button>
            </div>

            {/* Desktop: Full pagination */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Previous button */}
              <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-gray-50 active:bg-gray-100"
                aria-label="Previous page"
              >
                ←
              </button>

              {/* First page */}
              {page > 3 && (
                <>
                  <button
                    onClick={() => onPageChange(1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium
                             hover:bg-gray-50 active:bg-gray-100"
                  >
                    1
                  </button>
                  {page > 4 && <span className="px-2 text-gray-400">...</span>}
                </>
              )}

              {/* Page numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1
                // Show 3 pages around current page
                if (pageNum >= page - 1 && pageNum <= page + 1) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium
                                ${pageNum === page
                                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                  : 'hover:bg-gray-50 active:bg-gray-100'
                                }`}
                    >
                      {pageNum}
                    </button>
                  )
                }
                return null
              }).filter(Boolean)}

              {/* Last page */}
              {page < totalPages - 2 && (
                <>
                  {page < totalPages - 3 && <span className="px-2 text-gray-400">...</span>}
                  <button
                    onClick={() => onPageChange(totalPages)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium
                             hover:bg-gray-50 active:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              {/* Next button */}
              <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-gray-50 active:bg-gray-100"
                aria-label="Next page"
              >
                →
              </button>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-500">
              Page <span className="font-semibold">{page}</span> of{' '}
              <span className="font-semibold">{totalPages}</span>
            </div>
          </div>

          {/* Items per page info */}
          <div className="text-xs text-gray-500 hidden sm:block">
            {limit} items per page
          </div>
        </div>
      )}
    </>
  )
}