<script setup>
import { ref, watch, computed } from 'vue'
import { useFormat } from '../composables/useFormat.js'

const props = defineProps({
  target: { type: Number, required: true },
  duration: { type: Number, default: 800 },
})

const { formatCurrency } = useFormat()

const current = ref(props.target)
let animFrame = null

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function animate(from, to) {
  if (animFrame) cancelAnimationFrame(animFrame)
  const start = performance.now()

  function step(timestamp) {
    const elapsed = timestamp - start
    const progress = Math.min(elapsed / props.duration, 1)
    const eased = easeOutExpo(progress)
    current.value = from + (to - from) * eased

    if (progress < 1) {
      animFrame = requestAnimationFrame(step)
    }
  }

  animFrame = requestAnimationFrame(step)
}

watch(() => props.target, (newVal, oldVal) => {
  if (oldVal === undefined || oldVal === newVal) {
    current.value = newVal
    return
  }
  animate(oldVal, newVal)
}, { immediate: true })
</script>

<template>
  <span>{{ formatCurrency(current) }}</span>
</template>
