<template>
  <transition name="fade">
    <div v-if="isVisible" class="modal fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-3">
      <div :class="getClasses()" class="w-full mx-auto overflow-y-auto relative -top-[10%] bg-white rounded-xl shadow-lg">
        <div class="modal-header flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <slot name="title"></slot>
          </div>
          <button v-if="showCloseButton" @click="closeModal" class="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg class="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
        </div>
        <div class="modal-body p-4">
          <slot name="body"></slot>
        </div>
        <div v-if="showFooter" class="modal-footer p-4 border-t border-gray-200 flex flex-wrap gap-2 justify-center">
          <slot name="footer">
            <button @click="confirmAction" class="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded-md focus:outline-none">Confirm</button>
            <button @click="closeModal" class="bg-gray-10 hover:bg-gray-100 text-black text-sm font-medium py-2 px-4 rounded-sm border border-gray-400 focus:outline-none">Close</button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VueModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Title',
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: 'md', // 'sm', 'md', 'lg', 'xl'
    },
    modalClass: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close')
    }
    const confirmAction = () => {
      emit('confirm')
    }

    const getClasses = () => {
      return `${props.modalClass}`;
      // const baseClasses = props.width ? `max-w-[${props.width}]` : 'max-w-auto' // props.width ? `md: ${props.width}` : 'md:w-auto';
      // return `${baseClasses} ${props.modalClass}`
      // return `modal-content ${baseClasses} ${props.modalClass}`;
      // return `modal-content ${props.width === 'sm' ? 'max-w-sm' : props.width === 'lg' ? 'max-w-lg' : props.width === 'xl' ? 'max-w-xl' : 'max-w-md'} ${props.modalClass}`;
    }
    return { closeModal, confirmAction, getClasses }
  },
})
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.modal-container {
  max-height: calc(100vh - 2rem);
}
</style>
