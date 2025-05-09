<template>
  <div class="orders">
    <h2>📦 Danh sách đơn hàng</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Khách hàng</th>
          <th>Ngày đặt</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in orders" :key="order.id">
          <td>{{ index + 1 }}</td>
          <td>{{ order.customer }}</td>
          <td>{{ order.date }}</td>
          <td :class="order.status.toLowerCase()">{{ order.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const orders = ref([
  { id: 1, customer: 'Nguyễn Văn A', date: '2025-05-07', status: 'Đã giao' },
  { id: 2, customer: 'Trần Thị B', date: '2025-05-08', status: 'Đang xử lý' },
]);
</script>

<style scoped>
.orders {
  padding: 2rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
}
th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
tr:last-child td {
  border-bottom: none;
}
td.đã\ giao {
  color: green;
  font-weight: bold;
}
td.đang\ xử\ lý {
  color: orange;
  font-weight: bold;
}
</style>
