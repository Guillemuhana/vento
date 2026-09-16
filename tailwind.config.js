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
        // Amarillo de promos ("ENVÍO GRATIS") — siempre con texto negro.
        promo: {
          DEFAULT: '#FFE000',
          soft: '#FFF3A8',
        },
        // Fondos pastel de los tiles de categoría del home.
        tile: {
          peach: '#FDEEE6',
          peachInk: '#8A3A21',
          mint: '#DFF1EC',
          mintInk: '#1F6F63',
          lilac: '#EDEAFB',
          lilacInk: '#4B3F9E',
          butter: '#FDF2D8',
          butterInk: '#8A6212',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.08)',
        float: '0 8px 24px rgba(16,24,40,0.12)',
        // Sombra difusa de la nav flotante y de la search bar del home.
        pill: '0 6px 20px rgba(16,24,40,0.10), 0 2px 6px rgba(16,24,40,0.06)',
      },
      borderRadius: {
        xl2: '1.25rem',
        '4xl': '2rem',
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom, 0px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.18s ease-out',
      },
    },
  },
  plugins: [],
}
