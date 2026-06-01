<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import PeriodSelector from './components/PeriodSelector.vue'
import ExpenseChart from './components/ExpenseChart.vue'
import CommitmentTimeline from './components/CommitmentTimeline.vue'
import TransactionForm from './components/TransactionForm.vue'
import TransactionHistory from './components/TransactionHistory.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import AppFooter from './components/AppFooter.vue'
import { useTransactions } from './composables/useTransactions.js'
import { useApi } from './composables/useApi.js'
import { useCategories } from './composables/useCategories.js'

const { deleteTransaction, getById, activePeriod } = useTransactions()
const { syncPendingTransactions, loadCategoriesFromServer } = useApi()
const { loadFromServer } = useCategories()

const currentView = ref('dashboard')
const editingTransaction = ref(null)
const modalVisible = ref(false)
const pendingDeleteId = ref(null)
const showForm = ref(false)

const filterCategory = ref('')
const filterType = ref('')
const filterDateStart = ref('')
const filterDateEnd = ref('')

let syncInterval = null

function goToExtrato() {
  currentView.value = 'extrato'
}

function goToNewTransaction() {
  editingTransaction.value = null
  showForm.value = true
  currentView.value = 'new-transaction'
}

function goToDashboard() {
  showForm.value = false
  editingTransaction.value = null
  activePeriod.value = { mode: 'current-month', startDate: null, endDate: null }
  currentView.value = 'dashboard'
}

function handleEdit(id) {
  const tx = getById(id)
  if (tx) {
    editingTransaction.value = { ...tx }
    showForm.value = true
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
  showForm.value = false
  if (currentView.value === 'new-transaction') {
    currentView.value = 'dashboard'
  }
}

function handleCancelEdit() {
  editingTransaction.value = null
  showForm.value = false
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

    <Transition name="view" mode="out-in">
      <div v-if="currentView === 'dashboard'" key="dashboard" class="flex flex-col gap-8">
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6"
                 style="animation: fadeInUp 0.6s ease-out 0.2s both;">
          <ExpenseChart />
          <CommitmentTimeline />
        </section>

        <div class="flex justify-center gap-4"
             style="animation: scaleIn 0.5s ease-out 0.5s both;">
          <button
            @click="goToNewTransaction"
            class="group glass-elevated border-emerald/30 text-emerald font-semibold text-sm px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-emerald-glow hover:border-emerald/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2.5 cursor-pointer select-none"
          >
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nova Transacao
          </button>

          <button
            @click="goToExtrato"
            class="group glass-elevated border-cyan/30 text-cyan font-semibold text-sm px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-cyan-glow hover:border-cyan/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2.5 cursor-pointer select-none"
          >
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6M9 16h6" />
            </svg>
            Ver extrato completo
          </button>
        </div>
      </div>

      <div v-else-if="currentView === 'new-transaction'" key="new-transaction" class="flex flex-col gap-8">
        <div>
          <button
            @click="goToDashboard"
            class="group glass text-text-secondary hover:text-text-primary text-xs font-medium px-4 py-2 rounded-xl hover:bg-frost/30 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao dashboard
          </button>
        </div>

        <TransactionForm
          :editing-transaction="null"
          @saved="handleSaved"
        />
      </div>

      <div v-else key="extrato" class="flex flex-col gap-8">
        <div>
          <button
            @click="goToDashboard"
            class="group glass text-text-secondary hover:text-text-primary text-xs font-medium px-4 py-2 rounded-xl hover:bg-frost/30 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao dashboard
          </button>
        </div>

        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseChart />
          <CommitmentTimeline />
        </section>

        <PeriodSelector />

        <div v-if="!showForm" class="flex justify-end" style="animation: fadeInUp 0.4s ease-out both;">
          <button
            @click="showForm = true"
            class="glass-elevated border-emerald/30 text-emerald font-semibold text-sm px-5 py-2.5 rounded-2xl hover:shadow-lg hover:shadow-emerald-glow hover:border-emerald/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer select-none"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nova Transacao
          </button>
        </div>

        <TransactionForm
          v-if="showForm"
          :editing-transaction="editingTransaction"
          @saved="handleSaved"
        />

        <TransactionHistory
          :filter-category="filterCategory"
          :filter-type="filterType"
          :filter-date-start="filterDateStart"
          :filter-date-end="filterDateEnd"
          @update:filter-category="filterCategory = $event"
          @update:filter-type="filterType = $event"
          @update:filter-date-start="filterDateStart = $event"
          @update:filter-date-end="filterDateEnd = $event"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </Transition>

    <AppFooter />

    <ConfirmModal
      :visible="modalVisible"
      message="Tem certeza que deseja excluir esta transacao?"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelModal"
    />
  </div>
</template>
