<script setup>
import { computed } from 'vue'
import { useTransactions } from '../composables/useTransactions.js'
import SummaryCard from './SummaryCard.vue'

const { periodBalance, periodIncome, periodExpense, getPeriodLabel } = useTransactions()

const periodLabel = computed(() => getPeriodLabel())
</script>

<template>
  <header class="mb-8 mt-4">
    <h1
      class="text-3xl font-display font-black mb-6 text-text-primary text-glow-cyan"
      style="animation: fadeInDown 0.6s ease-out forwards;"
    >
      MomentumCash
    </h1>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div style="animation: fadeInUp 0.6s ease-out 0.1s both;">
        <SummaryCard label="Saldo" :amount="periodBalance" variant="balance" :sublabel="periodLabel" />
      </div>
      <div style="animation: fadeInUp 0.6s ease-out 0.2s both;">
        <SummaryCard label="Receitas" :amount="periodIncome" variant="income" :sublabel="periodLabel" />
      </div>
      <div style="animation: fadeInUp 0.6s ease-out 0.3s both;">
        <SummaryCard label="Despesas" :amount="periodExpense" variant="expense" :sublabel="periodLabel" />
      </div>
    </div>
  </header>
</template>
