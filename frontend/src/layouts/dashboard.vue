<template>
  <router-view v-if="$route.meta.keepAlive" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>

</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
defineComponent({
  name: 'DashboardLayout',
})
</script>
