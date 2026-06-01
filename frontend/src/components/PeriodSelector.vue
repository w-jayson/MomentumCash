<script setup>
import { computed } from 'vue'
import { useTransactions } from '../composables/useTransactions.js'

const { activePeriod, getPeriodLabel } = useTransactions()

const PRESET_LABELS = {
  'current-month': 'Mes Atual',
  'last-3': 'Ultimos 3 meses',
  'last-6': 'Ultimos 6 meses',
  'last-12': 'Ultimo ano',
  'next-3': 'Proximos 3 meses',
  'next-6': 'Proximos 6 meses',
  'next-12': 'Proximo ano',
  'custom': 'Personalizado...',
}

const periodMode = computed({
  get: () => {
    if (activePeriod.value.mode === 'current-month') return 'current-month'
    if (activePeriod.value.mode === 'custom') {
      const now = new Date()
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      const toDateStr = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      if (activePeriod.value.startDate && activePeriod.value.endDate) {
        const s = new Date(activePeriod.value.startDate)
        const e = new Date(activePeriod.value.endDate)

        const threeAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        if (toDateStr(s) === toDateStr(threeAgo) && isSameDay(e, endOfMonth)) return 'last-3'

        const sixAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
        if (toDateStr(s) === toDateStr(sixAgo) && isSameDay(e, endOfMonth)) return 'last-6'

        const twelveAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)
        if (toDateStr(s) === toDateStr(twelveAgo) && isSameDay(e, endOfMonth)) return 'last-12'

        const next3Start = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const next3End = new Date(now.getFullYear(), now.getMonth() + 3, 0)
        if (toDateStr(s) === toDateStr(next3Start) && isSameDay(e, next3End)) return 'next-3'

        const next6Start = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const next6End = new Date(now.getFullYear(), now.getMonth() + 6, 0)
        if (toDateStr(s) === toDateStr(next6Start) && isSameDay(e, next6End)) return 'next-6'

        const next12Start = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        const next12End = new Date(now.getFullYear(), now.getMonth() + 12, 0)
        if (toDateStr(s) === toDateStr(next12Start) && isSameDay(e, next12End)) return 'next-12'
      }
      return 'custom'
    }
    return 'current-month'
  },
  set: (val) => {
    if (val === 'current-month') {
      activePeriod.value = { mode: 'current-month', startDate: null, endDate: null }
    } else if (val === 'last-3') {
      const now = new Date()
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
      activePeriod.value = { mode: 'custom', startDate: start.toISOString(), endDate: end.toISOString(), preset: 'last-3' }
    } else if (val === 'last-6') {
      const now = new Date()
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
      activePeriod.value = { mode: 'custom', startDate: start.toISOString(), endDate: end.toISOString(), preset: 'last-6' }
    } else if (val === 'last-12') {
      const now = new Date()
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      const start = new Date(now.getFullYear(), now.getMonth() - 11, 1)
      activePeriod.value = { mode: 'custom', startDate: start.toISOString(), endDate: end.toISOString(), preset: 'last-12' }
    } else if (val === 'next-3') {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 3, 0)
      activePeriod.value = { mode: 'custom', startDate: start.toISOString(), endDate: end.toISOString(), preset: 'next-3' }
    } else if (val === 'next-6') {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 6, 0)
      activePeriod.value = { mode: 'custom', startDate: start.toISOString(), endDate: end.toISOString(), preset: 'next-6' }
    } else if (val === 'next-12') {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 12, 0)
      activePeriod.value = { mode: 'custom', startDate: start.toISOString(), endDate: end.toISOString(), preset: 'next-12' }
    } else if (val === 'custom') {
      activePeriod.value = { mode: 'custom', startDate: activePeriod.value.startDate || null, endDate: activePeriod.value.endDate || null, preset: null }
    }
  }
})

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const customStart = computed({
  get: () => activePeriod.value.startDate ? new Date(activePeriod.value.startDate).toISOString().slice(0, 10) : '',
  set: (val) => {
    activePeriod.value = {
      mode: 'custom',
      preset: null,
      startDate: val ? new Date(val + 'T00:00:00').toISOString() : activePeriod.value.startDate,
      endDate: activePeriod.value.endDate,
    }
  }
})

const customEnd = computed({
  get: () => activePeriod.value.endDate ? new Date(activePeriod.value.endDate).toISOString().slice(0, 10) : '',
  set: (val) => {
    activePeriod.value = {
      mode: 'custom',
      preset: null,
      startDate: activePeriod.value.startDate,
      endDate: val ? new Date(val + 'T23:59:59').toISOString() : activePeriod.value.endDate,
    }
  }
})

const isCustom = computed(() => periodMode.value === 'custom')

const selectedLabel = computed(() => PRESET_LABELS[periodMode.value] || 'Personalizado...')
</script>

<template>
  <div class="glass-elevated p-4 flex items-center gap-3 flex-wrap"
       style="animation: fadeInUp 0.6s ease-out 0.25s both;">
    <span class="text-xs text-text-secondary uppercase tracking-wider font-medium">Periodo</span>
    <select
      v-model="periodMode"
      class="bg-midnight border border-steel text-text-primary text-xs rounded-xl px-3 py-2 input-glow transition-all duration-200 appearance-none cursor-pointer"
    >
      <option value="current-month">Mes Atual</option>
      <optgroup label="Passado">
        <option value="last-3">Ultimos 3 meses</option>
        <option value="last-6">Ultimos 6 meses</option>
        <option value="last-12">Ultimo ano</option>
      </optgroup>
      <optgroup label="Futuro">
        <option value="next-3">Proximos 3 meses</option>
        <option value="next-6">Proximos 6 meses</option>
        <option value="next-12">Proximo ano</option>
      </optgroup>
      <option value="custom">Personalizado...</option>
    </select>
    <template v-if="isCustom">
      <span class="text-xs text-text-secondary">de</span>
      <input
        type="date"
        :value="customStart"
        @input="(e) => customStart = e.target.value"
        class="bg-midnight border border-steel text-text-primary text-xs rounded-xl px-3 py-2 input-glow transition-all duration-200"
      />
      <span class="text-xs text-text-secondary">ate</span>
      <input
        type="date"
        :value="customEnd"
        @input="(e) => customEnd = e.target.value"
        class="bg-midnight border border-steel text-text-primary text-xs rounded-xl px-3 py-2 input-glow transition-all duration-200"
      />
    </template>
  </div>
</template>
