<template>
  <div class="home">
    <h1>🍽️ Quản trị nhà hàng</h1>
    <p>Chào mừng bạn quay trở lại!</p>

    <div class="cards">
      <div class="card">
        <h3>📦 Đơn hàng hôm nay</h3>
        <p>12 đơn hàng</p>
      </div>
      <div class="card">
        <h3>💬 Bình luận mới</h3>
        <p>4 bình luận</p>
      </div>
      <div class="card">
        <h3>👥 Khách hàng</h3>
        <p>245 người dùng</p>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.home {
  padding: 2rem;
}
h1 {
  font-size: 28px;
  margin-bottom: 0.5rem;
}
.cards {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}
.card {
  flex: 1;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  text-align: center;
}
.card h3 {
  margin-bottom: 0.5rem;
}
</style>
