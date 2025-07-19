export const ORDER_STATUS_LABELS = {
  pending: "En attente",
  accepted: "Acceptée",
  preparing: "En préparation",
  ready: "Prête",
  delivered: "Livrée",
  cancelled: "Annulée",
} as const;

export const ORDER_STATUS_BADGE_CLASSES = {
  pending: `text-gray-800 border`,
  accepted: `text-gray-800 border`,
  preparing: `text-gray-800 border`,
  ready: `text-gray-800 border`,
  delivered: `text-white border`,
  cancelled: `text-white border`,
} as const;

export const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-orange-100 text-orange-800 border-orange-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  delivered: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
} as const;

export const ORDER_STATUS_FLOW = {
  pending: ["accepted", "cancelled"],
  accepted: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["delivered"],
  delivered: [],
  cancelled: [],
} as const;

export const TEXTS = {
  pageTitle: "Gestion des commandes",
  pageSubtitle: "Suivez et gérez toutes vos commandes en temps réel",
  noOrders: "Aucune commande",
  noOrdersDescription: "Vous n'avez pas encore reçu de commandes.",
  loadingOrders: "Chargement des commandes...",
  refreshButton: "Actualiser",
  orderDetailsTitle: "Détails de la commande",
  customerInfo: "Informations client",
  orderItems: "Articles commandés",
  notes: "Notes",
  statusActions: "Actions sur le statut",
  deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette commande ?",
} as const;
