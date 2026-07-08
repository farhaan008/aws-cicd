
<template>
  <div class="grid grid-cols-[40px_1fr] gap-4 p-4">

    <div class="flex justify-center items-center p-4">
      <div @click="toggleNavbar" class="flex lg:hidden md:hidden sm:block">
        <svg class="w-8 h-8 text-gray-800 dark:text-white" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14" />
        </svg>
      </div>
    </div>

    <div class="flex justify-center items-center">
      <input @input="onSearch($event)" type="text" placeholder="Search Order Id Or Status" class="w-full lg:w-2/3 border border-gray-300 px-4 py-2 rounded-full focus:outline-none" />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, reactive } from 'vue'
import ViewCart from '@/components/modal/view-cart.vue'
import { store } from '@/stores'

export default defineComponent({
  name: 'MenuHeader',
  components: { ViewCart },
  // props: {
  //   navExpand: {
  //     type: Boolean,
  //     required: false,
  //     default: true,
  //   },
  // },
  emits: ['toggleNavbar'],
  setup(_, { emit }) {

    const debounceTimer = ref<number | null>(null)
    const Obj = reactive({})

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
      }, 800);
    }


    return {
      ...toRefs(Obj),
      toggleNavbar,
      onSearch
    }
  }

})
</script>
