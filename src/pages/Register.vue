<template>
  <div class="auth-container">
    <form @submit.prevent="register">
      <h2>Đăng ký</h2>
      <input v-model="name" type="text" placeholder="Tên đầy đủ" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mật khẩu" required />
      <input v-model="confirm" type="password" placeholder="Xác nhận mật khẩu" required />
      <button type="submit">Đăng ký</button>
      <p class="link">
        Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const confirm = ref('');
const router = useRouter();
const auth = useAuthStore();

const register = async () => {
  if (password.value !== confirm.value) {
    alert('Mật khẩu không khớp!');
    return;
  }

  try {
    await auth.register(name.value, email.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    alert('Đăng ký thất bại!');
  }
};
</script>

<style scoped>
@import '../assets/auth.css';
</style>
