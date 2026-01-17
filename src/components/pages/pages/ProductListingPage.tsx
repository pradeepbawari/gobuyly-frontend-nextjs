'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CategoryMenu from '@/components/categories/CategoryMenu'
import ProductGrid from '@/components/products/ProductGrid'
import SearchFilter from '@/components/ui/SearchFilter'
import { getProducts, getsearchProducts, transformProduct } from '@/lib/api'
import { findCategoryBySlugPath } from '@/lib/slug'
import ProductPanelLoader from '@/components/products/ProductPanelLoader'

export default function ProductListingPage({
  categorySlugPath,
  initialCategories = [],
  initialBrands = [],
}: {
  categorySlugPath?: string
  initialCategories?: any[]
  initialBrands?: any[]
}) {
  const router = useRouter()

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const limit = 15

  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedBrand: '',
  })

  /* Reset page on filter or category change */
  useEffect(() => {
    setPage(1)
  }, [filters, categorySlugPath])

  /* Fetch products */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        let categoryId: number | undefined

        if (categorySlugPath) {
          const slugs = categorySlugPath.split('/')
          const category = findCategoryBySlugPath(initialCategories, slugs)
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
            category_id: categoryId,
            page,
            limit,
          })
        }

        setProducts(
          response?.variants?.rows?.map(transformProduct) || []
        )
        setTotal(response?.variants?.count || 0)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categorySlugPath, filters, page])

  const handleSearch = ({
    searchQuery,
    selectedBrand,
    clear,
  }: any) => {
    setFilters({
      searchQuery: clear ? '' : searchQuery,
      selectedBrand: clear ? '' : selectedBrand,
    })
  }

  return (
    <div className="flex">
      <CategoryMenu
        initialCategory={initialCategories}
        onSubcategorySelect={(_, slugPath) =>
          router.push(`/${slugPath.join('/')}`)
        }
      />

      <div className="flex-1 p-4">
        <SearchFilter
          onSearch={handleSearch}
          initialBrand=""
          initialSearch=""
          initialBrandData={initialBrands}
        />

        {/* <ProductGrid
          products={products}
          loading={loading}
          page={page}
          total={total}
          limit={limit}
          onPageChange={setPage}
        /> */}
        <div className="relative min-h-[500px]">
  {loading && <ProductPanelLoader />}

  <ProductGrid
    products={products}
    loading={false}
    page={page}
    total={total}
    limit={limit}
    onPageChange={setPage}
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
