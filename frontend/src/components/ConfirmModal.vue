<script setup>
defineProps({
  visible: Boolean,
  message: String,
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 bg-void/70 backdrop-blur-sm flex justify-center items-center z-50 px-4"
        @click.self="emit('cancel')"
      >
        <div class="glass-elevated p-6 min-w-[320px] max-w-md text-center rounded-2xl" style="animation: scaleIn 0.25s ease-out forwards;">
          <p class="text-text-primary text-base mb-5">{{ message }}</p>
          <div class="flex justify-center gap-3">
            <button
              @click="emit('confirm')"
              class="bg-coral text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-coral/80 transition-all duration-200 hover:shadow-lg hover:shadow-coral-glow"
            >
              Excluir
            </button>
            <button
              @click="emit('cancel')"
              class="bg-steel text-text-primary font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-frost transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
