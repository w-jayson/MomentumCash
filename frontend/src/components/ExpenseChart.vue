<script setup>
import { computed } from 'vue'
import { useTransactions } from '../composables/useTransactions.js'
import { useCategories } from '../composables/useCategories.js'

const { transactions } = useTransactions()
const { getCategoryName } = useCategories()

const now = new Date()
const currentMonth = now.getMonth()
const currentYear = now.getFullYear()

const expenseData = computed(() => {
  const expenses = transactions.filter((t) => {
    if (t.type !== 2) return false
    const d = new Date(t.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const grouped = {}
  for (const t of expenses) {
    const key = t.categoryId || '__uncategorized__'
    if (!grouped[key]) grouped[key] = 0
    grouped[key] += t.amount
  }

  const labels = []
  const series = []

  for (const [key, total] of Object.entries(grouped)) {
    labels.push(key === '__uncategorized__' ? 'Sem categoria' : getCategoryName(key))
    series.push(Math.round(total * 100) / 100)
  }

  return { labels, series }
})

const palette = ['#F43F5E', '#FF5722', '#F59E0B', '#8B5CF6', '#D946EF']

const hasData = computed(() => expenseData.value.series.length > 0)

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    background: 'transparent',
    foreColor: '#7B89A1',
    fontFamily: 'Satoshi, sans-serif',
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeOutExpo', speed: 800 },
  },
  labels: expenseData.value.labels,
  colors: palette.slice(0, expenseData.value.labels.length),
  stroke: { width: 0 },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          name: { fontSize: '12px', color: '#7B89A1', fontFamily: 'Satoshi, sans-serif' },
          value: { fontSize: '16px', fontWeight: 700, color: '#E8EDF5', fontFamily: 'JetBrains Mono, monospace', formatter: (val) => `R$ ${val.toFixed(0)}` },
          total: {
            show: true,
            label: 'Total Despesas',
            fontSize: '12px',
            color: '#7B89A1',
            fontFamily: 'Satoshi, sans-serif',
            formatter: (w) => {
              const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
              return `R$ ${total.toFixed(2)}`
            },
          },
        },
      },
    },
  },
  legend: {
    position: 'bottom',
    fontSize: '12px',
    fontFamily: 'Satoshi, sans-serif',
    labels: { colors: '#7B89A1', useSeriesColors: false },
    markers: { width: 10, height: 10, radius: 4 },
    itemMargin: { horizontal: 12, vertical: 4 },
  },
  tooltip: {
    theme: 'dark',
    y: { formatter: (val) => `R$ ${val.toFixed(2)}` },
    style: { fontFamily: 'Satoshi, sans-serif' },
  },
  dataLabels: { enabled: false },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: { position: 'bottom', fontSize: '10px' },
        plotOptions: { pie: { donut: { labels: { value: { fontSize: '14px' } } } } },
      },
    },
  ],
  noData: {
    text: 'Sem despesas este mês',
    align: 'center',
    verticalAlign: 'middle',
    style: { fontSize: '14px', color: '#7B89A1', fontFamily: 'Satoshi, sans-serif' },
  },
}))
</script>

<template>
  <div class="glass-elevated p-5 flex flex-col gap-3">
    <h3 class="text-sm font-semibold text-text-secondary uppercase tracking-wider">Despesas por Categoria</h3>
    <div class="w-full">
      <apexchart
        v-if="hasData"
        type="donut"
        height="280"
        :options="chartOptions"
        :series="expenseData.series"
      />
      <div v-else class="flex items-center justify-center h-[280px] text-text-secondary text-sm">
        Sem despesas este mês
      </div>
    </div>
  </div>
</template>
