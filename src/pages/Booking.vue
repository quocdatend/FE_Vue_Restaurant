<template>
  <div class="booking">
    <h2>📅 Đặt bàn</h2>
    <form @submit.prevent="submitBooking" class="booking-form">
      <!-- Họ tên -->
      <div class="form-group">
        <label for="customer_name">Họ và tên:</label>
        <input
          v-model="form.customer_name"
          type="text"
          id="customer_name"
          required
        />
      </div>

      <!-- Số điện thoại -->
      <div class="form-group">
        <label for="phone_number">Số điện thoại:</label>
        <input
          v-model="form.phone_number"
          type="tel"
          id="phone_number"
          required
        />
      </div>

      <!-- Số người -->
      <div class="form-group">
        <label>Số người:</label>
        <div class="num-people">
          <button
            type="button"
            @click="changePeople(-1)"
            :disabled="form.num_people <= 1"
          >
            -
          </button>
          <span>{{ form.num_people }}</span>
          <button type="button" @click="changePeople(1)">+</button>
        </div>
      </div>

      <!-- Ngày giờ -->
      <div class="form-group">
        <label>Ngày:</label>
        <input v-model="form.order_date" type="date" required />

        <label>Giờ:</label>
        <input v-model="form.order_time" type="time" required />
      </div>

      <!-- Kiểu tiệc -->
      <div class="form-group">
        <label>Kiểu tiệc:</label>
        <select v-model="form.party_id" required>
          <option value="">-- Chọn kiểu tiệc --</option>
          <option
            v-for="style in partyStyles"
            :key="style.party_id"
            :value="style.party_id"
          >
            {{ style.name }}
          </option>
        </select>
      </div>

      <!-- Yêu cầu đặc biệt -->
      <div class="form-group">
        <label>Yêu cầu đặc biệt:</label>
        <select v-model="form.special_request_id">
          <option value="">-- Không có --</option>
          <option
            v-for="note in orderNotes"
            :key="note.order_note_id"
            :value="note.order_note_id"
          >
            {{ note.note }}
          </option>
        </select>
      </div>

      <button type="submit">Đặt bàn</button>
    </form>

    <div v-if="message" :class="['message', success ? 'success' : 'error']">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const form = ref({
  customer_name: "",
  phone_number: "",
  num_people: 1,
  order_date: "",
  order_time: "",
  party_id: "",
  special_request_id: "",
});

const router = useRouter();
const partyStyles = ref([]);
const orderNotes = ref([]);
const message = ref("");
const success = ref(true);

// Load dữ liệu dropdown từ API
const fetchDropdowns = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token không hợp lệ hoặc không tồn tại.");
    window.location.href = "/dashboard";
  }
  try {
    const [notesRes, partyRes] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/order-note", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
      axios.get("http://127.0.0.1:8000/api/party", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
    ]);
    orderNotes.value = notesRes.data.OrderNotes;
    partyStyles.value = partyRes.data.parties;
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
  }
};

onMounted(() => {
  fetchDropdowns();
});

const changePeople = (amount) => {
  form.value.num_people = Math.max(1, form.value.num_people + amount);
};

const submitBooking = async () => {
  message.value = "";
  console.log("Form data:", form.value);
  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/order/create",
      form.value,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    message.value = "✅ Đặt bàn thành công!";
    success.value = true;

    // Reset form
    form.value = {
      customer_name: "",
      phone_number: "",
      num_people: 1,
      order_date: "",
      order_time: "",
      party_id: "",
      special_request_id: "",
    };
    router.push({ path: '/dashboard/booking/order', query: { orderId: res.data.order.order_id } })
  } catch (err) {
    console.error("Lỗi:", err);
    message.value = "❌ Đã xảy ra lỗi khi đặt bàn.";
    success.value = false;
  }
};
</script>

<style scoped>
.booking {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}
.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
label {
  font-weight: 600;
  margin-bottom: 0.4rem;
}
input,
select {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.num-people {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.num-people button {
  width: 30px;
  height: 30px;
  font-weight: bold;
  font-size: 18px;
  border: none;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  padding: 5px;
}
.num-people button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
button[type="submit"] {
  background-color: #2e7d32;
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background-color: #27632a;
}
.message {
  margin-top: 1rem;
  font-weight: bold;
  text-align: center;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>
