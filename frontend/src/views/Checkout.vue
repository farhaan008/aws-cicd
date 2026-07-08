<template>
  <div class="bg-white py-1 border-b border-gray-300 w-full">
    <div class="w-full lg:w-[80%] px-4 lg:px-0 mx-auto">
      <div class="flex gap-2 p-4">
        <router-link to="/" custom v-slot="{ navigate }">
          <span @click="navigate" class="-ml-3">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </span>
        </router-link>
        My Order
      </div>
    </div>
  </div>

  <div class="w-full lg:w-[80%] px-4 lg:px-0 mx-auto">
    <div class="flex flex-col gap-6 mt-4 md:flex-row min-h-[calc(100vh-100px)]">
      <div class="w-full md:w-[65%] border border-gray-200 rounded-lg">
        <div v-if="user.name" class="p-4 border-b border-gray-100">
          <h3 class="font-semibold">Customer</h3>
          <div class="flex justify-between items-center mt-2 text-gray-600 text-sm">
            <span>{{ user.name }}</span>
            <span>{{ user.mobile }}</span>
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-md font-semibold pb-4">Items in cart</h3>
          <cart-item></cart-item>
        </div>
      </div>
      <div class="w-full md:w-[35%] border border-gray-200 rounded-lg flex flex-col sm:relative sm:mb-0 sm:pb-0 justify-between" style="margin-bottom: 100px">
        <bill-detail></bill-detail>
      </div>
    </div>
  </div>
  <user-detail :show="show" @close="show = false" :modalClass="'max-w-md'" :showCloseButton="false"></user-detail>
  <NotifyVue></NotifyVue>
</template>

<script lang="ts">
import type { User } from '@/types/fos'
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import NotifyVue from  '@/components/elements/notify.vue'
import CartItem from '@/components/dashboard/cart-item.vue'
import BillDetail from '@/components/dashboard/bill-detail.vue'
import UserDetail from '@/components/modal/user-detail.vue'
import { store } from '@/stores'

export default defineComponent({
  components: { CartItem, BillDetail, UserDetail, NotifyVue },
  name: 'Checkout',
  setup() {
    const Obj = reactive({
      show: false,
      user: {} as User
    })

    onMounted(()=>{
      Obj.user = store.app.user;
      if(!Obj.user.name){
        Obj.show = true;
      }
    })

    return{
      ...toRefs(Obj)
    }
  }
})
</script>

<style></style>
