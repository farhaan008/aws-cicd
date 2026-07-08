import type { Notify } from '@/types/elements/notify'
import type { State } from './state'
import type { Menu, CartItem, User } from '@/types/fos'
export const getters = {
  isLoading: (state: State): boolean => state.apiLoading,
  getToasts: (state: State): Notify[] => state.toasts,

  getMenuItems: (state: State): Menu => {
    return state.menuItems || {}
  },
  getCartItems: (state: State): CartItem[] => {
    return state.cart || []
  },
  cartTotal: (state: State) => (state.cart ?? []).reduce((total, item) => total + item.price * item.quantity, 0),
  cartCount: (state: State) => (state.cart ?? []).reduce((count, item) => count + item.quantity, 0),
  getItemQuantity: (state: State) => {
    return (id: number, sizeId?: number) => {
      const item = state.cart.find((i) =>
        sizeId !== undefined ? i.id === id && i.sizeId === sizeId : i.id === id
      );
      return item?.quantity ?? 0;
    };
  },
  getSearchVal: (state: State) => state.searchVal,
  getUser: (state: State): User => state.user,

  getCustomerOrderItems: (state: State): any => {
    return state.customerOrderItems;
  },
  getKitchenOrderItems: (state: State): any => {
    return state.kitchenOrderItems;
  }

}
