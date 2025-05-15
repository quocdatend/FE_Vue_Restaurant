<template>
  <div>
    <header class="header">
      <div class="logo">🍽️ Nhà hàng</div>
      <nav class="nav">
        <router-link to="/dashboard" class="link">Trang chủ</router-link>
        <router-link to="/dashboard/menu" class="link">Thực đơn</router-link>
        <router-link to="/dashboard/booking" class="link">Đặt bàn</router-link>
        <router-link to="/dashboard/orders" class="link">Đơn đặt hàng</router-link>
        <router-link to="/dashboard/comments" class="link">Bình luận</router-link>
      </nav>
      <div class="auth">
        <template v-if="auth.user">
          👋 Xin chào, {{ auth.user.name }}
          <button @click="logout">Đăng xuất</button>
        </template>
        <template v-else>
          <router-link to="/login">Đăng nhập</router-link> /
          <router-link to="/register">Đăng ký</router-link>
        </template>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth';
import { onMounted, onBeforeMount } from 'vue';

const auth = useAuthStore();
onMounted(async () => {
  console.log('Đang tải dữ liệu...');
  await auth.fetchUser();
})
console.log(auth.user);
const logout = async () => {
  await auth.logout();
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #007bff;
  color: white;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  font-weight: bold;
  font-size: 20px;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.link {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.auth {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth button {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.auth button:hover {
  background: white;
  color: #007bff;
}

.main-content {
  padding: 2rem;
}
</style>
