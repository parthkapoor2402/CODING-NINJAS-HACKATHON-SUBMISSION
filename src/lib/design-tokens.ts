/**
 * Design tokens — single source for programmatic access.
 * CSS variables in globals.css mirror these values.
 */
export const designTokens = {
  color: {
    civicBlue600: '#1565C0',
    civicBlue50: '#E3F2FD',
    civicTeal500: '#00897B',
    civicTeal50: '#E0F2F1',
    civicAmber500: '#F9A825',
    civicAmber50: '#FFF8E1',
    civicCoral500: '#E57373',
    neutral900: '#1A1A2E',
    neutral500: '#6B7280',
    neutral100: '#F3F4F6',
    surface: '#FFFFFF',
  },
  spacing: {
    pageX: '1rem',
    pageY: '1rem',
    cardPadding: '1rem',
    sectionGap: '1.5rem',
    touchMin: '44px',
  },
  radius: {
    card: '12px',
    sheet: '16px',
    chip: '9999px',
    button: '12px',
  },
  shadow: {
    card: '0 1px 3px rgba(0, 0, 0, 0.08)',
    elevated: '0 4px 20px rgba(21, 101, 192, 0.12)',
    fab: '0 6px 24px rgba(21, 101, 192, 0.35)',
  },
  typography: {
    display: '"Plus Jakarta Sans", Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
    },
  },
  motion: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const categoryColors: Record<string, string> = {
  pothole: '#795548',
  water_leak: '#2196F3',
  streetlight: '#FFC107',
  garbage: '#4CAF50',
  sanitation: '#00897B',
  infrastructure: '#9C27B0',
  other: '#6B7280',
};
