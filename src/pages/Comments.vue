<template>
  <div class="comments">
    <h2>💬 Bình luận của khách hàng</h2>
    <div v-for="comment in comments" :key="comment.id" class="comment-card">
      <div class="info">
        <strong>{{ comment.name }}</strong>
        <span>{{ formatDate(comment.created_at) }}</span>
      </div>
      <div class="info">
        <p class="message">"{{ comment.comment }}"</p>
        <p class="user-rating">
          <span class="stars">
            <span v-for="n in 5" :key="n">
              {{ n <= comment.rating ? "★" : "☆" }}
            </span>
          </span>
        </p>
      </div>
    </div>
  </div>
  <div class="comment-form">
    <form @submit.prevent="submitComment">
      <div class="form-group">
        <label for="comment">Bình luận của bạn:</label>
        <textarea
          v-model="comment"
          id="comment"
          rows="4"
          required
          placeholder="Nhập nội dung bình luận..."
        ></textarea>
      </div>

      <div class="form-group">
        <label>Đánh giá:</label>
        <vue3-star-ratings
          v-model="rating"
          :star-size="30"
          :number-of-stars="5"
          :step="1"
          star-color="#ED8A19"
          inactive-color="#ccc"
        />
      </div>

      <button type="submit">Gửi bình luận</button>
    </form>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import vue3StarRatings from "vue3-star-ratings";
import axios from "axios";

const comments = ref([]);
const comment = ref("");
const rating = ref(0);
const successMessage = ref("");
const errorMessage = ref("");

const fetchComments = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/review");
    comments.value = response.data.reviews;
  } catch (error) {
    console.error("Lỗi khi tải bình luận:", error);
  }
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};

onMounted(() => {
  fetchComments();
});

const submitComment = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }

  try {
    console.log("Bình luận đã được gửi:", rating.value);
    const response = await axios.post(
      "http://127.0.0.1:8000/api/review/create",
      {
        comment: comment.value,
        rating: Math.round(rating.value),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    successMessage.value = "Bình luận của bạn đã được gửi thành công!";
    errorMessage.value = "";
    comment.value = "";
    rating.value = 0;
  } catch (error) {
    console.error("Lỗi khi gửi bình luận:", error);
    errorMessage.value = "Đã xảy ra lỗi khi gửi bình luận. Vui lòng thử lại.";
    successMessage.value = "";
  }
};
</script>

<style scoped>
.comment-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

textarea {
  width: 100%;
  padding: 0.5rem;
  margin-right: 1rem;
  resize: vertical;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #ed8a19;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #d97706;
}

.success-message {
  margin-top: 1rem;
  color: green;
}

.error-message {
  margin-top: 1rem;
  color: red;
}

.comments {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.comments h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.comment-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.comment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.comment-card .info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.comment-card .info strong {
  color: #222;
}

.comment-card .message {
  font-size: 1rem;
  line-height: 1.5;
  color: #444;
  margin: 0;
}

.user-rating .stars {
  color: #ed8a19; /* Màu sao đã đánh giá */
  font-size: 1.2rem;
  letter-spacing: 2px;
}
</style>
