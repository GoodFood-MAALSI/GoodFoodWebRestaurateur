export const STATS_REFRESH_INTERVAL = 30000; // 30 seconds

export const STATS_CARD_COLORS = {
  orders: '#76C893',
  revenue: '#168AAD', 
  items: '#52B69A',
  average: '#1A759F'
} as const;

export const STATS_MESSAGES = {
  loading: "Chargement des statistiques...",
  error: "Erreur lors du chargement des statistiques",
  noData: "Aucune donnée disponible",
  noRestaurant: "Sélectionnez un restaurant pour voir ses statistiques"
} as const;
