<template>
  <div class="auth-container">
    <form @submit.prevent="login">
      <h2>Đăng nhập</h2>
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mật khẩu" required />
      <button type="submit">Đăng nhập</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const email = ref('');
const password = ref('');
const router = useRouter();
const auth = useAuthStore();

const login = async () => {
  try {
    await auth.loginAdmin(email.value, password.value);
    router.push('/admin/dashboard');
  } catch (err) {
    alert('Sai tài khoản hoặc mật khẩu!');
  }
};
</script>

<style scoped>
@import '../assets/auth.css';
</style>
