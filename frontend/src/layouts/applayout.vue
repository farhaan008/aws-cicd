<template>
  <div ref="sidebar" class="layout-container h-screen">
    <div v-if="showLoader" class="loader overflow-hidden">
      <div class="bg-blue-500 progress"></div>
    </div>
    <div v-if="navExpand" @click="onClickOutside" class="fixed inset-0 bg-black opacity-5 h-full w-full z-20 lg:hidden md:hidden sm:block"></div>
    <aside :class="navExpand ? 'open-sidebar' : ''" class="sidebar p-3 border-r border-gray-200 z-50 bg-white">
      <SideBar :type="`${sidebarType}`"></SideBar>
    </aside>
    <main class="main grid grid-rows-[auto, 1fr] h-screen">
      <HeaderBar :header="`${header}`" @toggleNavbar="navExpand = !navExpand"></HeaderBar>
      <div class="flex flex-col p-3 overflow-y-auto">
        <Dashboard />
        <NotifyVue></NotifyVue>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router';
import { store } from '@/stores'
import SideBar from './sidebar.vue'
import HeaderBar from './header.vue'
import Dashboard from './dashboard.vue'
import NotifyVue from  '@/components/elements/notify.vue'

export default defineComponent({
  name: 'LayoutContainer',
  components: { SideBar, HeaderBar, Dashboard, NotifyVue },

  setup() {
    const route = useRoute();
    const sidebarType = computed(() =>
      route.meta?.sidebar || 'SideMenu'
    );
    const header = computed(() => route.meta?.header || 'MenuHeader');
    const width = 768
    const { body } = document

    const navExpand = ref(true)
    const sidebar = ref<HTMLElement | null>(null)

    // Removed unused expression; value is accessed via showLoader computed property below

    const showLoader = computed(() => store.app.isLoading)

    const isMobile = (): boolean => {
      const rect = body.getBoundingClientRect()
      return rect.width < width
      // return window.innerWidth < width
    }
    const resizeObserver = (): void => {
      if (!document.hidden) {
        // store.dispatch('app/setIsMobile', isMob);
        if (isMobile()) {
          navExpand.value = false
        } else {
          navExpand.value = true
        }
      }
    }
    onBeforeMount(() => {
      window.addEventListener('resize', resizeObserver)
      resizeObserver()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeObserver)
    })

    const onClickOutside = () => {
      if (isMobile()) {
        navExpand.value = false
      }
      // if (sidebar.value && !sidebar.value.contains(event.target as Node)) {}
    }


    return {
      navExpand,
      sidebar,
      header,
      showLoader,
      sidebarType,
      onClickOutside,
    }
  },
})
</script>

<style scoped>
.layout-container {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 200px 1fr;
  grid-template-areas: 'loader loader' 'sidebar content';
  height: 100vh;
  transition: all 0.5s ease;
}
.main {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-area: content;
  background-color: #fafcfc;
}
.loader {
  grid-area: loader;
  height: 3px;
}
.sidebar {
  grid-area: sidebar;
}

.progress {
  position: relative;
  width: 16rem;
  height: 3px;
  animation: slide 2s ease-in-out infinite;
}

@keyframes slide {
  0% {
    left: 0%;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    left: 97%;
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .layout-container {
    grid-template-columns: 0 1fr;
  }
  .sidebar {
    width: 200px;
    transform: translateX(-200px);
    transition: transform 0.3s ease-in-out;
  }
  .open-sidebar {
    transform: translateX(0);
  }
  .main {
    grid-template-columns: 1fr;
  }
}
</style>
