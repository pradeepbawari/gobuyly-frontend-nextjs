'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faListUl,
  faChevronRight,
  faCircle,
} from '@fortawesome/free-solid-svg-icons'

/* ---------------- HELPERS ---------------- */

const toSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/* ---------------- TYPES ---------------- */

interface CategoryMenuProps {
  onSubcategorySelect?: (subcategoryId: number, slugPath: string[]) => void
  initialCategory?: any
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
}

/* ---------------- SUBCATEGORY ITEM ---------------- */

function SubcategoryItem({
  subcategory,
  level,
  parentSlugs,
  onSelect,
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
    <div>
      <div
        onClick={handleClick}
        className="p-1.5 pl-4 hover:bg-emerald-50 cursor-pointer flex items-center justify-between"
        style={{ marginLeft: level * 16 }}
      >
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCircle} className="text-emerald-500 text-xs" />
          <span className="text-sm text-gray-700">
            {subcategory.name}
          </span>
        </div>

        {hasChildren && (
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`text-xs transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        )}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {subcategory.subcategories.map((child) => (
            <SubcategoryItem
              key={child.id}
              subcategory={child}
              level={level + 1}
              parentSlugs={[...parentSlugs, toSlug(subcategory.name)]}
              onSelect={onSelect}
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
}: CategoryMenuProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (initialCategory?.length) {
      setCategories(initialCategory)
    }
  }, [initialCategory])

  const handleSubcategoryClick = (
    subcategoryId: number,
    slugPath: string[]
  ) => {
    onSubcategorySelect?.(subcategoryId, slugPath)
  }

  return (
    <div className="w-72 bg-white p-6 border-r border-gray-200">
      <h3 className="font-bold mb-3 flex items-center gap-2">
        <FontAwesomeIcon icon={faListUl} />
        All Categories
      </h3>

      {categories.map((category) => (
        <div key={category.id}>
          <div className="font-medium text-gray-800 py-2">
            {category.name}
          </div>

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
      ))}
    </div>
  )
}
