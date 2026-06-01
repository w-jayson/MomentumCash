<script setup>
import { computed } from 'vue'
import { useTransactions } from '../composables/useTransactions.js'

const props = defineProps({
  filterCategory: String,
  filterType: String,
  filterDateStart: { type: String, default: '' },
  filterDateEnd: { type: String, default: '' },
})

const emit = defineEmits([
  'update:filterCategory',
  'update:filterType',
  'update:filterDateStart',
  'update:filterDateEnd',
])

const { categories } = useTransactions()

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function toISODate(val) {
  if (!val) return null
  return new Date(val + 'T00:00:00')
}

const periodMode = computed({
  get: () => {
    if (!props.filterDateStart && !props.filterDateEnd) return 'all'
    if (!props.filterDateStart || !props.filterDateEnd) return 'custom'
    const s = new Date(props.filterDateStart + 'T00:00:00')
    const e = new Date(props.filterDateEnd + 'T23:59:59')
    const now = new Date()
    const today = toDateStr(now)

    if (toDateStr(s) === today && toDateStr(e) === today) return 'day'

    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    if (toDateStr(s) === toDateStr(weekStart) && toDateStr(e) === toDateStr(weekEnd)) return 'week'

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    if (toDateStr(s) === toDateStr(monthStart) && e.getFullYear() === monthEnd.getFullYear() && e.getMonth() === monthEnd.getMonth()) return 'month'

    return 'custom'
  },
  set: (val) => {
    if (val === 'all') {
      emit('update:filterDateStart', '')
      emit('update:filterDateEnd', '')
      return
    }
    const now = new Date()
    if (val === 'day') {
      const d = toDateStr(now)
      emit('update:filterDateStart', d)
      emit('update:filterDateEnd', d)
    } else if (val === 'week') {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      emit('update:filterDateStart', toDateStr(weekStart))
      emit('update:filterDateEnd', toDateStr(weekEnd))
    } else if (val === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      emit('update:filterDateStart', toDateStr(monthStart))
      emit('update:filterDateEnd', toDateStr(monthEnd))
    } else if (val === 'custom') {
      emit('update:filterDateStart', props.filterDateStart || '')
      emit('update:filterDateEnd', props.filterDateEnd || '')
    }
  }
})

const isCustom = computed(() => periodMode.value === 'custom')

const customStart = computed({
  get: () => props.filterDateStart || '',
  set: (val) => emit('update:filterDateStart', val),
})

const customEnd = computed({
  get: () => props.filterDateEnd || '',
  set: (val) => emit('update:filterDateEnd', val),
})

function onCategoryChange(e) {
  emit('update:filterCategory', e.target.value)
}

function onTypeChange(e) {
  emit('update:filterType', e.target.value)
}
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <select
      :value="filterCategory"
      @change="onCategoryChange"
      class="bg-midnight border border-steel text-text-primary text-xs rounded-xl px-3 py-2 input-glow transition-all duration-200 appearance-none cursor-pointer"
    >
      <option value="">Todas categorias</option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
        {{ cat.name }}
      </option>
    </select>
    <select
      :value="filterType"
      @change="onTypeChange"
      class="bg-midnight border border-steel text-text-primary text-xs rounded-xl px-3 py-2 input-glow transition-all duration-200 appearance-none cursor-pointer"
    >
      <option value="">Todos os tipos</option>
      <option value="1">Receitas</option>
      <option value="2">Despesas</option>
    </select>
    <select
      v-model="periodMode"
      class="bg-midnight border border-steel text-text-primary text-xs rounded-xl px-3 py-2 input-glow transition-all duration-200 appearance-none cursor-pointer"
    >
      <option value="all">Todas as datas</option>
      <option value="day">Hoje</option>
      <option value="week">Esta semana</option>
      <option value="month">Este mes</option>
      <option value="custom">Personalizado...</option>
    </select>
    <template v-if="isCustom">
      <input
        type="date"
        :value="customStart"
        @input="(e) => customStart = e.target.value"
        class="bg-midnight border border-steel text-text-primary text-xs rounded-xl px-3 py-2 input-glow transition-all duration-200"
      />
      <span class="text-text-secondary text-xs">ate</span>
      <input
        type="date"
        :value="customEnd"
        @input="(e) => customEnd = e.target.value"
        class="bg-midnight border border-steel text-text-primary text-xs rounded-xl px-3 py-2 input-glow transition-all duration-200"
      />
    </template>
  </div>
</template>
