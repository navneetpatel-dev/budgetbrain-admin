import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-muted': 'var(--primary-muted)',
        'primary-soft': 'var(--primary-soft)',
        'primary-hover': 'var(--primary-hover)',
        'on-primary': 'var(--on-primary)',

        secondary: 'var(--secondary)',
        'secondary-fixed': 'var(--secondary-fixed)',
        'secondary-soft': 'var(--secondary-soft)',

        violet: 'var(--violet)',
        rose: 'var(--rose)',
        ocean: 'var(--ocean)',

        'gradient-start': 'var(--gradient-start)',
        'gradient-mid': 'var(--gradient-mid)',
        'gradient-end': 'var(--gradient-end)',

        bg: 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        surface: 'var(--surface)',
        'surface-low': 'var(--surface-low)',
        'surface-high': 'var(--surface-high)',
        'surface-highest': 'var(--surface-highest)',
        'surface-elevated': 'var(--surface-elevated)',
        'surface-hover': 'var(--surface-hover)',

        border: 'var(--border)',
        'border-subtle': 'var(--border-subtle)',

        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',

        success: 'var(--success)',
        'success-soft': 'var(--success-soft)',
        danger: 'var(--danger)',
        'danger-soft': 'var(--danger-soft)',
        warning: 'var(--warning)',
        'warning-soft': 'var(--warning-soft)',

        'input-bg': 'var(--input-bg)',
        overlay: 'var(--overlay)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        card: 'var(--radius-card)',
        xl: 'var(--radius-xl)',
        nav: 'var(--radius-nav)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      width: {
        sidebar: 'var(--sidebar-width)',
      },
    },
  },
  plugins: [],
};

export default config;
