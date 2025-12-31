'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListUl, faChevronRight, faCircle } from '@fortawesome/free-solid-svg-icons'
import { getCategories } from '@/lib/api'

interface CategoryMenuProps {
  onCategorySelect?: (categoryId: number | null) => void
  onSubcategorySelect?: (subcategoryId: number, subcategoryName: string) => void
}

interface Category {
  id: number
  name: string
  subcategories?: Subcategory[]
}

interface Subcategory {
  id: number
  name: string
}

export default function CategoryMenu({ onCategorySelect, onSubcategorySelect }: CategoryMenuProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
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

  const handleCategoryClick = (categoryId: number) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null)
      if (onCategorySelect) onCategorySelect(null)
    } else {
      setActiveCategory(categoryId)
      if (onCategorySelect) onCategorySelect(categoryId)
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
      <div className="w-64 bg-white shadow-sm p-6 border border-gray-100 rounded-xl">
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
        <FontAwesomeIcon icon={faListUl} className="text-emerald-500" /> Categories
      </h3>

      <div className="space-y-1">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg overflow-hidden">
            <div
              onClick={() => handleCategoryClick(category.id)}
              className="p-3 hover:bg-emerald-50 cursor-pointer transition-all border border-transparent hover:border-emerald-100 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <span className="text-sm uppercase font-medium">{category.name.charAt(0)}</span>
                </div>
                <span className="font-medium text-gray-700">{category.name}</span>
              </div>
              <FontAwesomeIcon
                icon={faChevronRight}
                className={`text-gray-400 group-hover:text-emerald-500 text-sm transition-transform duration-300 ${
                  activeCategory === category.id ? 'rotate-90 text-emerald-600' : ''
                }`}
              />
            </div>

            {category.subcategories && category.subcategories.length > 0 && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeCategory === category.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="ml-8 pl-1 border-l-2 border-emerald-100">
                  {category.subcategories.map((child) => (
                    <div
                      key={child.id}
                      onClick={() => handleSubcategoryClick(child.id, child.name)}
                      className="p-2 pl-2 text-sm rounded-lg hover:bg-emerald-50 cursor-pointer flex items-center gap-2 transition-colors"
                    >
                      <FontAwesomeIcon icon={faCircle} className="text-xs text-emerald-400" />
                      <span className="text-gray-700">{child.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}