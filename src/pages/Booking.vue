<template>
  <div class="booking">
    <h2>📅 Đặt bàn</h2>
    <form @submit.prevent="submitBooking" class="booking-form">
      <div class="form-group">
        <label for="name">Họ và tên:</label>
        <input v-model="form.name" type="text" id="name" required />
      </div>
      <div class="form-group">
        <label for="phone">Số điện thoại:</label>
        <input v-model="form.phone" type="tel" id="phone" required />
      </div>
      <div class="form-group">
        <label for="date">Ngày:</label>
        <input v-model="form.date" type="date" id="date" required />
      </div>
      <div class="form-group">
        <label for="time">Giờ:</label>
        <input v-model="form.time" type="time" id="time" required />
      </div>
      <button type="submit">Đặt bàn</button>
    </form>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({
  name: '',
  phone: '',
  date: '',
  time: '',
});

const successMessage = ref('');

const submitBooking = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/bookings', form.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    successMessage.value = 'Đặt bàn thành công!';
    // Reset form
    form.value = {
      name: '',
      phone: '',
      date: '',
      time: '',
    };
  } catch (error) {
    console.error('Lỗi khi đặt bàn:', error);
    successMessage.value = 'Đã xảy ra lỗi khi đặt bàn.';
  }
};
</script>

<style scoped>
.booking {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}
.booking-form {
  display: flex;
  flex-direction: column;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #2e7d32;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #27632a;
}
.success-message {
  margin-top: 1rem;
  color: green;
  font-weight: bold;
}
</style>
