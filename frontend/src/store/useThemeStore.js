import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "dark",

  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },

  initTheme: () => {
    const savedTheme = localStorage.getItem("chat-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    set({ theme: savedTheme });
  },
}));

// Initialize theme on app load
if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem("chat-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
}
