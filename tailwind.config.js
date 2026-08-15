/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1A4095',   // primary navy — headers, nav, key text
          dark: '#0E2A5C',      // deep ink — footer, hero backdrop
          light: '#EAF1FC'      // tint for cards/badges
        },
        action: {
          DEFAULT: '#28C0F4',   // buttons / interactive accent
          dark: '#139FCB'
        },
        gold: {
          DEFAULT: '#F2A93B',   // certificates / achievement accent
          light: '#FCEBCB'
        },
        success: '#1FAE6B',
        ink: '#1F2937'
      },
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace']
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      boxShadow: {
        card: '0 1px 2px rgba(14,42,92,0.06), 0 8px 24px -12px rgba(14,42,92,0.18)'
      },
      keyframes: {
        ringfill: { from: { strokeDashoffset: 'var(--ring-start)' }, to: { strokeDashoffset: 'var(--ring-end)' } }
      }
    }
  },
  plugins: []
};
