import { defineStore } from 'pinia';
import api from '../services/api';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(email, password) {
      const res = await api.post('/login', { email, password });
      this.user = res.data.user;
      // Save the token in local storage or a cookie
      localStorage.setItem('token', res.data.access_token);
    },
    async fetchUser() {
      const res = await api.get('/user');
      this.user = res.data;
    },
    async register(name, email, password) {
      return api.post('/register', { name, email, password, password_confirmation: password })
        .then(res => {
          this.user = res.data.user;
        });
    },
    async logout() {
      await axios.post('/logout', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      this.user = null;
      // Remove the token from local storage or a cookie
      localStorage.removeItem('token');
    },
  },
});
