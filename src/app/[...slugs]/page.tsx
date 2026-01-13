import ProductListingPage from '@/components/pages/pages/ProductListingPage'
import { getCachedCategories, getCachedBrands } from '@/lib/server-data'

export default async function RootCategoryPage({
  params,
}: {
  params: Promise<{ slugs?: string[] }>
}) {
  const resolvedParams = await params;  // unwrap the promise
  const slugPath = resolvedParams.slugs?.join('/') ?? '';
  const [categoriesRes, brandsRes] = await Promise.all([
    getCachedCategories(),
    getCachedBrands(),
  ])

  return (
    <ProductListingPage
      categorySlugPath={slugPath}
      initialCategories={categoriesRes?.categories || []}
      initialBrands={brandsRes?.brand || []}
    />
  )
}
