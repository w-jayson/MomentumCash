<script setup>
import { computed } from 'vue'
import { useTransactions } from '../composables/useTransactions.js'

const { transactions } = useTransactions()

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function getMonthKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

function getMonthLabel(year, month) {
  return `${MONTH_LABELS[month]}/${String(year).slice(2)}`
}

const projectedMonths = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthTotals = {}

  for (const tx of transactions) {
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
      const key = getMonthKey(y, month)

      if (!monthTotals[key]) monthTotals[key] = 0
      monthTotals[key] += value
    }
  }

  const labels = []
  const installmentSeries = []

  for (let i = 0; i < 12; i++) {
    const m = currentMonth + i
    const y = currentYear + Math.floor(m / 12)
    const month = m % 12
    const key = getMonthKey(y, month)
    labels.push(getMonthLabel(y, month))
    installmentSeries.push(Math.round((monthTotals[key] || 0) * 100) / 100)
  }

  return { labels, installmentSeries }
})

const averageIncome = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthlyIncome = {}

  for (const tx of transactions) {
    if (tx.type !== 1) continue
    const d = new Date(tx.date)
    const key = getMonthKey(d.getFullYear(), d.getMonth())
    if (!monthlyIncome[key]) monthlyIncome[key] = 0
    monthlyIncome[key] += tx.amount
  }

  const lastMonths = []
  for (let i = 2; i >= 0; i--) {
    const m = currentMonth - i
    const y = currentYear + Math.floor(m / 12)
    const month = ((m % 12) + 12) % 12
    const key = getMonthKey(y, month)
    lastMonths.push(monthlyIncome[key] || 0)
  }

  const nonZero = lastMonths.filter((v) => v > 0)
  if (nonZero.length > 0) {
    return Math.round((nonZero.reduce((a, b) => a + b, 0) / nonZero.length) * 100) / 100
  }

  const allValues = Object.values(monthlyIncome).filter((v) => v > 0)
  if (allValues.length > 0) {
    return Math.round((allValues.reduce((a, b) => a + b, 0) / allValues.length) * 100) / 100
  }

  return 0
})

const hasData = computed(() => {
  return projectedMonths.value.installmentSeries.some((v) => v > 0)
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    background: 'transparent',
    foreColor: '#7B89A1',
    fontFamily: 'Satoshi, sans-serif',
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeOutExpo', speed: 800 },
    stacked: false,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '70%',
      borderRadius: 4,
      dataLabels: { position: 'top' },
    },
  },
  colors: ['#FF3D60', '#00E5FF'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['transparent'],
  },
  xaxis: {
    categories: projectedMonths.value.labels,
    labels: {
      style: { colors: '#7B89A1', fontSize: '11px', fontFamily: 'Satoshi, sans-serif' },
    },
    axisBorder: { color: '#1A233A' },
    axisTicks: { color: '#1A233A' },
  },
  yaxis: {
    labels: {
      style: { colors: '#7B89A1', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' },
      formatter: (val) => val >= 1000 ? `R$ ${(val / 1000).toFixed(0)}k` : `R$ ${val.toFixed(0)}`,
    },
    min: 0,
  },
  grid: {
    borderColor: '#1A233A',
    strokeDashArray: 3,
    position: 'back',
  },
  legend: {
    position: 'top',
    fontSize: '12px',
    fontFamily: 'Satoshi, sans-serif',
    labels: { colors: '#7B89A1' },
    markers: { width: 10, height: 10, radius: 4 },
  },
  tooltip: {
    theme: 'dark',
    style: { fontFamily: 'Satoshi, sans-serif' },
    y: { formatter: (val) => `R$ ${val.toFixed(2)}` },
  },
  noData: {
    text: 'Nenhuma parcela futura',
    align: 'center',
    verticalAlign: 'middle',
    style: { fontSize: '14px', color: '#7B89A1', fontFamily: 'Satoshi, sans-serif' },
  },
}))

const chartSeries = computed(() => [
  { name: 'Parcelas Projetadas', data: projectedMonths.value.installmentSeries },
  { name: 'Renda Média Mensal', data: projectedMonths.value.labels.map(() => averageIncome.value) },
])
</script>

<template>
  <div class="glass-elevated p-5 flex flex-col gap-3">
    <h3 class="text-sm font-semibold text-text-secondary uppercase tracking-wider">Renda Comprometida</h3>
    <div class="w-full">
      <apexchart
        v-if="hasData"
        type="bar"
        height="280"
        :options="chartOptions"
        :series="chartSeries"
      />
      <div v-else class="flex items-center justify-center h-[280px] text-text-secondary text-sm">
        Nenhuma parcela futura
      </div>
    </div>
  </div>
</template>
