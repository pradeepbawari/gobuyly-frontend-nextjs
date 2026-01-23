'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faArrowRight, faSearch, faTimes, faFilter } from '@fortawesome/free-solid-svg-icons'

interface SearchFilterProps {
  onSearch: (filters: { searchQuery: string; selectedBrand: string, clear:boolean }) => void
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
  const [clear, setClear] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Load brands from API or use default
  useEffect(() => {
    setBrands(initialBrandData)
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
  e?.preventDefault()
  setIsMobileFiltersOpen(false)
  onSearch({
    searchQuery,
    selectedBrand,
    clear: false, // searching, not clearing
  })
}

const handleBrandChange = (brandId: string) => {
  setSelectedBrand(brandId)
  onSearch({
    searchQuery,
    selectedBrand: brandId,
    clear: false,
  })
}

const handleClearFilters = () => {
  setSearchQuery('')
  setSelectedBrand('')
  setIsMobileFiltersOpen(false)
  onSearch({
    searchQuery: '',
    selectedBrand: '',
    clear: true, // indicate clear action to parent
  })
}

// Mobile search uses same logic as handleSearch
const handleMobileSearch = () => {
  handleSearch()
}


  return (
    <div className="bg-white pt-3 pb-3">
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden mb-3">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 w-full justify-center"
        >
          <FontAwesomeIcon icon={faFilter} className="text-sm" />
          {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          {(searchQuery || selectedBrand) && (
            <span className="ml-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
              {[searchQuery, selectedBrand].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Brand Filter */}
        <div className="flex-1 md:flex-initial w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-500 mb-2">Filter by Brand</label>
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full md:w-48 border border-gray-300 rounded-lg pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
            >
              <option value=''>All Brands</option>
              {brands.map((brand) => (
                <option key={brand.company_id} value={brand.company_id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
              <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-500 mb-2">Search Products</label>
          <div className="relative">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, category, or brand..."
                className="w-full border border-gray-300 rounded-lg pl-12 pr-24 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 bg-emerald-500 text-white py-3 px-6 rounded-r-lg hover:bg-emerald-600 transition-colors"
              >
                <span className="hidden md:inline mr-2">Search</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
              </button>
            </form>
            <span className="absolute left-4 top-3.5 text-gray-400">
              <FontAwesomeIcon icon={faSearch} className="text-sm" />
            </span>
            
            {/* Clear button when filters are active */}
            {(searchQuery || (selectedBrand && selectedBrand !== '')) && (
              <button
                onClick={handleClearFilters}
                className="absolute right-28 top-0 text-gray-500 hover:text-gray-700 p-3"
                title="Clear filters"
              >
                <FontAwesomeIcon icon={faTimes} className="text-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Panel */}
      {isMobileFiltersOpen && (
        <div className="md:hidden bg-white border border-gray-200 rounded-lg p-4 mt-2 shadow-sm">
          {/* Brand Filter - Mobile */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500 mb-2">Filter by Brand</label>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
              >
                <option value=''>All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.company_id} value={brand.company_id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
              </div>
            </div>
          </div>

          {/* Search Input - Mobile */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500 mb-2">Search Products</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <span className="absolute left-3 top-3.5 text-gray-400">
                <FontAwesomeIcon icon={faSearch} className="text-sm" />
              </span>
            </div>
          </div>

          {/* Action Buttons - Mobile */}
          <div className="flex gap-3">
            <button
              onClick={handleMobileSearch}
              className="flex-1 bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faSearch} className="text-sm" />
              Search
            </button>
            {(searchQuery || (selectedBrand && selectedBrand !== '')) && (
              <button
                onClick={handleClearFilters}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faTimes} className="text-sm" />
                Clear
              </button>
            )}
          </div>

          {/* Active Filters - Mobile */}
          {(searchQuery || (selectedBrand && selectedBrand !== '')) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">
                    Search: "{searchQuery}"
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                  </span>
                )}
                {selectedBrand && selectedBrand !== '' && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    Brand: {brands.find(b => b.company_id === selectedBrand)?.name || selectedBrand}
                    <button 
                      onClick={() => setSelectedBrand('')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary (Always visible on mobile) */}
      <div className="md:hidden mt-3">
        {(searchQuery || (selectedBrand && selectedBrand !== '')) && (
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="text-xs bg-white border px-2 py-1 rounded">
                  Search: {searchQuery.length > 10 ? `${searchQuery.substring(0, 10)}...` : searchQuery}
                </span>
              )}
              {selectedBrand && selectedBrand !== '' && (
                <span className="text-xs bg-white border px-2 py-1 rounded">
                  Brand: {brands.find(b => b.company_id === selectedBrand)?.name || 'Selected'}
                </span>
              )}
            </div>
            <button
              onClick={handleClearFilters}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  )
}