<template>
  <div class="menu-item">
    <h2>Danh mục: {{ category.name }}</h2>
    <div v-if="loading">Đang tải món ăn...</div>
    <div v-else-if="menus.length === 0">Không có món ăn nào.</div>
    <div v-else class="menu-list">
      <div v-for="menu in menus" :key="menu.id" class="menu-card">
        <img :src="getImageUrl(menu.image)" alt="Menu Image" class="menu-image" />
        <h3>{{ menu.name }}</h3>
        <p>{{ menu.description }}</p>
        <p>Giá: {{ formatPrice(menu.price) }}₫</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const slug = route.params.slug

const category = ref({})
const menus = ref([])
const loading = ref(true)

const getImageUrl = (imagePath) => {
  return `http://127.0.0.1:8000/storage/${imagePath}`
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

onMounted(async () => {
  try {
    // Lấy thông tin danh mục theo slug
    const categoryRes = await axios.get(`http://127.0.0.1:8000/api/category/slug/${slug}`)
    if (categoryRes.data.status === 'success') {
      category.value = categoryRes.data.category
      const categoryId = category.value.id

      // Lấy danh sách món ăn theo category_id
      const menuRes = await axios.get(`http://127.0.0.1:8000/api/menu/findByCategory/${categoryId}`)
      if (menuRes.data.status === 'success') {
        menus.value = menuRes.data.menus
      }
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.menu-item {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.menu-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.menu-card {
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.menu-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.menu-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}

.menu-card h3 {
  margin: 0.5rem 0;
  font-size: 20px;
  color: #2e7d32;
  text-align: center;
}

.menu-card p {
  font-size: 14px;
  color: #555;
  text-align: center;
}
</style>
