<template>
  <div class="bg-gray-900 w-full h-screen px-3">
    <div class="flex flex-col gap-y-3 py-3 px-4 h-full">
      <div class="flex justify-between items-center gap-y-2 py-3 px-4 rounded-lg">
        <div class="text-2xl font-bold text-gray-100">RR Cafe</div>
        <div class="flex flex-col text-gray-100">
          <h3 class="text-lg">Order Dashboard</h3>
          <p class="text-xs">A list of customers order</p>
        </div>
      </div>
      <div class="relative overflow-x-auto">
          <table class="w-full text-left text-gray-200">
              <thead class="text-md uppercase bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-5 rounded-s-lg">Order ID</th>
                  <th scope="col" class="px-6 py-5">Customer Name</th>
                  <th scope="col" class="px-6 py-5">Order Status</th>
                  <th scope="col" class="px-6 py-5 rounded-e-lg">Created Time</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="customersOrder && customersOrder.length">
                  <tr v-for="(item, index) in customersOrder"
                    :key="item.order_id"
                    :class="index !== customersOrder.length-1 ? 'border-b': ''"
                    class="text-lg font-medium bg-gray-900 border-gray-800">
                    <th scope="row" class="whitespace-nowrap px-6 py-4 ">{{ item.order_id }}</th>
                    <td class="px-6 py-4">{{ item.customer_name}}</td>
                    <td class="px-6 py-4 capitalize">{{ item.order_status }}</td>
                    <td class="px-6 py-4">{{ formatTo12HourTime(item.created_at) }}</td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="4" class="py-3 text-center text-white">There are no orders today</td>
                </tr>
              </tbody>
          </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useTimeFormatter } from '@/composables/useTimeFormatter';
import { store } from '@/stores'
import { io } from 'socket.io-client'
const socket = io(import.meta.env.VITE_API_URL)

export default defineComponent({
  components: { },
  name: 'OrderDashboard',
  setup() {

    const { formatTo12HourTime } = useTimeFormatter();
    const customersOrder = computed(() => store.app.getCustomerOrderItems);
    onMounted(() => {
      store.app.getCustomerOrders();
      socket.on('order_update', (updatedOrder) => {
        console.log('Order update received:', updatedOrder);
        store.app.getCustomerOrders();
      })
    })

    return {
      customersOrder,
      formatTo12HourTime
    }
  }
})
</script>

<!-- function getOrderStatus(itemStatuses) {
  if (itemStatuses.every(s => s === 'ready' || s === 'served')) return 'completed';
  if (itemStatuses.every(s => s === 'queued')) return 'queued';
  if (itemStatuses.some(s => s === 'preparing')) return 'preparing';
  return 'in_progress';
} -->
