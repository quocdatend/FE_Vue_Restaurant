import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    admin: null,
  }),

  actions: {
    // Đảm bảo khi store được khởi tạo, initialize luôn được gọi
    // async initialize() {
    //   const token = localStorage.getItem("token");
    //   if (token) {
    //     console.log("Token found in localStorage:", token);
    //     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //     await this.fetchUser(); // Tải thông tin người dùng
    //   }
    // },

    async login(email, password) {
      const res = await api.post("/login", { email, password });
      const token = res.data.access_token;
      this.user = res.data.user;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    async loginAdmin(email, password) {
      const res = await api.post("/login", { email, password });
      const token = res.data.access_token;
      this.admin = res.data.user;
      if(this.admin.role !== "admin") {
        console.error("Không phải là admin");
        return;
      }
      localStorage.setItem("token", token);
      // api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    async fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      } else {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await api.get("/user/profile");
          this.user = res.data.user;
        } catch (err) {
          console.error("Không thể lấy thông tin người dùng:", err);
          this.logout();
        }
      }
    },

    async fetchAdmin() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      } else {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await api.get("/admin/dashboard");
          this.admin = res.data.user;
        } catch (err) {
          console.error("Không thể lấy thông tin admin:", err);
          this.logout();
        }
      }
    },

    async register(name, email, password) {
      const res = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: password,
      });
      const token = res.data.access_token;
      this.user = res.data.user;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    logout() {
      this.user = null;
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    },
  },
});
