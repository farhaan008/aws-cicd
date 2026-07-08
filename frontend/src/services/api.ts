// types/api.ts

// export interface ApiResponse<T> {
//   status: 'success' | 'error';
//   statusCode: number;
//   message?: string;
//   data: T;
// }


// apiClient.ts

// class ApiClient {
//   request<TResponse>(
//     method: string,
//     url: string,
//     auth: boolean,
//     data?: any
//   ): Promise<ApiResponse<TResponse>> {
//     // Your axios/fetch call here...
//     return fetch(url, {
//       method,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(auth ? { Authorization: 'Bearer TOKEN' } : {}),
//       },
//       body: data ? JSON.stringify(data) : undefined,
//     }).then(async (res) => {
//       const json = await res.json();
//       return json as ApiResponse<TResponse>;
//     });
//   }
// }


// export interface OrderItemStatusUpdate {
//   order_id: number;
//   item_id: number;
//   kitchen_status: 'queued' | 'preparing' | 'ready' | 'served';
// }

// updateOrderItemStatus = (
//   orderId: string,
//   itemId: string,
//   params: KitchenStatus
// ): Promise<ApiResponse<OrderItemStatusUpdate>> => {
//   return this.request<OrderItemStatusUpdate>(
//     'put',
//     `api/order/${orderId}/item/${itemId}/status`,
//     true,
//     params
//   );
// };

// const result = await api.updateOrderItemStatus('10', '5', {
//   kitchen_status: 'ready'
// });

// console.log(result.data.kitchen_status);
