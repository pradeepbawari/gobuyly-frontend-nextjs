import { cache } from 'react'
import { getCategories, brandList } from '@/lib/api'

export const getCachedCategories = cache(async () => {
  return getCategories()
})

export const getCachedBrands = cache(async () => {
  return brandList()
})
