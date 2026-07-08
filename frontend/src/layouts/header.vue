<template>
  <header class="bg-white border-b border-gray-300">
    <component :is="component" @toggleNavbar="toggleNavbar" />
  </header>
</template>
<script lang="ts">

import { defineComponent, computed } from 'vue'
import MenuHeader from '@/components/dashboard/menu-header.vue'
import KitchenHeader from '@/components/kitchen-dashboard/kitchen-header.vue'

export default defineComponent({
  name: 'HeaderBar',
  components: {
    MenuHeader,
    KitchenHeader,
  },
  props: {
    navExpand: {
      type: Boolean,
      required: false,
      default: true,
    },
    header: {
      type: String,
      default: 'MenuHeader',
    }
  },
  emits: ['toggleNavbar'],
  setup(props, { emit }) {

    const toggleNavbar = () => { emit('toggleNavbar') }

    const component = computed(() => {
      return props.header;
    });
    return {
      component,
      toggleNavbar
    }
  },
})
</script>
