import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router'
import { globalStartupGuard, authGuard } from '@/utils/global/session-helper'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/layouts/applayout.vue'),
    children: [
      {
        path: '',
        name: 'Menu',
        component: () => import('@/views/Menu.vue'),
        meta: { keepAlive: true, sidebar: 'SideMenu', header: 'MenuHeader' }
      },
    ],
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/Checkout.vue'),
  },
  {
    path: '/kitchen',
    name: 'kitchen',
    component: () => import('@/layouts/applayout.vue'),
    meta: { keepAlive: true, sidebar: 'KitchenMenu', header: 'KitchenHeader' },
    children: [
      {
        path: '',
        name: 'kitchen-dashboard',
        component: () => import('@/views/KitchenDashboard.vue'),
      }
    ]
  },
  {
    path: '/order-dashboard',
    name: 'order-dashboard',
    component: () => import('@/views/OrderDashboard.vue'),
    // meta: { fullscreen: true, requiresAuth: false }
  },
  {
    path: '/success',
    name: 'success',
    component: () => import('@/views/Success.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  globalStartupGuard(to).then(() => {
    authGuard(to, from, next)
  })
})
export default router



// const routes: Array<RouteRecordRaw> = [
// Public / Customer Routes
// {
//   path: '/',
//   component: () => import('@/layouts/applayout.vue'),
//   children: [
//     {
//       path: '',
//       name: 'Home',
//       component: () => import('@/views/Home.vue'),
//     },
//     {
//       path: 'checkout',
//       name: 'checkout',
//       component: () => import('@/views/Checkout.vue'),
//     },
//     {
//       path: 'success',
//       name: 'success',
//       component: () => import('@/views/Success.vue'),
//     },
//     {
//       path: 'order/:orderId',
//       name: 'order-status',
//       component: () => import('@/views/OrderStatus.vue'),
//       props: true,
//       meta: { fullscreen: true, requiresAuth: false }
//     },
//   ],
// },

// Kitchen Staff Dashboard
// {
//   path: '/kitchen',
//   name: 'kitchen-dashboard',
//   component: () => import('@/views/KitchenDashboard.vue'),
//   meta: { requiresAuth: true, roles: ['kitchen'] },
// },

// // Admin Dashboard
// {
//   path: '/admin',
//   component: () => import('@/layouts/AdminLayout.vue'),
//   meta: { requiresAuth: true, roles: ['admin'] },
//   children: [
//     {
//       path: '',
//       name: 'admin-dashboard',
//       component: () => import('@/views/AdminDashboard.vue'),
//     },
//     {
//       path: 'orders',
//       name: 'food-order-dashboard',
//       component: () => import('@/views/FoodOrderDashboard.vue'),
//     },
//   ]
// },

// Fallback
// {
//   path: '/unauthorized',
//   name: 'unauthorized',
//   component: () => import('@/views/Unauthorized.vue'),
// },
// ];

// router.beforeEach((to, from, next) => {
//   const user = getCurrentUser();
//   const isAuthenticated = !!user;

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next({ name: 'Home' });
//     return;
//   }

//   if (to.meta.roles && !to.meta.roles.includes(user.role)) {
//     next({ name: 'unauthorized' });
//     return;
//   }

//   next();
// });


