export const NEXT_PUBLIC_API_URL= "http://localhost:8080/restaurateur/api";
export const API_ROUTES = {
    restaurants: "http://localhost:8080/restaurateur/api/restaurant",
  };

export const COLORS = {
  primary: '#76C893',
  secondary: '#168AAD',

  status: {
    lightest: '#B5E48C',  
    lighter: '#99D98C',   
    light: '#76C893',      
    medium: '#52B69A',     
    dark: '#34A0A4',       
    darker: '#168AAD',    
    darkest: '#1A759F',  
  },

  success: '#76C893',
  info: '#168AAD',
  warning: '#B5E48C',
  error: '#1A759F',

  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    accent: '#76C893',
  },
  
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    accent: '#76C893',
    inverse: '#ffffff',
  },
} as const;

export const ORDER_STATUS_COLORS: Record<string, string> = {
  'total': COLORS.status.lightest,
  'pending': COLORS.status.lighter,
  'en attente': COLORS.status.lighter,
  'en attente de l\'acceptation du restaurant': COLORS.status.lighter,
  'accepted': COLORS.status.light,
  'accepté': COLORS.status.light,
  'preparing': COLORS.status.medium,
  'en préparation': COLORS.status.medium,
  'ready': COLORS.status.dark,
  'prêt': COLORS.status.dark,
  'delivered': COLORS.status.darker,
  'livré': COLORS.status.darker,
  'cancelled': COLORS.status.darkest,
  'annulé': COLORS.status.darkest,
};

export const ORDER_STATUS_TEXT_COLORS: Record<string, string> = {
  'total': COLORS.text.primary,
  'pending': COLORS.text.primary,
  'en attente': COLORS.text.primary,
  'en attente de l\'acceptation du restaurant': COLORS.text.primary,
  'accepted': COLORS.text.primary,
  'accepté': COLORS.text.primary,
  'preparing': COLORS.text.primary,
  'en préparation': COLORS.text.primary,
  'ready': COLORS.text.primary,
  'prêt': COLORS.text.primary,
  'delivered': COLORS.text.inverse,
  'livré': COLORS.text.inverse,
  'cancelled': COLORS.text.inverse,
  'annulé': COLORS.text.inverse,
};

export const colors = {
  submit: COLORS.primary,
  secondary: COLORS.status.dark,
};
  