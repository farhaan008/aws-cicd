<template>
  <div class="flex justify-center items-center p-3 border-b border-gray-200">
    <div class="flex w-full flex-col gap-4">
      <div class="flex justify-between items-center">
        <h3 class="text-md text-black-700 font-semibold">{{ localItem.name }}</h3>
        <span class="text-lg text-black-500 font-semibold relative top-0.5">₹ {{ localItem.price }}</span>
      </div>
      <div class="w-full">
        <img :src="`/menu/${localItem.imageUrl}.jpg`" class="w-full h-[200px] object-cover rounded-sm" />
      </div>
      <div class="w-full">
        <p class="text-sm text-description mb-2">{{ localItem.description }}</p>
        <div class="flex flex-inline space-x-4 justify-start mb-3">
          <div v-for="size in localItem.sizes" :key="size.sizeId" class="flex flex-inline items-center space-x-1">
            <input type="radio" :name="'size-' + localItem.id" :id="'size-' + size.sizeId" :value="size.sizeId" v-model="localItem.sizeId" @change="onSizeChange(localItem, size.sizeId)" class="h-4 w-4 text-blue-600 border-gray-300"/>
            <label :for="'size-' + size.sizeId" class="text-sm text-gray-700">{{ size.size }}</label>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <button v-if="!quantity" @click="addToCart(localItem)" type="button"
            :class="!quantity ? 'px-8' : 'px-4'"
            class="flex items-center gap-3 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-full text-md px-4 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 cursor-pointer">
            Add
          </button>
          <button v-else
            type="button"
            :class="!quantity ? 'px-8' : 'px-4'"
            class="flex items-center gap-3 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-full text-md px-4 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 cursor-pointer"
          >
            <span v-if="quantity" @click="removeFromCart(localItem)" class="inline-block">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
            <span>{{ quantity }}</span>
            <span v-if="quantity" @click="addToCart(localItem)" class="inline-block">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType, reactive, watch } from 'vue'
import type { MenuItem } from '@/types/fos'
import { store } from '@/stores'

export default defineComponent({
  name: 'MenuItem',
  props: {
    item: {
      type: Object as PropType<MenuItem>,
      required: true,
    },
  },
  setup(props) {
    const localItem = reactive({ ...props.item })

    watch( () => props.item,
      (newItem) => {
        Object.assign(localItem, newItem)
      }
    )

    const quantity = computed(() => store.app.getItemQuantity(localItem.id, localItem.sizeId))
    // const menuItems = computed(() => store.app.getMenuItems)

    const addToCart = (item: MenuItem) => {
      store.app.addToCart(item)
    }
    const removeFromCart = (item: { id: string | number; sizeId?: number }) => {
      if (item.sizeId !== undefined) {
        store.app.removeFromCart(item.id, item.sizeId)
      } else {
        store.app.removeFromCart(item.id)
      }
    }

    const onSizeChange = (item: MenuItem, sizeId: number) => {
      const price = item.prices?.find((f) => f.sizeId === sizeId)?.price || 0;
      localItem.price = price;
      localItem.sizeId = sizeId;
      // store.app.getCartTotal();
    }

    return {
      // menuItems,
      quantity,
      addToCart,
      removeFromCart,
      onSizeChange,
      localItem
    }
  },
})
</script>
<style scoped>
.text-description {
  font-size: 0.875rem;
  color: #696f76;
}
</style>

