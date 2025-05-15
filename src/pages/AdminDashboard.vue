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
      <div class="logout" @click="logout">Đăng xuất</div>
    </aside>

    <main class="content">
      <component :is="currentComponent"></component>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import UserManager from "./Admins/UserManager.vue";
import OrderManager from "./Admins/OrderManager.vue";
import CommentManager from "./Admins/CommentManager.vue";
import CategoryManager from "./Admins/CategoryManager.vue";
import PartyManager from "./Admins/PartyManager.vue";
import SpecialRequestManager from "./Admins/SpecialRequestManager.vue";
import { useAuthStore } from "../store/auth";
import { onMounted } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthStore();

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vui lòng đăng nhập để truy cập trang này.");
    window.location.href = "/admin/login";
  } else {
    try {
      await auth.fetchAdmin();
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      window.location.href = "/admin/login";
    }
  }
});

const activeTab = ref("users");

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case "users":
      return UserManager;
    case "orders":
      return OrderManager;
    case "comments":
      return CommentManager;
    case "categories":
      return CategoryManager;
    case "parties":
      return PartyManager;
    case "requests":
      return SpecialRequestManager;
    default:
      return UserManager;
  }
});

function logout() {
  // Xóa token hoặc session tùy backend
  localStorage.removeItem("token");
  router.push("/admin/login"); // điều hướng về trang đăng nhập
}
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

.logout {
  margin-top: 20px;
  padding: 10px;
  background: #e74c3c;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  bottom: 55px;
  padding-right: 0px;
  width: 210px;
  padding-left: 0px;
}

.logout:hover {
  background: #c0392b;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f4f6f8;
  overflow-y: auto;
}
</style>
