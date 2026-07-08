export interface Menu {
  [key: string]: MenuItem[]
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: number | null
  categoryName: string | null
  available: boolean
  sizeId?: number
  sizes?: Sizes[],
  prices?: Prices[]
}

export interface Sizes {
  sizeId: number,
  size: string
}
export interface Prices {
  sizeId: number,
  price: number
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface User {
  name: string | null,
  mobile?: string | number | null
}

export interface Order {
  name?: string,
  mobile?: number | string,
  items: MenuItem[]
  [key: string]: unknown
}

export interface OrderItem {
  id: number;
  item_name: string;
  item_size: string | null;
  quantity: number;
  kitchen_status: TypeKitchenStatus;
  _isReady?: boolean;
}


export interface KitchenStatus {
  kitchen_status: 'queued' | 'preparing' | 'ready' | 'served';
  [key: string]: unknown;
}
export type TypeKitchenStatus = 'queued' | 'preparing' | 'ready' | 'served';


export interface KitchenDashboard {
  order_id: number;
  order_status: string,
  created_at: string | Date;
  items: OrderItem[];
}

export type PayloadData = {
  [key: string]: string | number | boolean | null | undefined | PayloadData | PayloadData[]; // recursive
};

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  status: 'success' | 'error' | string;
  statusCode: number;
}

export interface UpdateOrder {
  status: string;
  payment_status: string;
}

export interface createOrderResponse {
  orderId: number;
}

export interface OrderDashboard {
  order_id: number;
  customer_name: string;
  created_at: string; // You can change this to `Date` if you parse it
  order_status: string;
  payment_status: string;
  items: OrderDashboardItem[];
}
export interface OrderDashboardItem {
  item_name: string;
  item_size: string | null;
  quantity: number;
  kitchen_status: string;
}

export interface KitchenDashboard {
  order_id: number;
  order_status: string;
  created_at: string | Date; // Or `Date` if parsed
  items: OrderItem[];
}
export interface KitchenDashboardItem {
  id: number;
  item_name: string;
  item_size: string | null;
  quantity: number;
  kitchen_status: string;
}

// export interface ApiResponse {
//   status: 'success' | 'error' | string;
//   message: string;
//   data: {
//     order_id: string;
//     item_id: string;
//     kitchen_status: 'queued' | 'preparing' | 'ready' | 'served' | string;
//   };
//   statusCode: number;
// }



