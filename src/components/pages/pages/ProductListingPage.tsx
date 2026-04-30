'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import CategoryMenu from '@/components/categories/CategoryMenu'
import ProductGrid from '@/components/products/ProductGrid'
import SearchFilter from '@/components/ui/SearchFilter'
import ProductPanelLoader from '@/components/products/ProductPanelLoader'

import {
  getProducts,
  getsearchProducts,
  transformProduct,
} from '@/lib/api'

import { findCategoryBySlugPath } from '@/lib/slug'

/* ===================== TYPES ===================== */

interface ProductListingPageProps {
  categorySlugPath?: string
  initialCategories?: any[]
  initialBrands?: any[]
}

/* ===================== COMPONENT ===================== */

export default function ProductListingPage({
  categorySlugPath,
  initialCategories = [],
  initialBrands = [],
}: ProductListingPageProps) {
  const router = useRouter()

  /* ---------- STATE ---------- */

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [searchEmpty, setSearchEmpty] = useState<boolean>(false)

  const limit = 15

  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedBrand: '',
  })

  /* ---------- RESET PAGE ON CHANGE ---------- */

  useEffect(() => {
    setPage(1)
  }, [filters, categorySlugPath])

  /* ---------- FETCH PRODUCTS ---------- */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let categoryId: number | undefined

        if (categorySlugPath) {
          const slugs = categorySlugPath.split('/')
          const category = findCategoryBySlugPath(
            initialCategories,
            slugs
          )
          categoryId = category?.id
        }

        const hasSearch =
          filters.searchQuery || filters.selectedBrand

        let response

        if (hasSearch) {
          response = await getsearchProducts({
            searchTerm: filters.searchQuery,
            searchBrandTerm: filters.selectedBrand,
            page,
            limit,
          })
        } else {
          response = await getProducts({
            filters: {
              subcategory_id: categoryId,
            },
            page,
            limit,
          })
          setSearchEmpty(false)
        }
        setSearchEmpty(response.searchEmpty)
        setProducts(
          response?.variants?.rows?.map(transformProduct) || []
        )

        setTotal(response?.variants?.count || 0)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false) // ✅ stop loader ONLY after data arrives
      }
    }

    fetchProducts()
  }, [categorySlugPath, filters, page])

  /* ---------- HANDLERS ---------- */

  const handleSearch = ({
    searchQuery,
    selectedBrand,
    clear,
  }: any) => {
    setLoading(true)
    setFilters({
      searchQuery: clear ? '' : searchQuery,
      selectedBrand: clear ? '' : selectedBrand,
    })
  }

  const handleCategoryNavigate = (slugPath: string[]) => {
    setLoading(true) // 🔥 loader starts immediately
    setIsCategoryMenuOpen(false)
    router.push(`/${slugPath.join('/')}`)
  }

  /* ---------- RENDER ---------- */

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile Category Menu Toggle */}
      <div className="lg:hidden border-b border-gray-200 bg-white">
        <button
          onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-gray-700 font-medium"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Categories
          </span>
          <svg 
            className={`w-5 h-5 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* -------- LEFT CATEGORY MENU -------- */}
      <div className={`${isCategoryMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
        <CategoryMenu
          initialCategory={initialCategories}
          onSubcategorySelect={(_, slugPath) =>
            handleCategoryNavigate(slugPath)
          }
          isMobileMenuOpen={isCategoryMenuOpen}
          onMobileClose={() => setIsCategoryMenuOpen(false)}
        />
      </div>

      {/* -------- RIGHT PRODUCT PANEL -------- */}
      <div className="flex-1 p-3 sm:p-4 lg:p-6">
        {/* Current Category Info - Mobile */}
        {categorySlugPath && (
          <div className="lg:hidden mb-4 px-3 py-2 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Current Category:</p>
            <p className="font-medium text-gray-800 capitalize">
              {categorySlugPath.split('/').pop()?.replace(/-/g, ' ')}
            </p>
          </div>
        )}
        
        <SearchFilter
          onSearch={handleSearch}
          initialBrand=""
          initialSearch=""
          initialBrandData={initialBrands}
        />

        {/* Results Summary */}
        {!loading && (
          <div className="mb-4 px-2 sm:px-0">
            {searchEmpty && (<div className='p-2 pl-0 w-full text-gray-900'>No product match - {filters.searchQuery}</div>)}
            <p className="text-sm text-gray-600">
              Found <span className="font-semibold text-emerald-600">{total}</span> products
              {filters.searchQuery && !searchEmpty && (
                <> for "<span className="font-medium">{filters.searchQuery}</span>"</>
              )}
              {filters.selectedBrand && (
                <> from brand ID: <span className="font-medium">{filters.selectedBrand}</span></>
              )}
            </p>
          </div>
        )}

        <div className="relative min-h-[300px] sm:min-h-[400px] bg-white">
          {loading && <ProductPanelLoader />}

          {!loading && products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <ProductGrid
              products={products}
              loading={false}
              page={page}
              total={total}
              limit={limit}
              onPageChange={(p) => {
                setLoading(true)
                setPage(p)
                // Scroll to top on page change (mobile optimization)
                if (window.innerWidth < 768) {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}