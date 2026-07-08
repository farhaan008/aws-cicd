<template>
  <div class="flex flex-col items-center cursor-pointer">
    <h1 class="text-xl font-bold text-gray-800 dark:text-white">RR Cafe</h1>
  </div>
  <nav>
    <ul class="list-none flex flex-col gap-y-1">
      <li v-for="category in Object.keys(menuItems)" @click="categoryClick(category)" :class="{ active: activeFilter === category }" class="flex flex-col gap-x-2">
        <a class="flex justify-start px-3 py-1 items-center text-gray-800 cursor-pointer">
          <span class="text-md">{{ category }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { store } from '@/stores'

export default defineComponent({
  name: 'SideMenu',

  setup() {
    const activeFilter = ref('Beverages' as string);
    const menuItems = computed(() => store.app.getMenuItems)

    const categoryClick = (category:string) => {
      activeFilter.value = category
      store.app.triggerScroll(category);
    }

    return {
      menuItems,
      activeFilter,
      categoryClick
    }
  },
})
</script>
<style scoped>
  .active { border-left: 3px solid #000; }
</style>
