import { Axios } from '@/plugins/http-common'
import type { Menu, Order, KitchenStatus, UpdateOrder, ApiResponse, createOrderResponse, OrderDashboard, KitchenDashboard } from '@/types/fos'
import { type PayloadData } from '../plugins/http.types'


class Core extends Axios {

  getMenu = (): Promise<Menu> => this.request('get', 'api/menu', true);

  createOrder = (params:Order): Promise<ApiResponse<createOrderResponse>> => {
    return this.request('post', 'api/order', true, params as unknown as PayloadData);
  }

  updateOrder = (orderId: number, params:UpdateOrder): Promise<unknown> => {
    return this.request('put', `api/order/${orderId}`, true, params as unknown as PayloadData);
  }

  getCustomerOrders = (): Promise<OrderDashboard> => this.request('get', 'api/order', true);

  getKitchenOrders = (): Promise<KitchenDashboard> => this.request('get', 'api/kitchen-dashboard', true);


  getPaymentQr = (params:unknown): Promise<unknown> => {
    return this.request('post', 'api/generate-qr', true, params as unknown as PayloadData);
  }

  updateOrderItemKitchenStatus = (orderId: string, itemId: number, params: KitchenStatus): Promise<unknown> =>{
    return this.request('put', `api/order/${orderId}/item/${itemId}/status`, true, params as unknown as PayloadData)
  }

  updateOrderItemAndOrderStatus = (orderId: string, params: KitchenStatus): Promise<unknown> => {
    return this.request('put', `api/order/${orderId}/item/status`, true, params as unknown as PayloadData)
  }

}

export const COREAPI = new Core()
