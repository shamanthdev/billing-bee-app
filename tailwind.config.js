module.exports = {
  darkMode: "class", // IMPORTANT
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
 theme: {
  extend: {
    colors: {
      primary: "#FACC15",        // Yellow
      primaryHover: "#EAB308",
      surface: "#ffffff",
      surfaceDark: "#141414",
      borderLight: "#e5e7eb",
      borderDark: "#1f1f1f",
      textMuted: "#6b7280",
    },
    borderRadius: {
      xl: "14px",
    },
    boxShadow: {
      soft: "0 4px 12px rgba(0,0,0,0.06)",
      card: "0 6px 18px rgba(0,0,0,0.08)",
    },
  },
},
  plugins: [],
};