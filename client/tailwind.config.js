module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#1a73e8",
        secondary: "#5f6368",
        success: "#34a853",
        warning: "#fbbc05",
        error: "#ea4335",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
