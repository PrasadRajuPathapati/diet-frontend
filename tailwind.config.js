// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5", // or your preferred brand color
        background: "#ffffff",
        foreground: "#000000",
        accent: "#f1f5f9",
        'accent-foreground': "#000000",
        input: "#d1d5db",
      },
    },
  },
  plugins: [],
};
