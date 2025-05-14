<template>
  <div>
    <h2>Tất cả bình luận</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Đánh giá</th>
          <th>Bình luận</th>
          <th>Ngày tạo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="review in reviews" :key="review.id">
          <td>{{ review.id }}</td>
          <td>{{ review.name }}</td>
          <td>{{ review.rating }}</td>
          <td>{{ review.comment }}</td>
          <td>{{ new Date(review.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const reviews = ref([]);

const fetchReviews = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/review');
    reviews.value = res.data.reviews;
  } catch (err) {
    console.error('Lỗi khi lấy bình luận:', err);
  }
};

onMounted(fetchReviews);
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
</style>