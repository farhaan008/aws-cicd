<template>
  <div class="fixed top-3 right-3 max-w-sm h-0 space-y-2 z-50">
    <transition v-for="(toast, index) in toasts" :key="index" name="list" tag="div">
      <div class="flex relative w-full bg-white rounded-lg shadow-lg ring-1"
        :class="{ 'ring-green-800': toast.type === 'success', 'ring-red-800': toast.type === 'error', 'ring-yellow-800': toast.type === 'warning', 'ring-aqua-800': toast.type === 'info' }" key="list">
        <div class="flex items-center rounded-l-lg text-white justify-center w-12"
          :class="{ 'bg-green-800': toast.type === 'success', 'bg-red-800': toast.type === 'error', 'bg-yellow-800': toast.type === 'warning', 'bg-aqua-800': toast.type === 'info' }">
          <svg class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path v-if="toast.type === 'success'" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.293a1 1 0 00-1.414-1.414L9 10.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            <path v-if="toast.type === 'error'" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.293a1 1 0 00-1.414-1.414L9 10.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            <path v-if="toast.type === 'warning'" d="M10 .5C4.477.5.5 4.477.5 10S4.477 19.5 10 19.5s9.5-3.977 9.5-9.5S15.523.5 10 .5zm-.25 3h-.5v7h1v-7h-.5zm-.25 9h-.5v2h1v-2h-.5z" />
            <path v-if="toast.type === 'info'" d="M10 .5C4.477.5.5 4.477.5 10S4.47719 .5,10 .5s9.5,3.977,9.5,9.5S15.523,19,10,19s-9,3,9,3S19,15,19,10,15,3,10,.5zM11,14H9V12h2v2zm0-4H9V6h2v4z" />
          </svg>
        </div>
        <div class="flex-1 py-3 mr-4 ml-2 bg-white">
          <div class="font-semibold capitalize"
            :class="{ 'text-green-800': toast.type === 'success', 'text-red-800': toast.type === 'error', 'text-yellow-800': toast.type === 'warning', 'text-aqua-800': toast.type === 'info' }">
            {{ toast.title }}
          </div>
          <p>{{ toast.message }}</p>
        </div>
        <div class="flex items-center px-1.5">
          <svg @click="onCloseToast(index)" class="w-8 h-8 text-gray-800 dark:text-white relative -top-3" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { store } from '@/stores'
export default defineComponent({
  name: 'NotifyVue',
  setup() {
    const toasts = computed(() => store.app.getToasts )
    watch(() => toasts,() => {
      if (toasts.value.length > 0) {
        setTimeout(() => {
          store.app.clearToast(0);
        }, 5000)
      }
    },{ deep: true })

    const onCloseToast = (index: number) => {
      store.app.clearToast(index)
    }

    return {
      toasts,
      onCloseToast,
    }
  },
})
</script>

<style scoped>
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.list-enter-active {
  transition: all 0.3s ease;
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.list-leave-active {
  position: absolute;
  transition: all 0.3s ease;
}

.list-move {
  transition: transform 0.3s ease;
}

.switch-enter-active,
.switch-leave-active {
  transition: all 0.3s ease;
}
.switch-enter-from,
.switch-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.switch-leave-active {
  position: absolute;
  width: 100%;
}
</style>
