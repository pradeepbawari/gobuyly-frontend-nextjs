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
              category_id: categoryId,
            },
            page,
            limit,
          })
        }

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
    router.push(`/${slugPath.join('/')}`)
  }

  /* ---------- RENDER ---------- */

  return (
    <div className="flex">
      {/* -------- LEFT CATEGORY MENU -------- */}

      <CategoryMenu
        initialCategory={initialCategories}
        onSubcategorySelect={(_, slugPath) =>
          handleCategoryNavigate(slugPath)
        }
      />

      {/* -------- RIGHT PRODUCT PANEL -------- */}

      <div className="flex-1 p-4">
        <SearchFilter
          onSearch={handleSearch}
          initialBrand=""
          initialSearch=""
          initialBrandData={initialBrands}
        />

        <div className="relative min-h-[500px]">
          {loading && <ProductPanelLoader />}

          <ProductGrid
            products={products}
            loading={false}
            page={page}
            total={total}
            limit={limit}
            onPageChange={(p) => {
              setLoading(true)
              setPage(p)
            }}
          />
        </div>
      </div>
    </div>
  )
}


// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import CategoryMenu from '@/components/categories/CategoryMenu'
// import ProductGrid from '@/components/products/ProductGrid'
// import SearchFilter from '@/components/ui/SearchFilter'
// import { getProducts, getsearchProducts, transformProduct } from '@/lib/api'
// import { findCategoryBySlugPath } from '@/lib/slug'

// export default function ProductListingPage({
//   categorySlugPath,
//   initialCategories = [],
//   initialBrands = [],
// }: {
//   categorySlugPath?: string
//   initialCategories?: any[]
//   initialBrands?: any[]
// }) {
//   const router = useRouter()

//   const [categories] = useState<any[]>(initialCategories)
//   const [brands] = useState<any[]>(initialBrands)
//   const [products, setProducts] = useState<any[]>([])
//   const [loading, setLoading] = useState(false)
//   const [filters, setFilters] = useState<{
//     searchQuery: string
//     selectedBrand: string
//   }>({
//     searchQuery: '',
//     selectedBrand: '',
//   })

//   /* Fetch products only */
//   useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       setLoading(true)

//       const hasSearch =
//         !!filters.searchQuery || !!filters.selectedBrand

//       // CATEGORY (shared)
//       let categoryId: number | undefined
//       if (categorySlugPath) {
//         const slugs = categorySlugPath.split('/')
//         const category = findCategoryBySlugPath(categories, slugs)
//         categoryId = category?.id
//       }

//       let response

//       if (hasSearch) {
//         response = await getsearchProducts({
//           searchTerm: filters.searchQuery,
//           searchBrandTerm: filters.selectedBrand,
//         })
//       } else {
//         response = await getProducts({
//           category_id: categoryId,
//         })
//       }

//       const mapped =
//         response?.variants?.rows?.map(transformProduct) || []

//       setProducts(mapped)
//     } finally {
//       setLoading(false)
//     }
//   }

//   fetchProducts()
// }, [categorySlugPath, filters])



//   const handleSubcategorySelect = (_id: number, slugPath: string[]) => {
//     router.push(`/${slugPath.join('/')}`)
//   }

//   const handleSearch = ({
//     searchQuery,
//     selectedBrand,
//     clear,
//   }: {
//     searchQuery: string
//     selectedBrand: string
//     clear: boolean
//   }) => {
//     setFilters({
//       searchQuery: clear ? '' : searchQuery,
//       selectedBrand: clear ? '' : selectedBrand,
//     })
//   }


//   return (
//     <div className="flex min-h-[calc(100vh-140px)]">
//       <CategoryMenu
//         initialCategory={categories}
//         onSubcategorySelect={handleSubcategorySelect}
//       />


//       <div className="flex-1 p-4">
//         {brands.length > 0 && (
//           <SearchFilter
//             onSearch={handleSearch}
//             initialBrand=""
//             initialSearch=""
//             initialBrandData={brands}
//           />

//         )}

//         <ProductGrid products={products} loading={loading} />
//       </div>
//     </div>
//   )
// }
