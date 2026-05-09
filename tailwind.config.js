/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        lg: '3px',
        md: '3px',
        sm: '2px',
        DEFAULT: '0px',
        full: '9999px',
      },
      colors: {
        background: '#FFFFFF',
        foreground: '#111111',
        card: { DEFAULT: '#FFFFFF', foreground: '#111111' },
        popover: { DEFAULT: '#FFFFFF', foreground: '#111111' },
        primary: { DEFAULT: '#111111', foreground: '#FFFFFF' },
        secondary: { DEFAULT: '#F7F7F7', foreground: '#111111' },
        muted: { DEFAULT: '#F7F7F7', foreground: '#666666' },
        accent: { DEFAULT: '#C8102E', foreground: '#FFFFFF' },
        destructive: { DEFAULT: '#C8102E', foreground: '#FFFFFF' },
        border: '#E5E5E5',
        input: '#E5E5E5',
        ring: '#C8102E',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
