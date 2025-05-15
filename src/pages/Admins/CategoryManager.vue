<template>
  <div>
    <h2>Quản lý Danh mục</h2>
    <button @click="openForm" style="background-color: green">
      Thêm Danh mục
    </button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Slug</th>
          <th>Hình ảnh</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categories" :key="cat.id">
          <td>{{ cat.id }}</td>
          <td>{{ cat.name }}</td>
          <td>{{ cat.slug }}</td>
          <td>
            <img
              :src="imageUrl(cat.image)"
              alt="image"
              style="width: 50px; height: auto"
            />
          </td>
          <td>
            <button @click="editCategory(cat)" style="background-color: blue">
              Sửa
            </button>
            <button
              @click="deleteCategory(cat.id)"
              style="background-color: red"
            >
              Xoá
            </button>
            <button @click="viewItems(cat.id)" style="background-color: orange">
              Xem Item
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form thêm/sửa danh mục -->
    <div class="form" v-if="showForm">
      <h3>{{ editing ? "Chỉnh sửa Danh mục" : "Thêm Danh mục" }}</h3>
      <form @submit.prevent="submitForm">
        <input
          v-model="form.name"
          type="text"
          placeholder="Tên danh mục"
          required
        />
        <input type="file" @change="handleImageUpload" />
        <button type="submit" style="background-color: green">
          {{ editing ? "Cập nhật" : "Thêm" }}
        </button>
        <button type="button" style="background-color: red" @click="resetForm">
          Hủy
        </button>
      </form>
    </div>

    <div class="menu-items-section" v-if="currentCategoryId">
      <h3>Món ăn của danh mục</h3>

      <div v-if="selectedItems.length">
        <div v-for="item in selectedItems" :key="item.id" class="menu-item">
          <img :src="imageUrl(item.image)" alt="menu image" />
          <div class="menu-item-info">
            <strong>{{ item.name }}</strong>
            <span>{{ item.price }} VND</span>
          </div>
          <button @click="editItem(item)">Sửa</button>
          <button @click="deleteItem(item.id)">Xoá</button>
        </div>
      </div>
      <div v-else>
        <p>Chưa có món ăn nào trong danh mục này.</p>
      </div>

      <button @click="showAddItemForm = true" class="add-item-button">
        Thêm món ăn
      </button>
    </div>

    <!-- Form thêm/sửa món ăn -->
    <div v-if="showAddItemForm">
      <h3>{{ editingItem ? "Sửa Món" : "Thêm Món" }}</h3>
      <form @submit.prevent="submitItemForm">
        <input
          v-model="itemForm.name"
          type="text"
          placeholder="Tên món"
          required
        />
        <input type="file" @change="handleItemImageUpload" />
        <textarea v-model="itemForm.description" placeholder="Mô tả"></textarea>
        <input v-model="itemForm.price" type="number" placeholder="Giá" />
        <textarea v-model="itemForm.detail" placeholder="Chi tiết"></textarea>
        <button type="submit">Lưu</button>
        <button type="button" @click="resetItemForm">Hủy</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Category
const categories = ref([]);
const showForm = ref(false);
const editing = ref(false);
const editingId = ref(null);
const form = ref({ name: "", slug: "", image: null });

// Menu Item
const selectedItems = ref([]);
const currentCategoryId = ref(null);
const showAddItemForm = ref(false);
const editingItem = ref(false);
const editingItemId = ref(null);
const itemForm = ref({
  name: "",
  description: "",
  price: "",
  detail: "",
  image: null,
});

const imageUrl = (path) => `http://127.0.0.1:8000/storage/${path}`;

const fetchCategories = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/category");
    categories.value = res.data.categories;
  } catch (err) {
    console.error("Lỗi khi tải danh mục:", err);
  }
};

const openForm = () => {
  showForm.value = true;
  editing.value = false;
  editingId.value = null;
  form.value = { name: "", slug: "", image: null };
};

const handleImageUpload = (e) => {
  form.value.image = e.target.files[0];
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append("name", form.value.name);
  if (form.value.image) formData.append("image", form.value.image);

  try {
    const url = editing.value
      ? `http://127.0.0.1:8000/api/category/update/${editingId.value}`
      : "http://127.0.0.1:8000/api/category/create";

    await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    fetchCategories();
    resetForm();
  } catch (err) {
    console.error("Lỗi gửi dữ liệu danh mục:", err);
  }
};

const editCategory = (cat) => {
  showForm.value = true;
  editing.value = true;
  editingId.value = cat.id;
  form.value = { name: cat.name, slug: cat.slug, image: null };
};

const deleteCategory = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xoá danh mục này?")) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/category/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi xoá danh mục:", err);
    }
  }
};

const resetForm = () => {
  showForm.value = false;
  editing.value = false;
  editingId.value = null;
  form.value = { name: "", slug: "", image: null };
};

// Menu item logic
const viewItems = async (categoryId) => {
  try {
    currentCategoryId.value = categoryId;
    const res = await axios.get(
      `http://127.0.0.1:8000/api/menu/findByCategory/${categoryId}`
    );
    selectedItems.value = res.data.menus;
    showAddItemForm.value = false;
  } catch (err) {
    console.error("Lỗi khi tải menu:", err);
  }
};

const handleItemImageUpload = (e) => {
  itemForm.value.image = e.target.files[0];
};

const submitItemForm = async () => {
  const formData = new FormData();
  formData.append("name", itemForm.value.name);
  formData.append("description", itemForm.value.description);
  formData.append("price", itemForm.value.price);
  formData.append("detail", itemForm.value.detail);
  formData.append("category_id", currentCategoryId.value);
  if (itemForm.value.image) formData.append("image", itemForm.value.image);

  try {
    const url = editingItem.value
      ? `http://127.0.0.1:8000/api/menu/update/${editingItemId.value}`
      : "http://127.0.0.1:8000/api/menu/create";

    await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    await viewItems(currentCategoryId.value);
    resetItemForm();
  } catch (err) {
    console.error("Lỗi khi lưu món ăn:", err);
  }
};

const editItem = (item) => {
  itemForm.value = {
    name: item.name,
    description: item.description,
    price: item.price,
    detail: item.detail,
    image: null,
  };
  editingItem.value = true;
  editingItemId.value = item.id;
  showAddItemForm.value = true;
};

const deleteItem = async (id) => {
  if (confirm("Xóa món này?")) {
    try {
      await axios.get(`http://127.0.0.1:8000/api/menu/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await viewItems(currentCategoryId.value);
    } catch (err) {
      console.error("Lỗi xoá món:", err);
    }
  }
};

const resetItemForm = () => {
  editingItem.value = false;
  editingItemId.value = null;
  showAddItemForm.value = false;
  itemForm.value = {
    name: "",
    description: "",
    price: "",
    detail: "",
    image: null,
  };
};

onMounted(fetchCategories);
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th,
td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
th {
  background: #eee;
}
button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
.form {
  margin-top: 2rem;
}
form input,
form textarea {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.4rem;
  width: 100%;
  max-width: 400px;
}

.menu-items-section {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.menu-items-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #333;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

.menu-item img {
  width: 60px;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
}

.menu-item-info {
  flex-grow: 1;
}

.menu-item-info strong {
  display: block;
  font-size: 1rem;
  color: #222;
}

.menu-item-info span {
  font-size: 0.9rem;
  color: #555;
}

.menu-item button {
  margin-left: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}

.menu-item button:last-child {
  background-color: #dc3545;
}

.menu-item button:hover {
  opacity: 0.9;
}

.add-item-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: green;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

</style>
