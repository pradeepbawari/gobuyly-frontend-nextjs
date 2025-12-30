'use client'

import { useState, useEffect, useCallback } from 'react'
import CategoryMenu from '@/components/categories/CategoryMenu'
import ProductGrid from '@/components/products/ProductGrid'
import SearchFilter from '@/components/ui/SearchFilter'
import { getCategories, getProducts, transformProduct } from '@/lib/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCutlery } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [allProducts, setAllProducts] = useState([]) // Store all products
  const [filteredProducts, setFilteredProducts] = useState([]) // Display filtered products
  const [loading, setLoading] = useState(true)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [searchFilters, setSearchFilters] = useState({
    searchQuery: '',
    selectedBrand: ''
  })
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchFilters.searchQuery)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchFilters.searchQuery])

  // Apply filters when any filter changes
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters()
    }
  }, [selectedSubcategory, debouncedSearch, searchFilters.selectedBrand, allProducts])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts() // Fetch all products initially
      ])
      
      setCategories(categoriesData?.categories || [])
      const products = productsData?.variants?.rows?.map(transformProduct) || []
      setAllProducts(products)
      setFilteredProducts(products)
    } catch (error) {
      console.error('Failed to fetch initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (filters: { searchQuery: string; selectedBrand: string }) => {
    console.log('Search filters changed:', filters)
    setSearchFilters(filters)
    
    // If both filters are empty, fetch all products from API
    if (!filters.searchQuery && !filters.selectedBrand) {
      try {
        setLoading(true)
        const productsData = await getProducts()
        const products = productsData?.variants?.rows?.map(transformProduct) || []
        setAllProducts(products)
        setFilteredProducts(products)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubcategorySelect = async (subcategoryId: any, subcategoryName:any) => {
    console.log('Subcategory selected:', subcategoryId)
    //setSelectedSubcategory(subcategoryId)
	setSelectedSubcategory(subcategoryName)
    
    try {
      setLoading(true)
      // Fetch products for this subcategory
      const productsData = await getProducts({
        id: subcategoryId // Adjust based on your API
      })
      
      const products = productsData?.variants?.rows?.map(transformProduct) || []
      setAllProducts(products)
      setFilteredProducts(products)
      
      // Clear search filters when subcategory is selected
      setSearchFilters({
        searchQuery: '',
        selectedBrand: ''
      })
    } catch (error) {
      console.error('Failed to fetch subcategory products:', error)
      setFilteredProducts([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...allProducts]

    // Apply search query filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase()
      filtered = filtered.filter(product => 
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.sku && product.sku.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.brand && product.brand.toLowerCase().includes(query))
      )
    }

    // Apply brand filter
    if (searchFilters.selectedBrand && searchFilters.selectedBrand !== 'All Brands') {
      filtered = filtered.filter(product => 
        product.brand && product.brand.toLowerCase() === searchFilters.selectedBrand.toLowerCase()
      )
    }

    console.log(`Filtered ${allProducts.length} products to ${filtered.length} products`)
    setFilteredProducts(filtered)
  }

  const handleClearAllFilters = () => {
    setSelectedSubcategory(null)
    setSearchFilters({
      searchQuery: '',
      selectedBrand: ''
    })
    // Fetch all products again
    loadInitialData()
  }
  
  const handleCategory = () => {
  
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Sidebar */}
          <div>
            <CategoryMenu 
              onSubcategorySelect={handleSubcategorySelect} onCategorySelect={handleCategory}
            />
          </div>
          
          {/* Main Content */}
          <div className="w-full">
            {/* Search & Filters */}
            <SearchFilter 
              onSearch={handleSearch}
              initialBrand={searchFilters.selectedBrand}
              initialSearch={searchFilters.searchQuery}
            />

            {/* Products Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 gap-2 flex">
                  <FontAwesomeIcon icon={faCutlery} className="text-green-600" />
                  {selectedSubcategory ? selectedSubcategory : 'All Products'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedSubcategory 
                    ? 'Showing products from selected category' 
                    : 'Browse our premium collection'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Clear All Filters button */}
                {(selectedSubcategory || searchFilters.searchQuery || searchFilters.selectedBrand) && (
                  <button
                    onClick={handleClearAllFilters}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                  >
                    <i className="fas fa-times"></i> Clear All
                  </button>
                )}
                
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{filteredProducts.length}</span> products
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={filteredProducts} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}