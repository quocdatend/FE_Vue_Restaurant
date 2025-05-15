<template>
  <div>
    <h2>Quản lý Party</h2>
    <button @click="openForm" style="background-color:green">Thêm Party</button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên Party</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="party in parties" :key="party.party_id">
          <td>{{ party.party_id }}</td>
          <td>{{ party.name }}</td>
          <td>
            <button @click="editParty(party)" style="background-color:blue">Sửa</button>
            <button @click="deleteParty(party.party_id)" style="background-color:red">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form -->
    <div v-if="showForm" class="form">
      <h3>{{ editing ? 'Chỉnh sửa Party' : 'Thêm Party' }}</h3>
      <form @submit.prevent="submitForm">
        <input v-model="form.name" placeholder="Tên Party" required />
        <button type="submit" style="background-color:green">{{ editing ? 'Cập nhật' : 'Thêm' }}</button>
        <button type="button" style="background-color:red" @click="resetForm">Hủy</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const parties = ref([]);
const showForm = ref(false);
const editing = ref(false);
const editingId = ref(null);
const form = ref({ name: '' });

const fetchParties = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Chưa có token, không thể tải dữ liệu.');
      return;
    }
    const res = await axios.get('http://127.0.0.1:8000/api/party', {
      headers: { Authorization: `Bearer ${token}` },
    });
    parties.value = res.data.parties;
  } catch (err) {
    console.error('Lỗi tải party:', err);
  }
};

const openForm = () => {
  showForm.value = true;
  editing.value = false;
  editingId.value = null;
  form.value = { name: '' };
};

const submitForm = async () => {
  try {
    if (editing.value) {
      await axios.post(`http://127.0.0.1:8000/api/party/updateByPartyId/${editingId.value}`, {
        name: form.value.name,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } else {
      await axios.post('http://127.0.0.1:8000/api/party/create', {
        name: form.value.name,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    }
    fetchParties();
    resetForm();
  } catch (err) {
    console.error('Lỗi gửi dữ liệu party:', err);
  }
};

const editParty = (party) => {
  showForm.value = true;
  editing.value = true;
  editingId.value = party.party_id;
  form.value.name = party.name;
};

const deleteParty = async (id) => {
  if (confirm('Bạn có chắc muốn xoá party này?')) {
    try {
      await axios.get(`http://127.0.0.1:8000/api/party/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchParties();
    } catch (err) {
      console.error('Lỗi xoá party:', err);
    }
  }
};

const resetForm = () => {
  showForm.value = false;
  editing.value = false;
  editingId.value = null;
  form.value.name = '';
};

onMounted(fetchParties);
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
  margin-top: 1rem;
}
form input {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.4rem;
  width: 100%;
  max-width: 300px;
}
</style>
