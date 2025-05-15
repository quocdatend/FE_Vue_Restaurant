<template>
  <div class="comment-form">
    <form @submit.prevent="submitComment">
      <div class="form-group">
        <label for="comment">Bình luận của bạn:</label>
        <textarea v-model="comment" id="comment" rows="4" required></textarea>
      </div>

      <div class="form-group">
        <label>Đánh giá:</label>
        <vue3-star-ratings
          v-model="rating"
          :star-size="25"
          :number-of-stars="5"
          star-color="#ED8A19"
          inactive-color="#ccc"
        />
      </div>

      <button type="submit">Gửi bình luận</button>
    </form>

    <hr />

    <div class="comments-list">
      <h3>Tất cả bình luận:</h3>
      <div v-if="comments.length === 0">Chưa có bình luận nào.</div>
      <ul v-else>
        <li v-for="(item, index) in comments" :key="index" class="comment-item">
          <p>
            <strong>{{ item.name }}</strong> - {{ item.created_at }}
          </p>
          <p>{{ item.comment }}</p>
          <vue3-star-ratings 
            v-model="item.rating"
            :star-size="25"
            :number-of-stars="5"
            star-color="#ED8A19"
            inactive-color="#ccc"
            :show-rating="false"
            :read-only="true"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import vue3StarRatings from "vue3-star-ratings";
import axios from "axios";

const comment = ref("");
const rating = ref(0);
const comments = ref([]);

const fetchComments = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/review");
    comments.value = response.data.reviews;
    console.log("Bình luận đã được tải thành công:", comments.value);
  } catch (error) {
    console.error("Lỗi khi tải bình luận:", error);
  }
};

const submitComment = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vui lòng đăng nhập để gửi bình luận.");
    return;
  }
  try {
    await axios.post(
      "http://127.0.0.1:8000/api/review/create",
      {
        comment: comment.value,
        rating: rating.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    alert("Gửi bình luận thành công!");
    comment.value = "";
    rating.value = 0;
    await fetchComments();
  } catch (error) {
    console.error("Lỗi khi gửi bình luận:", error);
    alert("Gửi bình luận thất bại!");
  }
};

onMounted(fetchComments);
</script>

<style scoped>
.comment-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  padding: 0.5rem;
  resize: vertical;
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

.comments-list {
  margin-top: 2rem;
}

.comments-list ul {
  padding-left: 0;
  list-style: none;
}

.comment-item {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.stars {
  margin-bottom: 0.5rem;
}

.star {
  color: #ccc;
  font-size: 20px;
}

.star.filled {
  color: #ed8a19;
}
</style>
