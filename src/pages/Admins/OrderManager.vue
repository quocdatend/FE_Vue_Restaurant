<template>
  <div>
    <h2>Quản lý Đơn hàng</h2>

    <label for="statusFilter">Lọc theo trạng thái:</label>
    <select v-model="statusFilter" id="statusFilter">
      <option value="">Tất cả</option>
      <option v-for="(text, key) in statusMap" :value="Number(key)" :key="key">{{ text }}</option>
    </select>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên KH</th>
          <th>SĐT</th>
          <th>Ngày giờ</th>
          <th>Số người</th>
          <th>Ghi chú</th>
          <th>Loại tiệc</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in filteredOrders" :key="order.order_id">
          <td>{{ order.order_id }}</td>
          <td>{{ order.customer_name }}</td>
          <td>{{ order.phone_number }}</td>
          <td>{{ order.order_date }} {{ order.order_time }}</td>
          <td>{{ order.num_people }}</td>
          <td>{{ order.special_note }}</td>
          <td>{{ order.party_name }}</td>
          <td>{{ order.total_price }}</td>
          <td :class="statusClass(order.status)">{{ statusMap[order.status] || 'Không xác định' }}</td>
          <td>
            <template v-if="order.status === 1">
              <button @click="cancelOrder(order.order_id)">Huỷ</button>
              <button @click="confirmPayment(order.order_id)">Xác nhận thanh toán</button>
            </template>
            <template v-else-if="order.status === 2">
              <button @click="markAsCompleted(order.order_id)">Xác nhận hoàn thành</button>
            </template>
            <template v-else>
              <span>No action</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const orders = ref([]);
const statusFilter = ref('');

const statusMap = {
  '-2': 'Bị Hủy Đơn Đặt',
  '-1': 'Đã Hủy',
   0: 'Đang xử lý',
   1: 'Chưa Thanh Toán',
   2: 'Đã Thanh Toán',
   3: 'Hoàn Thành',
};

const fetchOrders = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get('http://127.0.0.1:8000/api/order', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const allOrders = res.data.orders;

  for (const order of allOrders) {
    const noteRes = await axios.get(`http://127.0.0.1:8000/api/order-note/${order.special_request_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
    const partyRes = await axios.get(`http://127.0.0.1:8000/api/party/${order.party_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

    order.special_note = noteRes.data?.data[0]?.note || '';
    order.party_name = partyRes.data?.party?.name || '';
  }

  orders.value = allOrders;
};

const filteredOrders = computed(() => {
  if (statusFilter.value === '') return orders.value;
  return orders.value.filter(o => o.status === statusFilter.value);
});

const cancelOrder = async (id) => {
  if (confirm('Bạn có chắc muốn huỷ đơn hàng?')) {
    const token = localStorage.getItem('token');
    await axios.post(`http://127.0.0.1:8000/api/order/cancelByUser`, { order_id: id }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOrders();
  }
};

const confirmPayment = async (id) => {
  const token = localStorage.getItem('token');
  await axios.post(`http://127.0.0.1:8000/api/order/confirmPayment`, { order_id: id }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchOrders();
};

const markAsCompleted = async (id) => {
  const token = localStorage.getItem('token');
  await axios.post(`http://127.0.0.1:8000/api/order/complete`, { order_id: id }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchOrders();
};

const statusClass = (status) => {
  return {
    '-2': 'status-cancelled',
    '-1': 'status-deleted',
    0: 'status-processing',
    1: 'status-unpaid',
    2: 'status-paid',
    3: 'status-completed',
  }[status] || '';
};

onMounted(fetchOrders);
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
th {
  background: #eee;
}
.status-cancelled {
  background-color: #ffcccc;
  color: red;
  font-weight: bold;
}
.status-deleted {
  background-color: #ffe0cc;
  color: darkorange;
  font-weight: bold;
}
.status-processing {
  background-color: #ffffcc;
  color: orange;
  font-weight: bold;
}
.status-unpaid {
  background-color: #fffbe6;
  color: goldenrod;
  font-weight: bold;
}
.status-paid {
  background-color: #ccffcc;
  color: green;
  font-weight: bold;
}
.status-completed {
  background-color: #d4f0ff;
  color: blue;
  font-weight: bold;
}
</style>
