<template>
  <div class="menu">
    <h2>📂 Danh mục thực đơn</h2>

    <div v-if="loading">Đang tải danh mục...</div>
    <div v-else class="category-list">
      <router-link
        v-for="cat in categories"
        :key="cat.id"
        :to="`/dashboard/menu/${cat.slug}`"
        class="category-card"
      >
        <img :src="getImageUrl(cat.image)" alt="Category Image" class="category-image" />
        <h3>{{ cat.name }}</h3>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])
const loading = ref(true)

const getImageUrl = (imagePath) => {
  return `http://127.0.0.1:8000/storage/${imagePath}`
}

const fetchCategories = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/category')
    // if (res.data.status === 'success') {
      categories.value = res.data.data
    // }
  } catch (error) {
    console.error('Lỗi khi tải danh mục:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.menu {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
}

h2 {
  font-size: 28px;
  margin-bottom: 2rem;
  color: #2e7d32;
  text-align: center;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2rem;
}

.category-card {
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.category-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
  width: 100%;
  text-align: center;
}

.category-card h3 {
  margin: 0.5rem 0;
  font-size: 20px;
  color: #2e7d32;
}

.slug {
  font-size: 14px;
  color: #777;
}
</style>
