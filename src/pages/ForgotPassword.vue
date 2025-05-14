<template>
  <div class="wrapper">
    <!-- Form -->
    <div class="form-box">
      <h2>Quên mật khẩu</h2>
      <p>Nhập email để nhận liên kết đặt lại mật khẩu</p>

      <form @submit.prevent="submit">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="you@example.com"
          required
        />
        <button type="submit" :disabled="loading">
          {{ loading ? 'Đang gửi...' : 'Gửi yêu cầu' }}
        </button>
      </form>
      <div class="go-login">
        <button ><a href="/login" style="text-decoration:none;color:white;">Quay lại đăng nhập</a></button>
      </div>
    </div>

    <!-- Toast notification -->
    <div
      v-if="message"
      :class="['toast', success ? 'toast-success' : 'toast-error']"
    >
      {{ message }}
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const email = ref('')
const message = ref('')
const success = ref(false)
const loading = ref(false)
let toastTimeout = null

const submit = async () => {
  loading.value = true
  message.value = ''

  try {
    const response = await fetch('http://127.0.0.1:8000/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()

    if (response.status === 200) {
      success.value = true
      message.value = data.message || 'Đã gửi email khôi phục.'
    } else if (response.status === 422) {
      success.value = false
      message.value = data.message || 'Email không hợp lệ hoặc không tồn tại.'
    } else {
      success.value = false
      message.value = 'Đã xảy ra lỗi không xác định.'
    }
  } catch (err) {
    success.value = false
    message.value = 'Lỗi kết nối hoặc máy chủ.'
  } finally {
    loading.value = false

    // Auto-hide toast after 4 seconds
    clearTimeout(toastTimeout)
    toastTimeout = setTimeout(() => {
      message.value = ''
    }, 4000)
  }
}

</script>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
}

.wrapper {
  height: 100vh;
  background: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.form-box {
  background: #fff;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

p {
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
}

input[type="email"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
}

button {
  width: 100%;
  background-color: #007bff;
  color: white;
  padding: 10px;
  font-size: 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.message {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.success {
  color: green;
}

.error {
  color: red;
}

.form-box {
  background: #fff;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 250px;
  max-width: 300px;
  padding: 14px 18px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  z-index: 9999;
}

.toast-success {
  background-color: #28a745;
}

.toast-error {
  background-color: #dc3545;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.go-login {
  margin-top: 15px;
  text-align: center;
}

.go-login button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.go-login button:hover {
  background-color: #5a6268;
}


</style>
