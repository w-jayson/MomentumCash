import { useTransactions } from './useTransactions.js'
import { useApi } from './useApi.js'

export function useCategories() {
  const { categories, saveCategories } = useTransactions()
  const { loadCategoriesFromServer, fetchCategories } = useApi()

  async function loadFromServer() {
    return loadCategoriesFromServer()
  }

  async function loadByType(type) {
    try {
      const result = await fetchCategories(type)
      return result
    } catch {
      return categories.filter((c) => c.type === type)
    }
  }

  function getByType(type) {
    return categories.filter((c) => c.type === type)
  }

  function getCategoryName(categoryId) {
    if (!categoryId) return '-'
    const found = categories.find((c) => c.id === categoryId)
    return found ? found.name : '-'
  }

  function populateCache(cats) {
    saveCategories(cats)
  }

  return {
    categories,
    loadFromServer,
    loadByType,
    getByType,
    getCategoryName,
    populateCache,
  }
}
