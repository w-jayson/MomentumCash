<script setup>
import AnimatedCounter from './AnimatedCounter.vue'

const props = defineProps({
  label: { type: String, required: true },
  amount: { type: Number, required: true },
  variant: { type: String, default: 'balance', validator: (v) => ['balance', 'income', 'expense'].includes(v) },
})

const colorMap = {
  balance: { text: 'text-cyan', glow: 'text-glow-cyan', box: 'box-glow-cyan' },
  income: { text: 'text-emerald', glow: 'text-glow-emerald', box: 'box-glow-emerald' },
  expense: { text: 'text-coral', glow: 'text-glow-coral', box: 'box-glow-coral' },
}
</script>

<template>
  <div
    class="glass p-6 flex flex-col gap-1 hover:scale-[1.02] transition-transform duration-300"
    :class="colorMap[variant].box"
  >
    <span class="text-xs text-text-secondary uppercase tracking-widest font-medium">
      {{ label }}
    </span>
    <span
      class="text-2xl font-bold font-mono tabular-nums"
      :class="[colorMap[variant].text, colorMap[variant].glow]"
    >
      <AnimatedCounter :target="amount" :duration="800" />
    </span>
  </div>
</template>
