import type { Menu, MenuItem } from '@/types/fos'

export function filterMenuBySearch(menuItems: Menu, searchTerm: string): Menu {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return menuItems

  const filtered: Record<string, MenuItem[]> = {}

  for (const [category, items] of Object.entries(menuItems)) {
    const matchedItems = items.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      (item.categoryName || category).toLowerCase().includes(term)
    )
    if (matchedItems.length > 0) {
      filtered[category] = matchedItems
    }
  }

  return filtered
}

