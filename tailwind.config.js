module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#7c3aed',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        neutral: '#64748b',
      },
      backgroundColor: {
        base: '#f8fafc',
        card: '#ffffff',
      },
      textColor: {
        primary: '#0f172a',
        secondary: '#64748b',
      },
    },
  },
  plugins: [],
}
