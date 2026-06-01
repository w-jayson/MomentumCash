import { reactive, ref, computed, watch } from 'vue'

const STORAGE_KEYS = {
  TRANSACTIONS: 'cf_transactions',
  CATEGORIES: 'cf_categories',
}

const activePeriod = ref({
  mode: 'current-month',
  startDate: null,
  endDate: null,
})

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

function getPeriodRange(period) {
  const now = new Date()
  if (period.mode === 'current-month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    return { start, end }
  }
  if (period.mode === 'custom' && period.startDate && period.endDate) {
    return {
      start: new Date(period.startDate),
      end: new Date(period.endDate),
    }
  }
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  return { start, end }
}

function persistCategories() {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(state.categories))
}

function isDateInRange(dateStr, startDate, endDate) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return false
  return d >= startDate && d <= endDate
}

function isInstallmentInPeriod(tx, startDate, endDate) {
  if (!tx.installments || tx.installments <= 0 || tx.type !== 2) {
    return { active: false, valueInPeriod: 0 }
  }
  const start = new Date(tx.date)
  const startYear = start.getFullYear()
  const startMonth = start.getMonth()
  const value = tx.installmentValue || (tx.amount / tx.installments)
  const count = tx.installments

  let totalInPeriod = 0
  for (let i = 0; i < count; i++) {
    const m = startMonth + i
    const y = startYear + Math.floor(m / 12)
    const month = m % 12
    const installmentDate = new Date(y, month, 1)
    if (installmentDate <= endDate && installmentDate >= new Date(startDate.getFullYear(), startDate.getMonth(), 1)) {
      totalInPeriod += value
    }
  }
  return { active: totalInPeriod > 0, valueInPeriod: totalInPeriod }
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

  const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  const periodIncome = computed(() => {
    const { start, end } = getPeriodRange(activePeriod.value)
    return state.transactions
      .filter((t) => t.type === 1 && isDateInRange(t.date, start, end))
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const periodExpense = computed(() => {
    const { start, end } = getPeriodRange(activePeriod.value)
    return state.transactions
      .filter((t) => t.type === 2)
      .reduce((sum, t) => {
        if (t.installments && t.installments > 0) {
          const result = isInstallmentInPeriod(t, start, end)
          return sum + result.valueInPeriod
        }
        return isDateInRange(t.date, start, end) ? sum + t.amount : sum
      }, 0)
  })

  const periodBalance = computed(() =>
    periodIncome.value - periodExpense.value
  )

  const periodExpensesByCategory = computed(() => {
    const { start, end } = getPeriodRange(activePeriod.value)
    const grouped = {}
    for (const t of state.transactions) {
      if (t.type !== 2) continue
      if (t.installments && t.installments > 0) {
        const result = isInstallmentInPeriod(t, start, end)
        if (result.active) {
          const key = t.categoryId || '__uncategorized__'
          if (!grouped[key]) grouped[key] = 0
          grouped[key] += result.valueInPeriod
        }
      } else if (isDateInRange(t.date, start, end)) {
        const key = t.categoryId || '__uncategorized__'
        if (!grouped[key]) grouped[key] = 0
        grouped[key] += t.amount
      }
    }
    const labels = []
    const series = []
    for (const [key, total] of Object.entries(grouped)) {
      if (key === '__uncategorized__') {
        labels.push('Sem categoria')
      } else {
        const cat = state.categories.find((c) => c.id === key)
        labels.push(cat ? cat.name : 'Sem categoria')
      }
      series.push(Math.round(total * 100) / 100)
    }
    return { labels, series, grouped }
  })

  const periodCommitmentProjection = computed(() => {
    const { start } = getPeriodRange(activePeriod.value)
    const periodStartYear = start.getFullYear()
    const periodStartMonth = start.getMonth()

    const monthTotals = {}
    for (const tx of state.transactions) {
      if (!tx.installments || tx.installments <= 0) continue
      if (tx.type !== 2) continue
      const startDate = new Date(tx.date)
      const startMonth = startDate.getMonth()
      const startYear = startDate.getFullYear()
      const value = tx.installmentValue || (tx.amount / tx.installments)
      const count = tx.installments
      for (let i = 0; i < count; i++) {
        const m = startMonth + i
        const y = startYear + Math.floor(m / 12)
        const month = m % 12
        const key = `${y}-${String(month + 1).padStart(2, '0')}`
        if (!monthTotals[key]) monthTotals[key] = 0
        monthTotals[key] += value
      }
    }

    const labels = []
    const installmentSeries = []
    for (let i = 0; i < 12; i++) {
      const m = periodStartMonth + i
      const y = periodStartYear + Math.floor(m / 12)
      const month = m % 12
      const key = `${y}-${String(month + 1).padStart(2, '0')}`
      labels.push(`${MONTH_LABELS[month]}/${String(y).slice(2)}`)
      installmentSeries.push(Math.round((monthTotals[key] || 0) * 100) / 100)
    }

    const { end } = getPeriodRange(activePeriod.value)
    const monthlyIncome = {}
    for (const tx of state.transactions) {
      if (tx.type !== 1) continue
      const d = new Date(tx.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!monthlyIncome[key]) monthlyIncome[key] = 0
      monthlyIncome[key] += tx.amount
    }

    const lastMonths = []
    const endYear = end.getFullYear()
    const endMonth = end.getMonth()
    for (let i = 2; i >= 0; i--) {
      const m = endMonth - i
      const y = endYear + Math.floor(m / 12)
      const month = ((m % 12) + 12) % 12
      const key = `${y}-${String(month + 1).padStart(2, '0')}`
      lastMonths.push(monthlyIncome[key] || 0)
    }

    const nonZero = lastMonths.filter((v) => v > 0)
    let averageIncome = 0
    if (nonZero.length > 0) {
      averageIncome = Math.round((nonZero.reduce((a, b) => a + b, 0) / nonZero.length) * 100) / 100
    } else {
      const allValues = Object.values(monthlyIncome).filter((v) => v > 0)
      if (allValues.length > 0) {
        averageIncome = Math.round((allValues.reduce((a, b) => a + b, 0) / allValues.length) * 100) / 100
      }
    }

    return { labels, installmentSeries, averageIncome }
  })

  const PRESET_LABELS = {
    'last-3': 'ultimos 3 meses',
    'last-6': 'ultimos 6 meses',
    'last-12': 'ultimo ano',
    'next-3': 'proximos 3 meses',
    'next-6': 'proximos 6 meses',
    'next-12': 'proximo ano',
  }

  function getPeriodLabel() {
    const p = activePeriod.value
    if (p.mode === 'current-month') return 'mes atual'
    if (p.preset && PRESET_LABELS[p.preset]) return PRESET_LABELS[p.preset]
    if (p.mode === 'custom' && p.startDate && p.endDate) {
      const s = new Date(p.startDate)
      const e = new Date(p.endDate)
      const fmt = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
      return `${fmt(s)} - ${fmt(e)}`
    }
    return 'mes atual'
  }

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
    activePeriod,
    getPeriodRange,
    isDateInRange,
    isInstallmentInPeriod,
    periodIncome,
    periodExpense,
    periodBalance,
    periodExpensesByCategory,
    periodCommitmentProjection,
    getPeriodLabel,
    balance,
    totalIncome,
    totalExpense,
    currentMonthIncome,
    currentMonthExpense,
    getFilteredTransactions,
  }
}

export { state }
