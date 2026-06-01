<script setup>
import { computed } from 'vue'
import { useTransactions } from '../composables/useTransactions.js'
import { useCategories } from '../composables/useCategories.js'
import { useFormat } from '../composables/useFormat.js'
import FilterBar from './FilterBar.vue'

const props = defineProps({
  filterCategory: String,
  filterType: String,
})

const emit = defineEmits([
  'update:filterCategory',
  'update:filterType',
  'edit',
  'delete',
])

const { transactions } = useTransactions()
const { getCategoryName } = useCategories()
const { formatCurrency, formatDate, escapeHtml } = useFormat()

const filteredAndSorted = computed(() => {
  let result = [...transactions]

  if (props.filterCategory) {
    result = result.filter((t) => t.categoryId === props.filterCategory)
  }
  if (props.filterType) {
    result = result.filter((t) => t.type === parseInt(props.filterType))
  }

  result.sort((a, b) => {
    if (a.date > b.date) return -1
    if (a.date < b.date) return 1
    return 0
  })

  return result
})
</script>

<template>
  <section class="glass p-6" style="animation: fadeInUp 0.6s ease-out 0.5s both;">
    <div class="flex justify-between items-center flex-wrap gap-3 mb-4">
      <h2 class="text-lg font-semibold text-text-primary">Histórico</h2>
      <FilterBar
        :filter-category="filterCategory"
        :filter-type="filterType"
        @update:filter-category="emit('update:filterCategory', $event)"
        @update:filter-type="emit('update:filterType', $event)"
      />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="text-text-secondary text-xs uppercase tracking-wider">
            <th class="text-left py-3 px-3 border-b border-steel font-semibold">Data</th>
            <th class="text-left py-3 px-3 border-b border-steel font-semibold">Descrição</th>
            <th class="text-left py-3 px-3 border-b border-steel font-semibold">Categoria</th>
            <th class="text-left py-3 px-3 border-b border-steel font-semibold">Valor</th>
            <th class="text-left py-3 px-3 border-b border-steel font-semibold">Tipo</th>
            <th class="text-left py-3 px-3 border-b border-steel font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredAndSorted.length === 0">
            <td colspan="6" class="text-center text-text-muted py-10">
              Nenhuma transação registrada.
            </td>
          </tr>
          <tr
            v-for="t in filteredAndSorted"
            :key="t.id"
            class="border-b border-steel/50 hover:bg-frost/20 transition-colors"
          >
            <td class="py-3 px-3 text-text-primary">{{ formatDate(t.date) }}</td>
            <td class="py-3 px-3 text-text-primary">
              <span v-html="escapeHtml(t.description)"></span>
              <span
                v-if="t.syncStatus === 'pending'"
                class="inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-amber-900/30 text-amber-400 ml-1.5"
              >
                pendente
              </span>
              <span
                v-if="t.installments"
                class="inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-dim/20 text-cyan ml-1.5"
              >
                1/{{ t.installments }} parcelas
              </span>
            </td>
            <td class="py-3 px-3 text-text-secondary">
              {{ getCategoryName(t.categoryId) }}
            </td>
            <td
              class="py-3 px-3 font-mono font-semibold tabular-nums"
              :class="t.type === 1 ? 'text-emerald' : 'text-coral'"
            >
              {{ t.type === 2 ? '- ' : '' }}{{ formatCurrency(t.amount) }}
            </td>
            <td class="py-3 px-3">
              <span
                class="inline-block text-xs px-2 py-0.5 rounded-full font-semibold"
                :class="t.type === 1 ? 'bg-emerald/15 text-emerald' : 'bg-coral/15 text-coral'"
              >
                {{ t.type === 1 ? 'Receita' : 'Despesa' }}
              </span>
            </td>
            <td class="py-3 px-3">
              <div class="flex gap-2">
                <button
                  @click="$emit('edit', t.id)"
                  class="text-xs px-3 py-1 rounded-lg bg-cyan-dim/20 text-cyan hover:bg-cyan-dim/30 transition-colors font-medium"
                >
                  Editar
                </button>
                <button
                  @click="$emit('delete', t.id)"
                  class="text-xs px-3 py-1 rounded-lg bg-coral/15 text-coral hover:bg-coral/25 transition-colors font-medium"
                >
                  Excluir
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
