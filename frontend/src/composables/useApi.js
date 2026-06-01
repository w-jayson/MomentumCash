import { useTransactions } from './useTransactions.js'

const API_BASE = '/api'

async function apiFetch(url, options = {}) {
  const defaultHeaders = { 'Content-Type': 'application/json' }
  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(`${API_BASE}${url}`, config)

  if (!response.ok) {
    const errorBody = await response.text()
    let message
    try {
      const parsed = JSON.parse(errorBody)
      message = parsed.error || parsed.title || errorBody
    } catch {
      message = errorBody || `HTTP ${response.status}`
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

async function fetchCategories(type) {
  const query = type ? `?type=${type}` : ''
  return apiFetch(`/categories${query}`)
}

async function createCategory(name, type) {
  return apiFetch('/categories', { method: 'POST', body: { name, type } })
}

async function createTransaction(transaction) {
  return apiFetch('/transactions', {
    method: 'POST',
    body: {
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      categoryId: transaction.categoryId || null,
      installments: transaction.installments || null,
      installmentValue: transaction.installmentValue || null,
    },
  })
}

async function updateTransactionApi(id, transaction) {
  return apiFetch(`/transactions/${id}`, {
    method: 'PUT',
    body: {
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      categoryId: transaction.categoryId || null,
      installments: transaction.installments || null,
      installmentValue: transaction.installmentValue || null,
    },
  })
}

async function deleteTransactionApi(id) {
  return apiFetch(`/transactions/${id}`, { method: 'DELETE' })
}

function syncPendingTransactions() {
  const { transactions, updateTransaction } = useTransactions()
  const pending = transactions.filter((t) => t.syncStatus === 'pending')

  pending.forEach(async (t) => {
    try {
      if (t.serverId) {
        await updateTransactionApi(t.serverId, t)
      } else {
        const result = await createTransaction(t)
        updateTransaction(t.id, {
          serverId: result.id,
          syncStatus: 'synced',
        })
        return
      }
      updateTransaction(t.id, { syncStatus: 'synced' })
    } catch {
      /* Retry on next cycle */
    }
  })
}

async function loadCategoriesFromServer(type) {
  const { saveCategories } = useTransactions()
  try {
    const categories = await fetchCategories(type)
    saveCategories(categories)
    return categories
  } catch {
    const { categories } = useTransactions()
    return categories
  }
}

export function useApi() {
  return {
    fetchCategories,
    createCategory,
    createTransaction,
    updateTransaction: updateTransactionApi,
    deleteTransaction: deleteTransactionApi,
    syncPendingTransactions,
    loadCategoriesFromServer,
  }
}
