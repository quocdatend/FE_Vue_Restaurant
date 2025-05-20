<template>
  <div class="edit-order">
    <h2>Chỉnh sửa đơn hàng</h2>

    <div class="order-section">
      <h3>Thông tin món đã đặt</h3>
      <div class="ordered-items">
        <div v-for="item in orderItems" :key="item.menu_id" class="ordered-item">
          <p><strong>{{ item.name }}</strong></p>
          <p>Giá: {{ item.price }} VND</p>
          <input type="number" v-model.number="item.quantity" min="1" @input="updateTotal(item)" />
          <p>Tổng: {{ item.total_price }} VND</p>
          <button class="delete-btn" @click="deleteOrderItem(item)">❌</button>
        </div>
      </div>
    </div>

    <div class="category-section">
      <h3>Danh mục món ăn</h3>
      <div class="category-list">
        <button v-for="cat in categories" :key="cat.id" @click="fetchMenus(cat.id)">
          {{ cat.name }}
        </button>
      </div>
    </div>

    <div v-if="menus.length" class="menus">
      <h3>Danh sách món ăn</h3>
      <div class="menu-grid">
        <div v-for="item in menus" :key="item.id" class="menu-item">
          <p><strong>{{ item.name }}</strong> - {{ item.price }} VND</p>
          <input type="number" v-model.number="quantities[item.id]" min="1" />
          <button @click="addToOrder(item)">Chọn</button>
        </div>
      </div>
    </div>

    <div class="actions">
      <button @click="saveItems">Lưu đơn hàng</button>
      <button @click="makePayment">Thanh toán</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const orderId = route.query.orderId;
const categories = ref([]);
const menus = ref([]);
const quantities = ref({});
const orderItems = ref([]);

const fetchCategories = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/category');
  categories.value = res.data.data;
};

const fetchMenus = async (categoryId) => {
  const res = await axios.get(`http://127.0.0.1:8000/api/menu/findByCategory/${categoryId}`);
  menus.value = res.data.menus;
};

const fetchOrderedItems = async () => {
  const res = await axios.get(`http://127.0.0.1:8000/api/order-item/findByOrder/${orderId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  const data = res.data.order_items;

  for (const item of data) {
    const menu = await fetchMenuDetail(item.menu_id);
    orderItems.value.push({
      id: item.id,
      order_id: item.order_id,
      menu_id: item.menu_id,
      name: menu.name,
      price: item.price,
      quantity: item.quantity,
      total_price: item.total_price
    });
  }
};

const fetchMenuDetail = async (menuId) => {
  const allMenus = menus.value.flat();
  return allMenus.find(m => m.id === menuId) || {};
};

const addToOrder = (item) => {
  const quantity = quantities.value[item.id] || 1;
  const existing = orderItems.value.find(i => i.menu_id === item.id);

  if (existing) {
    existing.quantity += quantity;
    updateTotal(existing);
  } else {
    const total = parseFloat(item.price) * quantity;
    orderItems.value.push({
      order_id: orderId,
      menu_id: item.id,
      name: item.name,
      quantity,
      price: item.price,
      total_price: total.toFixed(2)
    });
  }
  quantities.value[item.id] = 1;
};

const updateTotal = (item) => {
  item.total_price = (item.quantity * parseFloat(item.price)).toFixed(2);
};

const updateOrderTotal = async () => {
  const res = await axios.get(`http://127.0.0.1:8000/api/order-item/findByOrder/${orderId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const total = res.data.order_items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
  await axios.post(`http://127.0.0.1:8000/api/order/updatePrice/${orderId}`, {
    total_price: total.toFixed(2)
  }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

const saveItems = async () => {
  for (const item of orderItems.value) {
    if (item.id) {
      await axios.post(`http://127.0.0.1:8000/api/order-item/update/${item.id}`, item, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } else {
      await axios.post('http://127.0.0.1:8000/api/order-item/create', item, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    }
  }
  await updateOrderTotal();
  alert('Đã lưu đơn hàng và cập nhật tổng tiền!');
  // await fetchOrderedItems();
  location.reload();
};

const makePayment = async () => {
  const res = await axios.get(`http://127.0.0.1:8000/api/order-item/findByOrder/${orderId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  let items = res.data.order_items;
  let totalAmount = items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
  if (res.data.order_items.length == 0) {
    alert('Bạn chưa có món nào!');
  } else {
    const data =  await axios.post('http://127.0.0.1:8000/api/payment/create', { order_id: orderId, total_price: totalAmount }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const url = data.data.data;
    alert('Tiến hành thanh toán đơn hàng!');
    window.open(url, '_blank')
  }
};

const deleteOrderItem = async (item) => {
  if (item.id) {
    await axios.get(`http://127.0.0.1:8000/api/order-item/delete/${item.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    alert("Xoa thanh cong")
  }
  orderItems.value = orderItems.value.filter(i => i.menu_id !== item.menu_id);
  await updateOrderTotal();
};

onMounted(() => {
  fetchCategories();
  fetchOrderedItems();
});
</script>

<style scoped>
.edit-order {
  max-width: 900px;
  margin: auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.category-list button {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 5px;
  background-color: #00aaff;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.menu-item,
.ordered-item {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background-color: #fdfdfd;
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
  color: #c00;
  /* width: auto; */
}

.ordered-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  width: fit-content;
}

.actions {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.actions button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

button {
  width: auto;
}
</style>
