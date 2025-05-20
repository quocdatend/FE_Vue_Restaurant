<template>
  <div class="orders">
    <h2>📦 Danh sách đơn hàng</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Khách hàng</th>
          <th>Ngày đặt</th>
          <th>Giờ đặt</th>
          <th>Yêu cầu đặc biệt</th>
          <th>Loại tiệc</th>
          <th>Số người</th>
          <th>Số điện thoại</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in orders" :key="order.order_id">
          <td>{{ index + 1 }}</td>
          <td>{{ order.customer_name }}</td>
          <td>{{ order.order_date }}</td>
          <td>{{ order.order_time }}</td>
          <td>{{ order.special_request_name }}</td>
          <td>{{ order.party_name }}</td>
          <td>{{ order.num_people }}</td>
          <td>{{ order.phone_number }}</td>
          <td>{{ order.total_price }}₫</td>
          <td :class="statusClass(order.status)">
            {{ statusText(order.status) }}
          </td>
          <td>
            <button v-if="order.status === 0" @click="editOrder(order)" style="background-color: blue">
              Chỉnh sửa
            </button>
            <button v-if="order.status === 0 || order.status === 1" @click="sendConfirm(order)"
              style="background-color: orange">
              Xin Xác Nhận
            </button>
            <button v-if="order.status === 1 || order.status === 0" @click="payOrder(order.order_id)"
              style="background-color: green">
              Thanh toán
            </button>
            <button v-if="order.status === 2 || order.status === 3 || order.status === 4 || order.status === 5"
              @click="viewOrder(order)" style="background-color: blue">
              Xem chi tiết
            </button>
            <button v-if="order.status === 0 || order.status === 1 || order.status === 4" @click="cancelOrder(order)"
              style="background-color: red">
              Hủy
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// check token
const token = localStorage.getItem("token");
if (!token) {
  alert("Vui lòng đăng nhập để xem đơn hàng.");
  window.location.href = "/";
}

const orders = ref([]);

const statusText = (status) => {
  switch (status) {
    case -2:
      return "Bị Hủy Đơn Đặt";
    case -1:
      return "Đã Hủy";
    case 0:
      return "Đang xử lý";
    case 1:
      return "Chưa Thanh Toán";
    case 2:
      return "Đã Thanh Toán";
    case 3:
      return "Hoàn Thành";
    case 4:
      return "Chờ Xác Nhận";
    case 5:
      return "Xác Nhận";
    default:
      return "Không xác định";
  }
};

const statusClass = (status) => {
  switch (status) {
    case -2:
      return "status-cancelled";
    case -1:
      return "status-cancelled";
    case 0:
      return "status-processing";
    case 1:
      return "status-unpaid";
    case 2:
      return "status-paid";
    case 3:
      return "status-completed";
    case 4:
      return "status-pending-confirmation";
    case 5:
      return "status-confirmed";
    default:
      return "";
  }
};

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://127.0.0.1:8000/api/order/findByUser",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const ordersData = response.data.orders;

    // Fetch special_request and party names
    const enrichedOrders = await Promise.all(
      ordersData.map(async (order) => {
        const [specialRequestRes, partyRes] = await Promise.all([
          axios.get(
            `http://127.0.0.1:8000/api/order-note/${order.special_request_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          axios.get(`http://127.0.0.1:8000/api/party/${order.party_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        return {
          ...order,
          special_request_name: specialRequestRes.data.data[0].note,
          party_name: partyRes.data.party.name,
        };
      })
    );

    orders.value = enrichedOrders;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
  }
};

const editOrder = (order) => {
  // Implement edit functionality
  console.log("Chỉnh sửa đơn hàng:", order);
  router.push({ path: '/dashboard/booking/order', query: { orderId: order.order_id } })
};

const sendConfirm = async (order) => {
  if (confirm("Bạn có chắc chắn muốn gửi xác nhận đơn hàng này (Bạn chưa thanh toán)?")) {
    try {
      const token = localStorage.getItem("token");
      await axios.get(
        `http://127.0.0.1:8000/api/order/confirmOrder/${order.order_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Đã gửi xác nhận!");
      fetchOrders(); // reload danh sách sau khi xác nhận
    } catch (error) {
      console.error("Lỗi khi gửi xác nhận đơn hàng:", error);
      alert("Đã xảy ra lỗi khi gửi xác nhận đơn hàng.");
    }
  } else {
    alert("Xác nhận đơn hàng đã bị hủy.");
  }
};

const cancelOrder = async (order) => {
  if (confirm("Bạn chắc chắn muốn hủy đơn hàng?")) {
    try {
      const token = localStorage.getItem("token");
      await axios.get(
        `http://127.0.0.1:8000/api/order/cancelByUser/${order.order_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Đơn hàng đã được hủy!");
      fetchOrders(); // reload danh sách sau khi hủy
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert("Đã xảy ra lỗi khi hủy đơn hàng.");
    }
  } else {
    alert("Hủy đơn hàng đã bị hủy.");
  }
};

const payOrder = async (orderId) => {
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

const viewOrder = (order) => {
  router.push({ path: '/dashboard/booking/order/detail', query: { orderId: order.order_id } })
};

onMounted(() => {
  fetchOrders();
});
</script>
<style scoped>
.orders {
  padding: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

tr:last-child td {
  border-bottom: none;
}

.status-processing {
  color: orange;
  font-weight: bold;
}

.status-unpaid {
  color: red;
  font-weight: bold;
}

.status-paid {
  color: green;
  font-weight: bold;
}

.status-completed {
  color: blue;
  font-weight: bold;
}

.status-cancelled {
  color: gray;
  font-weight: bold;
}

.status-pending-confirmation {
  /* background-color: #fdf5e6; */
  color: #d2691e;
  font-weight: bold;
}

.status-confirmed {
  /* background-color: #e6f7ff; */
  color: #007acc;
  font-weight: bold;
}

button {
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 5px;
}
</style>
