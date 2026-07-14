/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主品牌色：成长绿（年轻 + 护眼契合）
        brand: {
          50: '#f0fbf4',
          100: '#dcf5e6',
          200: '#bcebd0',
          300: '#8ddaae',
          400: '#57c085',
          500: '#33a566',
          600: '#238551',
          700: '#1e6a43',
          800: '#1b5437',
          900: '#18452f',
        },
        // 学科色板（区分分科）
        chinese: '#ef6c5a',
        math: '#3b82f6',
        english: '#a855f7',
        physics: '#f59e0b',
        chemistry: '#10b981',
        biology: '#84cc16',
        history: '#b45309',
        geography: '#0ea5e9',
        politics: '#ec4899',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'PingFang SC',
          'Microsoft YaHei',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 8px 24px -8px rgb(0 0 0 / 0.12)',
      },
    },
  },
  plugins: [],
}
