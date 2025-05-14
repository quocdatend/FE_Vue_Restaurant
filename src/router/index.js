import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Dashboard from "../pages/Dashboard.vue";
import Register from "../pages/Register.vue";
import HomePage from "../pages/HomePage.vue";
import Orders from "../pages/Orders.vue";
import Comments from "../pages/Comments.vue";
import Menu from "../pages/Menu.vue";
import MenuItem from "../pages/MenuItem.vue";
import Booking from "../pages/Booking.vue";

import LoginAdmin from "../pages/AdminLogin.vue";
import DashboardAdmin from "../pages/AdminDashboard.vue";

import { useAuthStore } from "../store/auth";

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/", redirect: "/dashboard" },
  {
    path: "/forgot-password",
    component: () => import("../pages/ForgotPassword.vue"),
  },
  {
    path: "/dashboard",
    component: Dashboard,
    children: [
      { path: "", component: HomePage },
      { path: "orders", component: Orders, meta: { requiresAuth: true } },
      {
        path: "booking",
        component: Booking,
        meta: { requiresAuth: true },
      },
      { path: "comments", component: Comments },
      { path: "menu", component: Menu },
      { path: "menu/:slug", component: MenuItem },
    ],
  },
  { path: "/admin/login", component: LoginAdmin },
  {
    path: "/admin/dashboard",
    component: DashboardAdmin,
    children: [],
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.user) {
    try {
      await auth.fetchUser();
    } catch {
      return next("/login");
    }
  }
  next();
});

export default router;
