<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useTransactions } from '../composables/useTransactions.js'
import { useApi } from '../composables/useApi.js'
import { useFormat } from '../composables/useFormat.js'
import { useCategories } from '../composables/useCategories.js'
import InstallmentFields from './InstallmentFields.vue'

const props = defineProps({
  editingTransaction: { type: Object, default: null },
})

const emit = defineEmits(['saved'])

const { transactions, addTransaction, updateTransaction, getServerId } = useTransactions()
const { createTransaction: apiCreate, updateTransaction: apiUpdate } = useApi()
const { getTodayISO } = useFormat()
const { getByType } = useCategories()

const editingId = ref(null)
const showErrors = ref(false)
const userEditedInstallmentValue = ref(false)

const form = reactive({
  description: '',
  amount: '',
  type: '1',
  date: getTodayISO(),
  categoryId: '',
  isInstallment: false,
  installments: '',
  installmentValue: '',
})

const isEditing = computed(() => editingId.value !== null)

const formTitle = computed(() => isEditing.value ? 'Editar Transação' : 'Nova Transação')
const submitLabel = computed(() => isEditing.value ? 'Atualizar' : 'Salvar')

const categoryOptions = computed(() => getByType(parseInt(form.type)))

watch(() => props.editingTransaction, (tx) => {
  if (tx) {
    editingId.value = tx.id
    form.description = tx.description
    form.amount = tx.amount
    form.type = tx.type?.toString() || '1'
    form.date = tx.date?.split('T')[0] || getTodayISO()
    form.categoryId = tx.categoryId || ''

    if (tx.installments && tx.type === 2) {
      form.isInstallment = true
      form.installments = tx.installments
      form.installmentValue = tx.installmentValue ?? ''
      userEditedInstallmentValue.value = true
    } else {
      form.isInstallment = false
      form.installments = ''
      form.installmentValue = ''
      userEditedInstallmentValue.value = false
    }
  }
}, { immediate: true })

watch(() => form.type, () => {
  form.categoryId = ''
  if (parseInt(form.type) !== 2) {
    form.isInstallment = false
    form.installments = ''
    form.installmentValue = ''
    userEditedInstallmentValue.value = false
  }
})

function autoCalcInstallmentValue() {
  if (!form.isInstallment) return
  const amount = parseFloat(form.amount)
  const installments = parseInt(form.installments)
  if (isNaN(amount) || amount <= 0 || isNaN(installments) || installments < 2) return
  if (userEditedInstallmentValue.value) return

  const calculated = Math.round((amount / installments) * 100) / 100
  form.installmentValue = calculated.toFixed(2)
}

watch(() => form.amount, autoCalcInstallmentValue)
watch(() => form.installments, autoCalcInstallmentValue)

function resetForm() {
  editingId.value = null
  form.description = ''
  form.amount = ''
  form.type = '1'
  form.date = getTodayISO()
  form.categoryId = ''
  form.isInstallment = false
  form.installments = ''
  form.installmentValue = ''
  userEditedInstallmentValue.value = false
  showErrors.value = false
}

function onInstallmentValueInput() {
  userEditedInstallmentValue.value = true
}

function validate() {
  const desc = form.description.trim()
  const amount = parseFloat(form.amount)
  const date = form.date

  if (!desc || !amount || amount <= 0 || !date) {
    showErrors.value = true
    return false
  }

  if (form.isInstallment) {
    const installments = parseInt(form.installments)
    const installmentValue = parseFloat(form.installmentValue)
    if (!installments || installments < 2 || !installmentValue || installmentValue <= 0) {
      showErrors.value = true
      return false
    }
  }

  return true
}

async function handleSubmit() {
  if (!validate()) return

  const data = {
    description: form.description.trim(),
    amount: parseFloat(form.amount),
    type: parseInt(form.type),
    date: new Date(form.date + 'T00:00:00').toISOString(),
    categoryId: form.categoryId || null,
    installments: form.isInstallment ? parseInt(form.installments) : null,
    installmentValue: form.isInstallment ? parseFloat(form.installmentValue) : null,
  }

  if (isEditing.value) {
    const serverId = getServerId(editingId.value)
    updateTransaction(editingId.value, { ...data, syncStatus: 'pending' })
    resetForm()
    emit('saved')

    if (serverId) {
      try {
        await apiUpdate(serverId, data)
        updateTransaction(editingId.value, { syncStatus: 'synced' })
        emit('saved')
      } catch { /* keep pending */ }
    }
  } else {
    const id = crypto.randomUUID()
    const transaction = {
      id,
      serverId: null,
      ...data,
      syncStatus: 'pending',
    }
    addTransaction(transaction)
    resetForm()
    emit('saved')

    try {
      const result = await apiCreate(transaction)
      updateTransaction(id, { serverId: result.id, syncStatus: 'synced' })
      emit('saved')
    } catch { /* keep pending */ }
  }
}
</script>

<template>
  <section class="glass p-6 mb-8" style="animation: fadeInUp 0.6s ease-out 0.4s both;">
    <h2 class="text-lg font-semibold mb-4 text-text-primary">{{ formTitle }}</h2>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4" novalidate>
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-medium text-text-secondary">Descrição</label>
        <input
          v-model="form.description"
          type="text"
          placeholder="Ex: Supermercado"
          maxlength="200"
          class="bg-midnight border text-text-primary text-sm rounded-xl px-4 py-2.5 input-glow transition-all duration-200"
          :class="showErrors && !form.description.trim() ? 'border-coral' : 'border-steel'"
          @input="showErrors = false"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-text-secondary">Valor</label>
          <input
            v-model="form.amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            class="bg-midnight border text-text-primary text-sm rounded-xl px-4 py-2.5 input-glow transition-all duration-200"
            :class="showErrors && (!form.amount || parseFloat(form.amount) <= 0) ? 'border-coral' : 'border-steel'"
            @input="showErrors = false"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-text-secondary">Tipo</label>
          <select
            v-model="form.type"
            class="bg-midnight border border-steel text-text-primary text-sm rounded-xl px-4 py-2.5 input-glow transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="1">Receita</option>
            <option value="2">Despesa</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-text-secondary">Data</label>
          <input
            v-model="form.date"
            type="date"
            class="bg-midnight border text-text-primary text-sm rounded-xl px-4 py-2.5 input-glow transition-all duration-200"
            :class="showErrors && !form.date ? 'border-coral' : 'border-steel'"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-text-secondary">Categoria</label>
          <select
            v-model="form.categoryId"
            class="bg-midnight border border-steel text-text-primary text-sm rounded-xl px-4 py-2.5 input-glow transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Sem categoria</option>
            <option v-for="cat in categoryOptions" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="parseInt(form.type) === 2" class="glass-elevated p-4 rounded-2xl">
        <InstallmentFields
          :is-installment="form.isInstallment"
          :installments="form.installments"
          :installment-value="form.installmentValue"
          :show-errors="showErrors"
          @update:is-installment="form.isInstallment = $event"
          @update:installments="form.installments = $event"
          @update:installment-value="form.installmentValue = $event; onInstallmentValueInput()"
        />
      </div>

      <div class="flex gap-3 mt-1">
        <button
          type="submit"
          class="bg-cyan text-void font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-cyan/80 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-glow"
        >
          {{ submitLabel }}
        </button>
        <button
          v-if="isEditing"
          type="button"
          @click="resetForm"
          class="bg-steel text-text-primary font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-frost transition-all duration-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  </section>
</template>
