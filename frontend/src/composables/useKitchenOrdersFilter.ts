import type { KitchenDashboard } from '@/types/fos'


export function useKitchenOrdersFilter(orders:KitchenDashboard[], filterStatus:string) {
  if(filterStatus){
    if (filterStatus === 'all') {
      return orders
    }
    if (filterStatus === 'new') {
      return orders.filter((order:KitchenDashboard) => order.order_status === 'confirmed')
    }
    if (filterStatus === 'preparing') {
      return orders.filter(order => order.order_status === 'preparing')
    }
    if (filterStatus === 'ready') {
      return orders.filter(order => order.order_status === 'ready')
    }
    if( filterStatus === 'served') {
      return orders.filter(order => order.order_status === 'served')
    }
  }
  return orders as KitchenDashboard[]
}





// import { computed } from 'vue'
// export function useFilteredOrders(orders, filterStatus) {
//   const filteredOrders = computed(() => {
//     if (filterStatus.value === 'all') {
//       return orders.value
//     }
//     if (filterStatus.value === 'new') {
//       return orders.value.filter(order => order.order_status === 'confirme')
//     }
//     if (filterStatus.value === 'preparing') {
//       return orders.value.filter(order => order.order_status === 'preparing')
//     }
//     if (filterStatus.value === 'ready') {
//       return orders.value.filter(order => order.order_status === 'ready')
//     }
//     return []
//   })
//   return {
//     filteredOrders
//   }
// }


