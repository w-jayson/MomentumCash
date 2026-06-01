<script setup>
import { computed } from 'vue'
import { useTransactions } from '../composables/useTransactions.js'

const { periodCommitmentProjection } = useTransactions()

const projectedMonths = computed(() => ({
  labels: periodCommitmentProjection.value.labels,
  installmentSeries: periodCommitmentProjection.value.installmentSeries,
}))

const averageIncome = computed(() => periodCommitmentProjection.value.averageIncome)

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
  { name: 'Renda Media Mensal', data: projectedMonths.value.labels.map(() => averageIncome.value) },
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
