import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(email, password) {
      const res = await api.post('/login', { email, password });
      this.user = res.data.user;
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
    logout() {
      this.user = null;
    },
  },
});
