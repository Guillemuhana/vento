/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de marca Just Minutes: verde militar, naranja y crema.
        // El texto principal es el verde oscuro, no un gris neutro.
        ink: {
          DEFAULT: '#13312A',
          soft: '#3D564C',
          faint: '#5E7268',
        },
        base: {
          DEFAULT: '#FFFFFF',
          muted: '#F4F1E8',
          line: '#E4DFD2',
        },
        // Crema de fondo, el papel de todas las piezas de marca.
        cream: {
          DEFAULT: '#F7F4EC',
          deep: '#EFEADC',
        },
        // Verde militar del logo, las mochilas y la moto.
        forest: {
          50: '#EAF0ED',
          100: '#C9DAD2',
          400: '#2E5F4E',
          500: '#1B4437',
          600: '#13312A',
          700: '#0C231D',
        },
        // Naranja de marca: acentos, botones y subrayados.
        mango: {
          50: '#FFF2EB',
          100: '#FFDCC9',
          300: '#FFB08A',
          400: '#FF8C5A',
          500: '#F4692F',
          600: '#DB531C',
          700: '#B34115',
        },
        // Se mantiene el nombre `teal` porque lo usan los estados de "ok",
        // pero ahora es el mismo verde de la marca.
        teal: {
          50: '#EAF0ED',
          100: '#C9DAD2',
          400: '#2E5F4E',
          500: '#1B4437',
          600: '#13312A',
          700: '#0C231D',
        },
        danger: {
          400: '#F97066',
          500: '#DC2626',
          600: '#B42318',
        },
        // Badge de promos ("ENVÍO GRATIS") — siempre con texto oscuro.
        promo: {
          DEFAULT: '#FFC94A',
          soft: '#FFE9B8',
        },
        // Fondos de los tiles de categoría del home, todos dentro de la marca.
        tile: {
          peach: '#FDE9DD',
          peachInk: '#A8431B',
          mint: '#DFE9E3',
          mintInk: '#1B4437',
          lilac: '#EFEADC',
          lilacInk: '#5C5233',
          butter: '#FBEFD6',
          butterInk: '#8A6212',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(19,49,42,0.06), 0 1px 3px rgba(19,49,42,0.08)',
        float: '0 8px 24px rgba(19,49,42,0.12)',
        // Sombra difusa de la nav flotante y de la search bar del home.
        pill: '0 6px 20px rgba(19,49,42,0.10), 0 2px 6px rgba(19,49,42,0.06)',
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
