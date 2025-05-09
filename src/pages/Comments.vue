<template>
  <div class="comment-form">
    <form @submit.prevent="submitComment">
      <div class="form-group">
        <label for="comment">Bình luận của bạn:</label>
        <textarea v-model="comment" id="comment" rows="4" required></textarea>
      </div>

      <div class="form-group">
        <label>Đánh giá:</label>
        <vue3-star-ratings v-model="rating" :star-size="25" :number-of-stars="5" star-color="#ED8A19" inactive-color="#ccc" />
      </div>

      <button type="submit">Gửi bình luận</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import vue3StarRatings from 'vue3-star-ratings';
import axios from 'axios';
const comment = ref('');
const rating = ref(0);

const submitComment = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  
};
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
}
</style>
