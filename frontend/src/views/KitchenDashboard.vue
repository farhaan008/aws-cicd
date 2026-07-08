<template>
    <div class="w-full">
      <div v-if="kitchenOrders && kitchenOrders.length" class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-if="filteredOrders && filteredOrders.length">
          <div v-for="item in filteredOrders" :key="item.order_id" class="flex justify-center items-center border border-gray-300 rounded-md p-3">
            <div class="flex justify-between w-full flex-col gap-4 h-full">
              <h3 class="text-lg text-black-700 font-semibold">Order: {{ item.order_id }}</h3>
              <ul class="list-none border-t border-b border-gray-300 p-3">
                <li v-for="i in item.items" :key="i.id" class="w-full border-gray-200 dark:border-gray-600">
                  <div class="flex items-center space-x-4">
                    <label :for="`${i.id}`" class="flex justify-between w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      <span>{{ i.item_name}}</span>
                      <div class="flex flex-inline space-x-3">
                        <span v-if="i.item_size">{{ i.item_size }}</span>
                        <span>{{ i.quantity }}</span>
                      </div>
                    </label>
                    <input :id="`${i.id}`" v-model="i._isReady"
                    :disabled="i.kitchen_status === 'queued' || i.kitchen_status === 'ready' || i.kitchen_status === 'served'"
                    type="checkbox" value="" class="w-6 h-6 ms-3">
                  </div>
                </li>
              </ul>
              <div class="flex justify-between space-x-6">
                <button class="bg-red-300 hover:bg-red-400 text-black text-sm font-medium py-2 px-4 rounded-md border border-gray-600 focus:outline-none"
                  :disabled="checkOrderItemStatus(item.items) !== 'queued'"
                  :class="checkOrderItemStatus(item.items) !== 'queued'? 'cursor-not-allowed':''">
                  Cancel
                </button>
                <button class="bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2 px-6 rounded-md border border-gray-900 focus:outline-none"
                  @click="updateOrderItemAndOrderStatus(`${item.order_id}`, item.items)"
                  :disabled="isActionButtonDisabled(item.items)"
                  :class="{'opacity-80 cursor-not-allowed': isActionButtonDisabled(item.items) }">
                  {{ getBtnStatusText(item.items) }}
                </button>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="col-span-full">
          <p class="text-md text-center py-3">No results found for the selected filters.</p>
        </div>
      </div>
      <div v-else>
        <p class="text-md py-3 text-center">There are no orders today</p>
      </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { store } from '@/stores'
import type { OrderItem, ApiResponse } from '@/types/fos';
import { useKitchenOrdersFilter } from '@/composables/useKitchenOrdersFilter';
import { useOrderSearch } from '@/composables/useOrderSearch'
import { showToast } from '@/utils/common/common-functions'
import { COREAPI } from '@/services';
import { io } from 'socket.io-client'
const socket = io(import.meta.env.VITE_API_URL)

