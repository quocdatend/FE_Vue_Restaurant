<template>
    <div style="margin-bottom: 1.5rem;">
        <h2>Chi tiết Đơn hàng: {{ orderId }}</h2>

        <table v-if="orderItems.length">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên Món</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Tổng giá</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in orderItems" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.menu_name || 'Đang tải...' }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ formatPrice(item.price) }}</td>
                    <td>{{ formatPrice(item.total_price) }}</td>
                </tr>
            </tbody>
        </table>

        <p v-else>Không có dữ liệu đơn hàng.</p>
    </div>
    <router-link to="/dashboard/orders" class="link" style="padding: 8px 20px;
    text-decoration: none;
    border: 1px solid #000;
    border-radius: 14px;
    color: #000;"> << Quay lại</router-link>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const orderId = route.query.orderId || '';

const orderItems = ref([]);

const fetchOrderItems = async () => {
    if (!orderId) return;

    const token = localStorage.getItem('token');

    try {
        const res = await axios.get(`http://127.0.0.1:8000/api/order-item/findByOrder/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const items = res.data.order_items || [];

        // Lấy tên món theo menu_id
        for (const item of items) {
            const menuRes = await axios.get(`http://127.0.0.1:8000/api/menu/find/${item.menu_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            item.menu_name = menuRes.data.menu.name || 'Không xác định';
        }

        orderItems.value = items;
    } catch (err) {
        console.error('Lỗi khi tải order items:', err);
    }
};

const formatPrice = (val) => {
    return Number(val).toLocaleString('vi-VN') + ' ₫';
};

onMounted(fetchOrderItems);
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
    background: #f0f0f0;
}
</style>
