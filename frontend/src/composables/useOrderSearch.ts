import type { KitchenDashboard } from '@/types/fos'

export function useOrderSearch(orders: Array<KitchenDashboard>, searchString: string): KitchenDashboard[] {

  const term = searchString.trim().toLowerCase()
  if (!term) return orders

  const filtered = orders.filter(order => {
    const idMatch = String(order.order_id) === term;
    const statusMatch = order.order_status.toLowerCase().includes(term);
    return idMatch || statusMatch;
  });

  return filtered;
}

