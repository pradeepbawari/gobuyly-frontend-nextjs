'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faListUl, 
  faChevronRight, 
  faCircle,
  faFolder,
  faFolderOpen,
  faAngleRight
} from '@fortawesome/free-solid-svg-icons'
import { getCategories } from '@/lib/api'
import Image from 'next/image'

interface CategoryMenuProps {
  onCategorySelect?: (categoryId: number | null, categoryName?: string) => void
  onSubcategorySelect?: (subcategoryId: number, subcategoryName: string) => void
}

interface Subcategory {
  id: number
  name: string
  category_id: number
  parent_id: number | null
  icon: string
  subcategories: Subcategory[]
}

interface Category {
  id: number
  name: string
  subcategories: Subcategory[]
}

// Recursive Subcategory Component
interface SubcategoryItemProps {
  subcategory: Subcategory
  level: number
  activeCategory: number | null
  onSelect: (id: number, name: string) => void
}

function SubcategoryItem({ subcategory, level, activeCategory, onSelect }: SubcategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = subcategory.subcategories && subcategory.subcategories.length > 0

  // Calculate text size based on level
  const getTextSize = (level: number) => {
    if (level === 0) return 'text-[15px]'          // First level subcategory
    if (level === 1) return 'text-[14px]'          // Second level subcategory
    return 'text-xs font-light'                // Third+ level subcategory (smaller and lighter)
  }

  // Calculate padding based on level
  const getPadding = (level: number) => {
    if (level === 0) return 'p-2'
    if (level === 1) return 'p-1.5 pl-6'
    return 'p-1'
  }

  // Calculate icon size based on level
  const getIconSize = (level: number) => {
    if (level === 0) return 'text-xs'
    if (level === 1) return 'text-[10px]'
    return 'text-[9px]'
  }

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    } else {
      onSelect(subcategory.id, subcategory.name)
    }
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <div
        onClick={handleClick}
        className={`${getPadding(level)} hover:bg-emerald-50 cursor-pointer transition-all border border-transparent hover:border-emerald-100 flex items-center justify-between group`}
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div className="flex items-center gap-3">
          {subcategory.icon ? (
            <div className={`${level === 0 ? 'w-6 h-6' : level === 1 ? 'w-5 h-5' : 'w-4 h-4'} rounded-md overflow-hidden bg-gray-100 flex items-center justify-center`}>
              <FontAwesomeIcon 
              icon={hasChildren ? (isExpanded ? faCircle : faCircle) : faCircle} 
              className={`${getIconSize(level)} ${
                hasChildren ? 'text-emerald-500' : 'text-emerald-400'
              }`} 
            />
            </div>
          ) : (
            <FontAwesomeIcon 
              icon={hasChildren ? (isExpanded ? faCircle : faCircle) : faCircle} 
              className={`${getIconSize(level)} ${
                hasChildren ? 'text-emerald-500' : 'text-emerald-400'
              }`} 
            />
          )}
          <span className={`${getTextSize(level)} text-gray-700`}>
            {subcategory.name}
          </span>
        </div>
        {hasChildren && (
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`text-gray-400 ${getIconSize(level)} transition-transform duration-300 ${
              isExpanded ? 'rotate-90 text-emerald-600' : ''
            }`}
          />
        )}
      </div>

      {hasChildren && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {subcategory.subcategories.map((child) => (
            <SubcategoryItem
              key={child.id}
              subcategory={child}
              level={level + 1}
              activeCategory={activeCategory}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CategoryMenu({ onCategorySelect, onSubcategorySelect }: CategoryMenuProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (categoryId: number, categoryName?: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null)
      setExpandedCategories(prev => prev.filter(id => id !== categoryId))
      if (onCategorySelect) onCategorySelect(null)
    } else {
      setActiveCategory(categoryId)
      setExpandedCategories(prev => [...prev, categoryId])
      if (onCategorySelect) onCategorySelect(categoryId, categoryName)
    }
  }

  const handleSubcategoryClick = (subcategoryId: number, subcategoryName: string) => {
    console.log(`Subcategory clicked: ${subcategoryName} (ID: ${subcategoryId})`)
    if (onSubcategorySelect) {
      onSubcategorySelect(subcategoryId, subcategoryName)
    }
  }

  if (loading) {
    return (
      <div className="w-72 bg-white shadow-sm p-6 border border-gray-100 rounded-xl">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 bg-white shadow-sm p-6 border border-gray-100 rounded-xl">
      <h3 className="font-bold text-lg mb-6 text-gray-800 flex items-center gap-2">
        <FontAwesomeIcon icon={faListUl} className="text-emerald-500" /> 
        All Categories
      </h3>

      <div className="space-y-1">
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id)
          const hasSubcategories = category.subcategories && category.subcategories.length > 0

          return (
            <div key={category.id} className="rounded-lg overflow-hidden">
              <div
                onClick={() => handleCategoryClick(category.id, category.name)}
                className="p-3 hover:bg-emerald-50 cursor-pointer transition-all border border-transparent hover:border-emerald-100 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <span className="text-sm uppercase font-medium">{category.name.charAt(0)}</span>
                  </div>
                  <span className="font-medium text-gray-700 text-base">{category.name}</span>
                </div>
                {hasSubcategories && (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`text-gray-400 group-hover:text-emerald-500 text-sm transition-transform duration-300 ${
                      isExpanded ? 'rotate-90 text-emerald-600' : ''
                    }`}
                  />
                )}
              </div>

              {hasSubcategories && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="ml-8 pl-3 border-l-2 border-emerald-100">
                    {category.subcategories.map((subcategory) => (
                      <SubcategoryItem
                        key={subcategory.id}
                        subcategory={subcategory}
                        level={0}
                        activeCategory={activeCategory}
                        onSelect={handleSubcategoryClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {categories.length === 0 && !loading && (
        <div className="text-center py-4 text-gray-500">
          No categories found
        </div>
      )}
    </div>
  )
}