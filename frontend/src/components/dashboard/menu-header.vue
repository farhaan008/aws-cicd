
<template>
  <div class="grid grid-cols-[40px_1fr] grid-rows-2 md:grid-cols-2 sm:grid-rows-1 gap-4 p-4">
    <div class="md:hidden col-start-1 row-start-1 flex items-center">
      <div @click="toggleNavbar" class="flex lg:hidden md:hidden sm:block">
        <svg class="w-8 h-8 text-gray-800 dark:text-white" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14" />
        </svg>
      </div>
    </div>

    <div v-if="cartItems.length" class="col-start-2 row-start-1 md:col-start-3 text-right">
      <div class="flex flex-inline items-center justify-end gap-4">
        <div class="flex items-center justify-end">
          <button
            @click="show = !show"
            class="flex items-center gap-2 px-4 py-2.5 text-black bg-gray-10 hover:bg-gray-50 focus:outline-none font-medium rounded-full border border-gray-300 cursor-pointer shadow-lg"
          >
            <span class="relative">
              <span class="bg-red-700 text-white rounded-full size-5 flex items-center justify-center text-xs absolute -top-4 left-2">{{ cartCount }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </span>
            <span class="flex flex-inline items-center gap-2">
              &#8377; {{ cartTotal }}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
          </button>
        </div>
        <div class="flex items-center justify-end">
          <router-link to="/checkout" custom v-slot="{ navigate }">
            <button
              @click="navigate"
              type="button" class="flex items-center gap-3 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-full text-sm px-4 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 cursor-pointer shadow-lg">
              Checkout
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <div class="col-span-2 row-start-2 md:col-start-1 md:col-span-2 md:row-start-1 flex justify-center">
      <input @input="onSearch($event)" type="text" placeholder="Search" class="w-full lg:w-2/3 border border-gray-300 px-4 py-2 rounded-full focus:outline-none" />
    </div>
  </div>
   <view-cart :show="show" @close="show = false" :modalClass="'max-w-2xl'"></view-cart>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, reactive, computed } from 'vue'
import ViewCart from '@/components/modal/view-cart.vue'
import { store } from '@/stores'

export default defineComponent({
  name: 'MenuHeader',
  components: { ViewCart },
  props: {
    navExpand: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ['toggleNavbar'],
  setup(_, { emit }) {

    const debounceTimer = ref<number | null>(null)
    const showLogout = ref(false)
    const Obj = reactive({
      show: false,
    })

    const cartItems = computed(() => store.app.getCartItems)
    const cartCount = computed(() => store.app.cartCount)
    const cartTotal = computed(() => store.app.cartTotal)

    const showModal = () => {
      Obj.show = true
    }

    watch(showLogout, (newValue) => {
      if (newValue) {
        document.addEventListener('click', outsideClickListener, false)
      } else {
        document.removeEventListener('click', outsideClickListener, false)
      }
    })

    const outsideClickListener = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const logoutMenu = document.getElementById('logout')
      if (logoutMenu && !logoutMenu.contains(target)) {
        showLogout.value = false
      }
    }

    const toggleNavbar = () => {
      emit('toggleNavbar')
    }

    const onSearch = (e:Event) => {
      if(debounceTimer.value){
        clearTimeout(debounceTimer.value)
      }
      debounceTimer.value = setTimeout(() => {
        const target = e?.target as HTMLInputElement;
        const val = target.value;
        store.app.setSearchVal(val);
      }, 500);
    }

    return {
      ...toRefs(Obj),
      showLogout,
      toggleNavbar,
      showModal,
      cartItems,
      cartCount,
      cartTotal,
      onSearch
    }
  }

})
</script>

<style scoped>

</style>
