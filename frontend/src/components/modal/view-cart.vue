<template>
  <Modal :isVisible="show">
    <template #title>
      <h3 class="text-lg font-semibold capitilize">My Cart</h3>
    </template>
    <template #body>
      <cart-item @close="close()"></cart-item>
    </template>
    <template #footer>
      <div class="flex gap-4">
        <router-link to="/checkout" custom v-slot="{ navigate }">
          <button @click="navigate" class="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded-md focus:outline-none">Checkout</button>
        </router-link>
        <button @click="close" class="bg-gray-10 hover:bg-gray-100 text-black text-sm font-medium py-2 px-4 rounded-md border border-gray-400 focus:outline-none">Close</button>
      </div>
    </template>
  </Modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Modal from '@/components/global/modal.vue'
import CartItem from '@/components/dashboard/cart-item.vue'

export default defineComponent({
  name: 'ViewCart',
  components: {
    Modal,
    CartItem
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, { emit }) {

    const close = () => {
      emit('close')
    }

    return {
      close,
    }
  },
})
</script>
<style scoped>
</style>
