<template>
  <Modal :isVisible="show" @cancel="close()">
    <template #title>
      <h3 class="text-lg font-semibold capitilize">Payment</h3>
    </template>
    <template #body>
      <div class="mx-auto rounded-md">
        <img :src="qr" class="mx-auto" alt="UPI QR Code" />
      </div>
    </template>
    <template #footer>
      <button @click="confirm" class="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded-md focus:outline-none">Confirm</button>
      <button @click="close" class="bg-gray-10 hover:bg-gray-100 text-black text-sm font-medium py-2 px-4 rounded-sm border border-gray-400 focus:outline-none">Close</button>
    </template>
  </Modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Modal from '@/components/global/modal.vue'
export default defineComponent({
  name: 'PaymentQr',
  components: {
    Modal,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    qr: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const close = () => {
      emit('close', false)
    }
    const confirm = () => {
      // emit('confirm')
      close()
    }
    return {
      close,
      confirm,
    }
  },
})
</script>
<style scoped>

</style>
<!-- <Modal-Example :show="show" @close="show=false"></Modal-Example>
import ModalExample from './ModalExample.vue'; -->
