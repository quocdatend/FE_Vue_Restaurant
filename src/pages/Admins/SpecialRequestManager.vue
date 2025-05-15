<template>
  <div>
    <h2>Quản lý Ghi chú đơn hàng</h2>
    <button @click="openForm" style="background-color:green">Thêm Ghi chú</button>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Ghi chú</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="note in notes" :key="note.order_note_id">
          <td>{{ note.order_note_id }}</td>
          <td>{{ note.note }}</td>
          <td>
            <button @click="editNote(note)" style="background-color:blue">Sửa</button>
            <button @click="deleteNote(note.order_note_id)" style="background-color:red">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Form -->
    <div v-if="showForm" class="form">
      <h3>{{ editing ? "Chỉnh sửa Ghi chú" : "Thêm Ghi chú" }}</h3>
      <form @submit.prevent="submitForm">
        <input v-model="form.note" placeholder="Ghi chú" required />
        <button type="submit" style="background-color:green">{{ editing ? "Cập nhật" : "Thêm" }}</button>
        <button type="button" style="background-color:red" @click="resetForm">Hủy</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const notes = ref([]);
const showForm = ref(false);
const editing = ref(false);
const editingId = ref(null);
const form = ref({ note: "" });

const fetchNotes = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/order-note");
    notes.value = res.data.OrderNotes;
  } catch (err) {
    console.error("Lỗi tải ghi chú:", err);
  }
};

const openForm = () => {
  showForm.value = true;
  editing.value = false;
  editingId.value = null;
  form.value = { note: "" };
};

const submitForm = async () => {
  try {
    if (editing.value) {
      await axios.post(
        `http://127.0.0.1:8000/api/order-note/update/${editingId.value}`,
        {
          note: form.value.note,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } else {
      await axios.post(
        "http://127.0.0.1:8000/api/order-note/create",
        {
          note: form.value.note,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    }
    fetchNotes();
    resetForm();
  } catch (err) {
    console.error("Lỗi gửi ghi chú:", err);
  }
};

const editNote = (note) => {
  showForm.value = true;
  editing.value = true;
  editingId.value = note.order_note_id;
  form.value.note = note.note;
};

const deleteNote = async (id) => {
  if (confirm("Bạn có chắc muốn xoá ghi chú này?")) {
    try {
      await axios.get(`http://127.0.0.1:8000/api/order-note/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchNotes();
    } catch (err) {
      console.error("Lỗi xoá ghi chú:", err);
    }
  }
};

const resetForm = () => {
  showForm.value = false;
  editing.value = false;
  editingId.value = null;
  form.value.note = "";
};

onMounted(fetchNotes);
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
