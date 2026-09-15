/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#101828',
          soft: '#344054',
          faint: '#667085',
        },
        base: {
          DEFAULT: '#FFFFFF',
          muted: '#F2F4F7',
          line: '#E4E7EC',
        },
        mango: {
          50: '#FFF2EC',
          100: '#FFDCCB',
          400: '#FF7A47',
          500: '#FF4A12',
          600: '#E23E00',
          700: '#B33100',
        },
        teal: {
          50: '#ECFDF3',
          100: '#D3F8DF',
          400: '#22C55E',
          500: '#15803D',
          600: '#116430',
          700: '#0D4D25',
        },
        danger: {
          400: '#F97066',
          500: '#DC2626',
          600: '#B42318',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.08)',
        float: '0 8px 24px rgba(16,24,40,0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
