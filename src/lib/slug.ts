// export const slugify = (text: string) =>
//   text
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/(^-|-$)/g, '')


export const findCategoryBySlugPath = (
  categories: any[],
  slugs: string[]
): any | null => {
  let currentLevel = categories
  let found = null

  for (const slug of slugs) {
    found = currentLevel.find(
      (c: any) =>
        c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    )

    if (!found) return null
    currentLevel = found.subcategories || []
  }

  return found
}
