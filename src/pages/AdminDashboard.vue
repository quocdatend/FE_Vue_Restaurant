<template>
  <div class="admin-dashboard">
    <aside class="sidebar">
      <h2>Admin</h2>
      <nav>
        <ul>
          <li @click="activeTab = 'users'">Người dùng</li>
          <li @click="activeTab = 'orders'">Đơn hàng</li>
          <li @click="activeTab = 'comments'">Bình luận</li>
          <li @click="activeTab = 'categories'">Danh mục</li>
          <li @click="activeTab = 'parties'">Loại tiệc</li>
          <li @click="activeTab = 'requests'">Yêu cầu đặc biệt</li>
        </ul>
      </nav>
    </aside>

    <main class="content">
      <component :is="currentComponent"></component>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import UserManager from './Admins/UserManager.vue';
import OrderManager from './Admins/OrderManager.vue';
import CommentManager from './Admins/CommentManager.vue';
import CategoryManager from './Admins/CategoryManager.vue';
import PartyManager from './Admins/PartyManager.vue';
import SpecialRequestManager from './Admins/SpecialRequestManager.vue';

const activeTab = ref('users');

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'users': return UserManager;
    case 'orders': return OrderManager;
    case 'comments': return CommentManager;
    case 'categories': return CategoryManager;
    case 'parties': return PartyManager;
    case 'requests': return SpecialRequestManager;
    default: return UserManager;
  }
});
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 220px;
  background: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
}

.sidebar h2 {
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 5px;
}

.sidebar li:hover {
  background: #34495e;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f4f6f8;
  overflow-y: auto;
}
</style>
