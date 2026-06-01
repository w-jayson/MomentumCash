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

let initialized = false

export function updateTransaction(id, data) {
  const index = state.transactions.findIndex((t) => t.id === id)
  if (index === -1) return null
  state.transactions[index] = { ...state.transactions[index], ...data }
  return state.transactions[index]
}

export function useTransactions() {
  if (!initialized) {
    loadFromStorage()
    initialized = true
  }

  watch(() => [...state.transactions], persistTransactions, { deep: true })
  watch(() => [...state.categories], persistCategories, { deep: true })

  function addTransaction(transaction) {
    state.transactions.push(transaction)
  }

  function deleteTransaction(id) {
    const index = state.transactions.findIndex((t) => t.id === id)
    if (index !== -1) state.transactions.splice(index, 1)
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
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    const income = state.transactions
      .filter((t) => t.type === 1)
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = state.transactions
      .filter((t) => t.type === 2)
      .reduce((sum, t) => {
        if (t.installments && t.installments > 0) {
          if (isCurrentInstallment(t, currentYear, currentMonth)) {
            return sum + (t.installmentValue || (t.amount / t.installments))
          }
          return sum
        }
        return sum + t.amount
      }, 0)
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

  function isCurrentMonth(dateStr) {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }

  function isCurrentInstallment(tx, currentYear, currentMonth) {
    const start = new Date(tx.date)
    const startYear = start.getFullYear()
    const startMonth = start.getMonth()

    const startTotal = startYear * 12 + startMonth
    const endTotal = startTotal + tx.installments - 1
    const currentTotal = currentYear * 12 + currentMonth

    return currentTotal >= startTotal && currentTotal <= endTotal
  }

  const currentMonthIncome = computed(() =>
    state.transactions
      .filter((t) => t.type === 1 && isCurrentMonth(t.date))
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const currentMonthExpense = computed(() =>
    state.transactions
      .filter((t) => t.type === 2)
      .reduce((sum, t) => {
        if (t.installments && t.installments > 0) {
          const now = new Date()
          if (isCurrentInstallment(t, now.getFullYear(), now.getMonth())) {
            return sum + (t.installmentValue || (t.amount / t.installments))
          }
          return sum
        }
        return isCurrentMonth(t.date) ? sum + t.amount : sum
      }, 0)
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
    currentMonthIncome,
    currentMonthExpense,
    getFilteredTransactions,
  }
}

export { state }
