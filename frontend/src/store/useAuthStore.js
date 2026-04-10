import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  pendingEmail: null,
  isVerifyingOTP: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ isCheckingAuth: false });
      console.log("Error checking auth:", error.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({ pendingEmail: data.email });
      toast.success("OTP sent to your email!");
    } catch (error) {
      console.log("Signup error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyOTP: async (otp) => {
    set({ isVerifyingOTP: true });
    try {
      const { pendingEmail } = get();
      const res = await axiosInstance.post("/auth/verify-otp", {
        email: pendingEmail,
        otp,
      });
      set({ authUser: res.data, pendingEmail: null });
      toast.success("Email verified! Welcome 🎉");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      set({ isVerifyingOTP: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials and try again.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket();
    } catch (error) {
      console.log("Logout error:", error.response?.data || error.message);
      toast.error("Logout failed. Please try again.");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Update profile error:", error.response?.data || error.message);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      auth: { userId: authUser._id },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getonlineUsers", (usersIds) => {
      set({ onlineUsers: usersIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));