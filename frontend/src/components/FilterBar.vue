<script setup>
import { useTransactions } from '../composables/useTransactions.js'

const props = defineProps({
  filterCategory: String,
  filterType: String,
})

const emit = defineEmits(['update:filterCategory', 'update:filterType'])

const { categories } = useTransactions()

function onCategoryChange(e) {
  emit('update:filterCategory', e.target.value)
}

function onTypeChange(e) {
  emit('update:filterType', e.target.value)
}
</script>

<template>
  <div class="flex flex-wrap gap-3">
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
  </div>
</template>
