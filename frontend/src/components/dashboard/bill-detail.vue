<template>
  <div class="p-4 border-b border-gray-100">
    <div class="border-b border-gray-200 pb-4">
      <h3 class="font-semibold">Bill Details</h3>
      <div class="flex justify-between items-center mt-2 text-gray-600 text-sm">
        <span>Item Total</span>
        <span>₹ {{cartTotal}}</span>
      </div>
    </div>
    <div class="flex justify-between items-center mt-2 text-gray-600 text-md font-semibold">
      <span>To Pay</span>
      <span>₹ {{cartTotal}}</span>
    </div>
  </div>
  <div v-if="cartTotal" class="fixed bottom-0 left-0 w-full sm:static sm:w-auto bg-white border-t border-gray-200 p-4 space-y-2">
    <button @click="createOrder()" class="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-3 px-4 rounded-full focus:outline-none cursor-pointer w-full uppercase">
      Create Order
    </button>
    <!-- <button @click="makePayment()" class="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-3 px-4 rounded-full focus:outline-none cursor-pointer w-full uppercase">
      Make Payment
    </button> -->
  </div>
  <payment-qr :qr="qr" :show="show" @close="show = false" :showFooter="false" :modalClass="'max-w-md'"></payment-qr>
</template>
<script lang="ts">
import { defineComponent, type PropType, toRefs, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import PaymentQr from '@/components/modal/payment-qr.vue'
import type { MenuItem, Order, UpdateOrder, ApiResponse, createOrderResponse } from '@/types/fos'
import { store } from '@/stores'
import { COREAPI } from '@/services'
import { showToast } from '@/utils/common/common-functions'

export default defineComponent({
  name: 'BillDetail',
  components: { PaymentQr },
  props: {
    item: {
      type: Object as PropType<MenuItem>,
      required: false,
    },
  },
  setup() {
    const router = useRouter()
    const cartTotal = computed(() => store.app.cartTotal)
    const Obj = reactive({
      show: false,
      qr: '' as string
    })

    const getPaymentQr = () => {
      if(cartTotal.value){
        COREAPI.getPaymentQr({amount: cartTotal.value}).then((response:unknown) => {
          console.log(response);
          // Obj.qr = response?.qr;
          Obj.show = !Obj.show
        }).catch((error) => {
          console.error('Error fetching menu:', error)
        })
      }else{
        console.log('Cart is empty...');
      }
    }

    const makePayment = () => {
      getPaymentQr();
    }

    const createOrder = () => {
      if(cartTotal.value){
        const { name, mobile } = store.app.user;
        const items = store.app.cart;
        const params = { name, mobile, items } as Order
        console.log(params);
        COREAPI.createOrder(params).then((response:ApiResponse<createOrderResponse>) => {
          console.log(response);
          if(response && response.statusCode === 200){
            console.log(response.data.orderId);
            updateOrder(response.data.orderId);
            showToast(response.message, true)
            router.push('/');
            store.app.clearCart();
          }
        }).catch((e) => {
          showToast(e.message, false)
          console.error('Error fetching menu:', e.error)
        })
      }else{
        console.log('Cart is empty...');
      }
    }

    const updateOrder = (orderId: number) => {
      const params = { status: 'confirmed', payment_status: 'paid' } as UpdateOrder
      COREAPI.updateOrder(orderId, params).then(() => {
        // const typedResponse = response as ApiResponse<unknown>;
        // if(typedResponse && typedResponse.statusCode === 200){}
      }).catch((e) => {
        showToast(e.message, false)
        console.error('Error updating order:', e.error)
      })
    }

    return {
      ...toRefs(Obj),
      makePayment,
      cartTotal,
      createOrder
    }
  }

})
</script>
<style scoped>

</style>

