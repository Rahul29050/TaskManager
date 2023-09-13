import { createRouter, createWebHistory } from 'vue-router';
import UserProfile from '../components/UserProfile.vue';
import store from '../store/index';
const storedAuthToken = localStorage.getItem('authToken');

if (storedAuthToken) {
  store.dispatch('loginUser', { id: null, token: storedAuthToken });
}
const routes = [
  {
    path: '/',
    children: [
      {
        path: '/',
        name: 'LoginPage',
        component: () => import('../views/LoginPage.vue'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegistrationPage.vue'),
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardPage.vue'),
        meta: {
          requiresAuth: true, 
        },
      },
      {
        path: '/profile/:userId',
        name: 'UserProfile',
        component: UserProfile,
        meta: {
          requiresAuth: true, 
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});


  router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated;

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        next({ name: 'LoginPage' });
      } else {
        next(); 
      }
    } else {
      next(); 
    }
  });

  
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;

  if (to.name === 'Dashboard' && !isAuthenticated) {
    next({ name: 'LoginPage' });
  } else {
    next(); 
  }
});

export default router;
