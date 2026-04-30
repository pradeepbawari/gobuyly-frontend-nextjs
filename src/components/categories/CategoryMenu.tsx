'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faListUl,
  faChevronRight,
  faCircle,
  faTimes,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'

/* ---------------- HELPERS ---------------- */

const toSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/* ---------------- TYPES ---------------- */

interface CategoryMenuProps {
  onSubcategorySelect?: (subcategoryId: number, slugPath: string[]) => void
  initialCategory?: any
  isMobileMenuOpen?: boolean
  onMobileClose?: () => void
}

interface Subcategory {
  id: number
  name: string
  subcategories: Subcategory[]
}

interface Category {
  id: number
  name: string
  subcategories: Subcategory[]
}

interface SubcategoryItemProps {
  subcategory: Subcategory
  level: number
  parentSlugs: string[]
  onSelect: (id: number, slugPath: string[]) => void
  isMobile?: boolean
}

/* ---------------- SUBCATEGORY ITEM ---------------- */

function SubcategoryItem({
  subcategory,
  level,
  parentSlugs,
  onSelect,
  isMobile = false,
}: SubcategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren =
    subcategory.subcategories && subcategory.subcategories.length > 0

  const handleClick = () => {
    const currentSlug = toSlug(subcategory.name)
    const slugPath = [...parentSlugs, currentSlug]

    if (hasChildren) {
      setIsExpanded(!isExpanded)
    } else {
      onSelect(subcategory.id, slugPath)
    }
  }

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        className="p-2 pl-3 hover:bg-emerald-50 cursor-pointer flex items-center justify-between rounded-lg transition-colors"
        style={{ 
          marginLeft: isMobile ? 0 : level * 16,
          paddingLeft: isMobile ? '1rem' : `${level * 16 + 12}px`
        }}
      >
        <div className="flex items-center gap-2.5">
          <FontAwesomeIcon 
            icon={faCircle} 
            className="text-emerald-500 text-[10px] flex-shrink-0" 
          />
          <span className={`${isMobile ? 'text-base' : 'text-[1rem]'} text-gray-700 font-normal`}>
            {subcategory.name}
          </span>
        </div>

        {hasChildren && (
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`text-xs text-gray-400 transition-transform flex-shrink-0 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {subcategory.subcategories.map((child) => (
            <SubcategoryItem
              key={child.id}
              subcategory={child}
              level={level + 1}
              parentSlugs={[...parentSlugs, toSlug(subcategory.name)]}
              onSelect={onSelect}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------------- CATEGORY MENU ---------------- */

export default function CategoryMenu({
  onSubcategorySelect,
  initialCategory,
  isMobileMenuOpen = false,
  onMobileClose,
}: CategoryMenuProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)

  useEffect(() => {
    if (initialCategory?.length) {
      setCategories(initialCategory)
      if (initialCategory[0]?.id) {
      setExpandedCategory(initialCategory[0].id)
    }
    }
  }, [initialCategory])

  const handleSubcategoryClick = (
    subcategoryId: number,
    slugPath: string[]
  ) => {
    onSubcategorySelect?.(subcategoryId, slugPath)
  }

  const toggleCategory = (categoryId: number) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden lg:block w-full h-full border-r border-gray-200">
        <div className="sticky top-0 max-h-screen overflow-y-auto py-6">
          <div className="px-0 pb-4 border-b border-gray-200">
            <h3 className="font-bold text-[1rem] text-gray-800 mb-0 flex items-center gap-2.5">
              <FontAwesomeIcon icon={faListUl} className="text-emerald-600" />
              All Categories
            </h3>
          </div>

          <div className="px-0 py-2">
            {categories.map((category) => (
              <div key={category.id} className="mb-1">
                <div 
                  className="font-semibold text-gray-800 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`text-xs text-gray-400 transition-transform ${
                      expandedCategory === category.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>

                {expandedCategory === category.id && (
                  <div className="ml-2 pl-2 border-l border-gray-100">
                    {category.subcategories.map((subcategory) => (
                      <SubcategoryItem
                        key={subcategory.id}
                        subcategory={subcategory}
                        level={0}
                        parentSlugs={[toSlug(category.name)]}
                        onSelect={handleSubcategoryClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onMobileClose}
          />
          
          {/* Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 lg:hidden shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faFilter} className="text-emerald-600 text-lg" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Categories</h3>
                    <p className="text-sm text-gray-500">Select a category</p>
                  </div>
                </div>
                <button
                  onClick={onMobileClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Categories List */}
            <div className="overflow-y-auto h-[calc(100vh-80px)] p-4">
              {categories.map((category) => (
                <div key={category.id} className="mb-4">
                  <div className="font-bold text-gray-800 text-base py-3 border-b border-gray-100">
                    {category.name}
                  </div>

                  <div className="mt-2">
                    {category.subcategories.map((subcategory) => (
                      <SubcategoryItem
                        key={subcategory.id}
                        subcategory={subcategory}
                        level={0}
                        parentSlugs={[toSlug(category.name)]}
                        onSelect={handleSubcategoryClick}
                        isMobile={true}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {categories.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📁</div>
                  <p className="text-gray-500">No categories available</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={onMobileClose}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Close Menu
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}