export default defineComponent({
  components: { },
  name: 'KitchenDashboard',
  setup() {

    const searchVal = computed(() => store.app.getSearchVal)
    const filterStatus = computed(() => store.app.kitchenFilterVal);
    const kitchenOrders = computed(() => store.app.getKitchenOrderItems);
    const filteredOrders = computed(() => {
      if(searchVal.value){
        return useOrderSearch(kitchenOrders.value, searchVal.value)
      }
      if(filterStatus.value){
        return useKitchenOrdersFilter(kitchenOrders.value, filterStatus.value)
      }else{
        return kitchenOrders.value;
      }
    })


    onMounted(() => {
      store.app.getKitchenOrders();
      socket.on('order_update', (updatedOrder) => {
        console.log('Received order update via WebSocket:', updatedOrder);
        store.app.getKitchenOrders();
      })
    })

    const updateOrderItemAndOrderStatus = (orderId:string, items:OrderItem[]) => {
      const kitchen_status = checkOrderItemStatus(items) as 'queued' | 'preparing' | 'ready' | 'served';
      const params = { kitchen_status: kitchen_status }
      if(kitchen_status === 'queued'){
        params.kitchen_status = 'preparing';
      }
      if(kitchen_status === 'preparing'){
        params.kitchen_status = 'ready';
      }
      if(kitchen_status === 'ready'){
        params.kitchen_status = 'served';
      }
      COREAPI.updateOrderItemAndOrderStatus(orderId, params).then((response:ApiResponse) => {
        if(response && response.statusCode === 200){
          showToast(response.message, true )
        }
        store.app.getKitchenOrders();
      }).catch((e) => {
        showToast(e.message, false)
        console.log(e.error)
      });

    }


    const checkOrderItemStatus = (items:OrderItem[]) => {
      if(items.every(e=> e.kitchen_status === 'queued')){
        return 'queued';
      }
      if(items.every(e=> e.kitchen_status === 'ready')){
        return 'ready';
      }
      if(items.every(e=> e.kitchen_status === 'served')){
        return 'served';
      }
      if(items.some(e=> e.kitchen_status === 'preparing')){
        return 'preparing';
      }
      return 'queued';
    }

    const getBtnStatusText = (items:OrderItem[]) => {
      if(items && items.length){
        const status =  checkOrderItemStatus(items);
        switch (status) {
          case 'queued': return 'Start';
          case 'preparing': return 'Ready';
          case 'ready': return 'Complete';
          case 'served': return 'Served';
          default: return 'Queued';
        }
      }
    }

    const isActionButtonDisabled = (items: OrderItem[]): boolean => {
      const status = checkOrderItemStatus(items);
      if(status === 'served'){
        return true;
      }
      if(status === 'preparing' && !isAllItemChecked(items)){
        return true;
      }
      return false;
    }

    const isAllItemChecked = (items:OrderItem[]): boolean => {
      return items.every((e)=> e._isReady === true )
    }

    return {
      kitchenOrders,
      filteredOrders,
      getBtnStatusText,
      isAllItemChecked,
      checkOrderItemStatus,
      isActionButtonDisabled,
      updateOrderItemAndOrderStatus
    }
  }
})
</script>

<!-- const updateOrderItemKitchenStatus = (orderId:any, orderItem:OrderItem) => {
  console.log(orderId, orderItem);
  if(orderItem.kitchen_status === 'preparing'){
    let params = { kitchen_status: 'ready' } as KitchenStatus
    COREAPI.updateOrderItemKitchenStatus(orderId, orderItem.id, params).then((response:ApiResponse) => {
      console.log(response);
      if(response && response.statusCode){
        console.log(response.message)
      }
    }).catch((e) => { console.log(e) } );
    store.app.getKitchenOrders();
  }
} -->

<!-- function getOrderStatus(itemStatuses) {
  if (itemStatuses.every(s => s === 'ready' || s === 'served')) return 'completed';
  if (itemStatuses.every(s => s === 'queued')) return 'queued';
  if (itemStatuses.some(s => s === 'preparing')) return 'preparing';
  return 'in_progress';
} -->

<!-- <button
  v-for="item in order.items"
  :key="item.id"
  @click="toggleStatus(order.orderId, item.id, item.status)"
  :class="[
    'px-4 py-2 rounded',
    item.status === 'Ready' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
  ]"
>
  {{ item.name }}: {{ item.status }}
</button> -->
<!-- const toggleStatus = async (orderId, itemId, currentStatus) => {
  const newStatus = currentStatus === 'Preparing' ? 'Ready' : 'Preparing'
  await fetch(`http://localhost:3000/orders/${orderId}/items/${itemId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  })
} -->



<!-- SELECT
    o.id AS order_id,
    o.created_at,
    oi.id AS order_item_id,
    oi.quantity,
    oi.kitchen_status,
    m.name AS item_name,
    u.name AS customer_name
FROM
    orders o
JOIN
    order_items oi ON o.id = oi.order_id
JOIN
    menu_items m ON oi.item_id = m.id
JOIN
    users u ON o.user_id = u.id
WHERE
    o.status IN ('confirmed', 'in_progress')
    AND oi.kitchen_status IN ('queued', 'preparing', 'ready')
ORDER BY
    o.created_at ASC, oi.kitchen_status ASC; -->
