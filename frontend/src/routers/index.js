import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import HomePage from '../views/HomePage.vue';
import AdminPage from '../views/AdminPage.vue';
import DashboardPage from '../views/DashboardPage.vue';

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/', component: HomePage },
  {
    path: '/admin', 
    component: AdminPage, 
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/dashboard', 
    component: DashboardPage, 
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole'); // 例えば、ロール情報がlocalStorageに保存されていると仮定

  // 認証が必要なページにアクセスする場合
  if (to.meta.requiresAuth && !token) {
    next('/login'); // ログインしていない場合、ログインページにリダイレクト
  }
  // 管理者専用ページにアクセスする場合
  else if (to.meta.requiresAdmin && userRole !== 'admin') {
    next('/'); // 管理者以外はホームにリダイレクト
  } else {
    next(); // 他の場合はそのまま進む
  }
});

export default router;
