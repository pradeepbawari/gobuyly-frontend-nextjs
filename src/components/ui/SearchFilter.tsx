'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faArrowRight, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { brandList } from '@/lib/api'

interface SearchFilterProps {
  onSearch: (filters: { searchQuery: string; selectedBrand: string }) => void
  initialBrand?: string
  initialSearch?: string
  initialBrandData?: any
}

interface Brand {
  company_id: string
  name: string
}

export default function SearchFilter({ 
  onSearch, 
  initialBrand = '', 
  initialSearch = '',
  initialBrandData = ''
}: SearchFilterProps) {
const [searchQuery, setSearchQuery] = useState(initialSearch)
const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand)
const [brands, setBrands] = useState<Brand[]>([])

  // Load brands from API or use default
  useEffect(() => {
    setBrands(initialBrandData)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault()
  onSearch({
    searchQuery,
    selectedBrand, // ← brand ID
  })
}

const handleBrandChange = (brandId: string) => {
  setSelectedBrand(brandId)
  onSearch({
    searchQuery,
    selectedBrand: brandId,
  })
}

const handleClearFilters = () => {
  setSearchQuery('')
  setSelectedBrand('')
  onSearch({
    searchQuery: '',
    selectedBrand: '',
  })
}


  return (
    <div className="bg-white pt-5 pb-3">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Brand Filter */}
        <div className="flex-1 md:flex-initial">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Brand</label>
          <div className="relative border-1 rounded-lg border-gray-300">
            <select
  value={selectedBrand}
  onChange={(e) => handleBrandChange(e.target.value)}
  className="w-full md:w-48 border-gray-300 rounded-xl pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
>
    <option id='' value=''>
      {'All Brands'}
    </option>
    {brands.map((brand) => (
    <option key={brand.company_id} value={brand.company_id}>
      {brand.name}
    </option>
  ))}
</select>

            <div className="absolute right-3 top-2 text-gray-400 pointer-events-none">
              <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
          <div className="relative">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, category, or brand..."
                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button type="submit" className="absolute right-0 top-0 bg-emerald-500 text-white py-2.5 px-5 rounded-r-lg hover:bg-emerald-600 transition-colors">
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
              </button>
            </form>
            <span className="absolute left-4 top-2 text-gray-400">
              <FontAwesomeIcon icon={faSearch} className="text-sm" />
            </span>
            
            {/* Clear button when filters are active */}
            {(searchQuery || (selectedBrand && selectedBrand !== 'All Brands')) && (
              <button
                onClick={handleClearFilters}
                className="absolute right-14 top-0 text-gray-500 hover:text-gray-700 p-2"
                title="Clear filters"
              >
                <FontAwesomeIcon icon={faTimes} className="text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}