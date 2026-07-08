<template>
  <div v-for="(items, category) in filteredMenuItem" :key="category" :ref="el => setCategoryRef(category, el)" class="w-full">
    <h3 class="text-lg text-black-700 font-semibold p-3">{{ category }}</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <menu-item v-for="item in items" :key="item.id" :item="item"></menu-item>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import MenuItem from '@/components/dashboard/menu-item.vue'
import { filterMenuBySearch } from '@/composables/useMenuFilter.ts'
import { store } from '@/stores'
// import { showToast } from '@/utils/common/common-functions'
export default defineComponent({
  name: 'FoodMenu',
  components: {
    MenuItem,
  },
  setup() {

    const menuItems = computed(() => store.app.getMenuItems)
    const searchVal = computed(() => store.app.getSearchVal)
    const filteredMenuItem = computed(() =>
      filterMenuBySearch(menuItems.value, searchVal.value)
    )

    onMounted(() => {
      // showToast('Your order has been created!', true )
      if(Object.keys(menuItems.value).length === 0) {
        store.app.fetchMenuItems();
      }
    })

    watch(() => store.app.scrollTargetCategory, (category) => {
      if (category) {
        scrollToCategory(category);
        store.app.clearScrollTarget();
      }
    });

    const isHTMLElement = (el: unknown): el is HTMLElement => {
      return el instanceof HTMLElement
    }
    const categoryRefs: Record<string, HTMLElement> = reactive({})
    const setCategoryRef = (category: string|number, el: Element | ComponentPublicInstance | null) => {
      if (isHTMLElement(el)) {
        categoryRefs[category] = el
      }
    }
    const scrollToCategory = (category:string|number) =>{
      const el = categoryRefs[category]
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }


    return {
      menuItems,
      filteredMenuItem,
      setCategoryRef
    }
  }

})
</script>
<style scoped></style>
