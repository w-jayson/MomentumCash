import { reactive, computed, watch } from 'vue'

const STORAGE_KEYS = {
  TRANSACTIONS: 'cf_transactions',
  CATEGORIES: 'cf_categories',
}

const state = reactive({
  transactions: [],
  categories: [],
})

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
    if (data) state.transactions = JSON.parse(data)
  } catch { /* ignore */ }
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    if (data) state.categories = JSON.parse(data)
  } catch { /* ignore */ }
}

function persistTransactions() {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions))
}

function persistCategories() {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(state.categories))
}

export function useTransactions() {
  loadFromStorage()

  watch(() => [...state.transactions], persistTransactions, { deep: true })
  watch(() => [...state.categories], persistCategories, { deep: true })

  function addTransaction(transaction) {
    state.transactions.push(transaction)
  }

  function updateTransaction(id, data) {
    const index = state.transactions.findIndex((t) => t.id === id)
    if (index === -1) return null
    state.transactions[index] = { ...state.transactions[index], ...data }
    return state.transactions[index]
  }

  function deleteTransaction(id) {
    state.transactions = state.transactions.filter((t) => t.id !== id)
  }

  function getById(id) {
    return state.transactions.find((t) => t.id === id)
  }

  function getServerId(localId) {
    const t = getById(localId)
    return t ? t.serverId : null
  }

  function saveCategories(categories) {
    state.categories = categories
  }

  const balance = computed(() => {
    const income = state.transactions
      .filter((t) => t.type === 1)
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = state.transactions
      .filter((t) => t.type === 2)
      .reduce((sum, t) => sum + t.amount, 0)
    return income - expense
  })

  const totalIncome = computed(() =>
    state.transactions
      .filter((t) => t.type === 1)
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const totalExpense = computed(() =>
    state.transactions
      .filter((t) => t.type === 2)
      .reduce((sum, t) => sum + t.amount, 0)
  )

  function getFilteredTransactions(filters = {}) {
    let result = [...state.transactions]
    if (filters.categoryId) {
      result = result.filter((t) => t.categoryId === filters.categoryId)
    }
    if (filters.type) {
      result = result.filter((t) => t.type === parseInt(filters.type))
    }
    return result
  }

  return {
    transactions: state.transactions,
    categories: state.categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getById,
    getServerId,
    saveCategories,
    balance,
    totalIncome,
    totalExpense,
    getFilteredTransactions,
  }
}
