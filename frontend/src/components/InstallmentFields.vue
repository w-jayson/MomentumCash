<script setup>
import { computed } from 'vue'

const props = defineProps({
  isInstallment: Boolean,
  installments: [Number, String],
  installmentValue: [Number, String],
  showErrors: Boolean,
})

const emit = defineEmits([
  'update:isInstallment',
  'update:installments',
  'update:installmentValue',
])

const localIsInstallment = computed({
  get: () => props.isInstallment,
  set: (val) => emit('update:isInstallment', val),
})

const localInstallments = computed({
  get: () => props.installments,
  set: (val) => emit('update:installments', val),
})

const localInstallmentValue = computed({
  get: () => props.installmentValue,
  set: (val) => emit('update:installmentValue', val),
})
</script>

<template>
  <div class="mb-2">
    <label class="flex items-center gap-2 cursor-pointer font-medium text-text-primary text-sm select-none">
      <input
        v-model="localIsInstallment"
        type="checkbox"
        class="w-4 h-4 accent-cyan rounded"
      />
      Compra parcelada?
    </label>
  </div>

  <div v-if="localIsInstallment" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-medium text-text-secondary">Quantidade de parcelas</label>
      <input
        v-model="localInstallments"
        type="number"
        min="2"
        step="1"
        placeholder="12"
        class="bg-midnight border text-text-primary text-sm rounded-xl px-4 py-2.5 input-glow transition-all duration-200"
        :class="showErrors && (!localInstallments || localInstallments < 2) ? 'border-coral' : 'border-steel'"
      />
    </div>
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-medium text-text-secondary">Valor da parcela</label>
      <input
        v-model="localInstallmentValue"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0,00"
        class="bg-midnight border text-text-primary text-sm rounded-xl px-4 py-2.5 input-glow transition-all duration-200"
        :class="showErrors && (!localInstallmentValue || localInstallmentValue <= 0) ? 'border-coral' : 'border-steel'"
      />
    </div>
  </div>
</template>
