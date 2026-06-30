tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#b11aa8',
          dark: '#8e1388',
          muted: '#7a6b8a',
        },
        surface: {
          dark: '#0d0820',
          footer: '#4a3d5a',
        },
        mint: {
          DEFAULT: '#cff7e8',
          dark: '#0d6e4e',
        },
      },
      boxShadow: {
        card: '0 4px 20px rgba(177, 26, 168, 0.07)',
        hero: '0 28px 72px rgba(177, 26, 168, 0.16)',
      },
    },
  },
};
