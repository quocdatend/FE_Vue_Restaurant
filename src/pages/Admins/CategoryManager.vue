<template>
  <div>
    <h2>Quản lý Danh mục</h2>
    <button @click="openForm" style="background-color:green">Thêm Danh mục</button>

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
          <td><img :src="imageUrl(cat.image)" alt="image" style="width: 50px; height: auto;" /></td>
          <td>
            <button @click="editCategory(cat)" style="background-color:blue">Sửa</button>
            <button @click="deleteCategory(cat.id)" style="background-color:red">Xoá</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="form" v-if="showForm">
      <h3>{{ editing ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục' }}</h3>
      <form @submit.prevent="submitForm">
        <input v-model="form.name" type="text" placeholder="Tên danh mục" required />
        <input type="file" @change="handleImageUpload" />
        <button type="submit" style="background-color:green">{{ editing ? 'Cập nhật' : 'Thêm' }}</button>
        <button type="button" style="background-color:red" @click="resetForm">Hủy</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const categories = ref([]);
const showForm = ref(false);
const editing = ref(false);
const editingId = ref(null);
const form = ref({ name: '', slug: '', image: null });

const imageUrl = (path) => `http://127.0.0.1:8000/storage/${path}`;

const fetchCategories = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/category');
    categories.value = res.data.categories;
  } catch (err) {
    console.error('Lỗi khi tải danh mục:', err);
  }
};

const openForm = () => {
  showForm.value = true;
  editing.value = false;
  editingId.value = null;
  form.value = { name: '', slug: '', image: null };
};

const handleImageUpload = (e) => {
  form.value.image = e.target.files[0];
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append('name', form.value.name);
  if (form.value.image) formData.append('image', form.value.image);

  try {
    if (editing.value) {
      await axios.post(`http://127.0.0.1:8000/api/category/update/${editingId.value}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
      });
    } else {
      await axios.post('http://127.0.0.1:8000/api/category/create', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
      });
    }
    fetchCategories();
    resetForm();
  } catch (err) {
    console.error('Lỗi gửi dữ liệu danh mục:', err);
  }
};

const editCategory = (cat) => {
  showForm.value = true;
  editing.value = true;
  editingId.value = cat.id;
  form.value = { name: cat.name, slug: cat.slug, image: null };
};

const deleteCategory = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xoá danh mục này?')) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/category/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchCategories();
    } catch (err) {
      console.error('Lỗi khi xoá danh mục:', err);
    }
  }
};

const resetForm = () => {
  showForm.value = false;
  editing.value = false;
  editingId.value = null;
  form.value = { name: '', slug: '', image: null };
};

onMounted(fetchCategories);
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
button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
.form {
  margin-top: 2rem;
}
form input {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.4rem;
  width: 100%;
  max-width: 300px;
}
</style>