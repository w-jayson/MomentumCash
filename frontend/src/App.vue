<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import ExpenseChart from './components/ExpenseChart.vue'
import CommitmentTimeline from './components/CommitmentTimeline.vue'
import TransactionForm from './components/TransactionForm.vue'
import TransactionHistory from './components/TransactionHistory.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import AppFooter from './components/AppFooter.vue'
import { useTransactions } from './composables/useTransactions.js'
import { useApi } from './composables/useApi.js'
import { useCategories } from './composables/useCategories.js'

const { deleteTransaction, getById } = useTransactions()
const { syncPendingTransactions, loadCategoriesFromServer } = useApi()
const { loadFromServer } = useCategories()

const editingTransaction = ref(null)
const modalVisible = ref(false)
const pendingDeleteId = ref(null)

const filterCategory = ref('')
const filterType = ref('')

let syncInterval = null

function handleEdit(id) {
  const tx = getById(id)
  if (tx) {
    editingTransaction.value = { ...tx }
  }
}

function handleDelete(id) {
  pendingDeleteId.value = id
  modalVisible.value = true
}

function handleConfirmDelete() {
  if (pendingDeleteId.value) {
    deleteTransaction(pendingDeleteId.value)
  }
  modalVisible.value = false
  pendingDeleteId.value = null
}

function handleCancelModal() {
  modalVisible.value = false
  pendingDeleteId.value = null
}

function handleSaved() {
  editingTransaction.value = null
}

function handleCancelEdit() {
  editingTransaction.value = null
}

onMounted(async () => {
  await loadCategoriesFromServer()
  syncInterval = setInterval(syncPendingTransactions, 30000)
})

onUnmounted(() => {
  if (syncInterval) clearInterval(syncInterval)
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6 relative z-10 flex flex-col gap-8">
    <AppHeader />

    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6"
             style="animation: fadeInUp 0.6s ease-out 0.3s both;">
      <ExpenseChart />
      <CommitmentTimeline />
    </section>

    <TransactionForm
      :editing-transaction="editingTransaction"
      @saved="handleSaved"
    />

    <TransactionHistory
        :filter-category="filterCategory"
        :filter-type="filterType"
        @update:filter-category="filterCategory = $event"
        @update:filter-type="filterType = $event"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <AppFooter />

    <ConfirmModal
      :visible="modalVisible"
      message="Tem certeza que deseja excluir esta transação?"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelModal"
    />
  </div>
</template>
