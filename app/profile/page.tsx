"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import { useOrders } from "@/components/hooks/useOrders";
import { useAllRestaurantOrders } from "@/components/hooks/useAllRestaurantOrders";
import { useCurrentUser } from "@/components/hooks/useCurrentUser";
import { COLORS, ORDER_STATUS_COLORS, ORDER_STATUS_TEXT_COLORS } from "@/app/constants";
import {
  User,
  Store,
  ShoppingBag,
  Star,
  MapPin,
  Mail,
  Clock,
  Plus,
  BarChart3,
  Settings,
  Eye,
  ArrowRight,
  Calendar,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/shadcn/sonner";
import LogoutSection from "@/components/ui/GoodFood/logout/Logout";

const ProfilePage = () => {
  const router = useRouter();
  
  const { user, restaurants, loading: userLoading, error: userError } = useCurrentUser();
  
  const firstUserId = user?.id || 11;
  const { allOrders, loading: ordersLoading } = useAllRestaurantOrders(firstUserId);

  const [todayOrders, setTodayOrders] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState('0');
  const [averageRating, setAverageRating] = useState('4.7');

  useEffect(() => {
    setTodayOrders(Math.floor(Math.random() * 25) + 5);
    setMonthlyRevenue((Math.random() * 15000 + 8000).toFixed(0));
    setAverageRating(`4.${Math.floor(Math.random() * 3) + 7}`);
  }, []);

  const displayName = user?.first_name && user?.last_name 
    ? `${user.first_name} ${user.last_name}`
    : user?.email?.split('@')[0] || 'Utilisateur';

  const joinDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : 'Récemment';

  const totalRestaurants = restaurants.length;
  const openRestaurants = restaurants.filter(r => r.is_open).length;
  const totalOrders = allOrders.length;

  const calculateOrderTotal = (order: any) => {
    if (!order.orderItems || !Array.isArray(order.orderItems)) return 0;
    return order.orderItems.reduce((total: number, item: any) => {
      const itemPrice = typeof item.menuItem?.price === 'number' ? item.menuItem.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
      return total + (itemPrice * quantity);
    }, 0);
  };

  const getStatusCounts = () => {
    const counts = { pending: 0, accepted: 0, preparing: 0, ready: 0, delivered: 0, cancelled: 0 };
    allOrders.forEach(order => {
      const statusString = typeof order.status === 'object' ? order.status.name?.toLowerCase() : String(order.status).toLowerCase();
      if (statusString.includes('attente') || statusString === 'pending') counts.pending++;
      else if (statusString === 'accepted') counts.accepted++;
      else if (statusString === 'preparing') counts.preparing++;
      else if (statusString === 'ready') counts.ready++;
      else if (statusString === 'delivered') counts.delivered++;
      else if (statusString === 'cancelled') counts.cancelled++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  const quickActions = [
    {
      title: "Nouveau Restaurant",
      description: "Créer un nouveau restaurant",
      icon: <Store className="w-6 h-6" />,
      action: () => router.push("/create-company"),
      color: COLORS.primary,
      bgColor: `${COLORS.primary}15`,
      badge: "Nouveau"
    },
    {
      title: "Voir Commandes",
      description: `${totalOrders} commandes en cours`,
      icon: <ShoppingBag className="w-6 h-6" />,
      action: () => router.push("/orders"),
      color: COLORS.secondary,
      bgColor: `${COLORS.secondary}15`,
      badge: totalOrders > 0 ? `${totalOrders}` : null
    },
    {
      title: "Mes Restaurants",
      description: `Gérer ${totalRestaurants} restaurant${totalRestaurants > 1 ? 's' : ''}`,
      icon: <Store className="w-6 h-6" />,
      action: () => router.push("/restaurants"),
      color: COLORS.success,
      bgColor: `${COLORS.success}15`,
      badge: openRestaurants > 0 ? `${openRestaurants} ouvert${openRestaurants > 1 ? 's' : ''}` : null
    },
    {
      title: "Paramètres",
      description: "Configurer mon compte",
      icon: <Settings className="w-6 h-6" />,
      action: () => toast.info("Bientôt disponible"),
      color: COLORS.text.secondary,
      bgColor: `${COLORS.text.secondary}15`,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {userLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primary }}></div>
          </div>
        )}

        {userError && (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
              <p className="text-red-800 font-medium">Erreur lors du chargement des données utilisateur</p>
              <p className="text-red-600 text-sm mt-2">{userError}</p>
            </div>
          </div>
        )}
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: COLORS.primary }}>
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
          <p className="text-gray-600 text-lg">Bienvenue, {displayName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: COLORS.primary }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full" style={{ backgroundColor: COLORS.primary + '20' }}>
                  <Store className="w-6 h-6" style={{ color: COLORS.primary }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mes Restaurants</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRestaurants}</p>
                  <p className="text-xs text-green-600">{openRestaurants} ouverts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: COLORS.secondary }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full" style={{ backgroundColor: COLORS.secondary + '20' }}>
                  <ShoppingBag className="w-6 h-6" style={{ color: COLORS.secondary }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Commandes Total</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                  <p className="text-xs text-blue-600">{todayOrders} aujourd'hui</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: COLORS.success }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full" style={{ backgroundColor: COLORS.success + '20' }}>
                  <DollarSign className="w-6 h-6" style={{ color: COLORS.success }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">CA du Mois</p>
                  <p className="text-2xl font-bold text-gray-900">€{monthlyRevenue}</p>
                  <p className="text-xs text-green-600">+12% vs dernier mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: COLORS.warning }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full" style={{ backgroundColor: COLORS.warning + '20' }}>
                  <Star className="w-6 h-6" style={{ color: COLORS.warning }} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
                  <p className="text-xs text-yellow-600">Sur {totalOrders} avis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            
            <Card className="bg-white shadow-lg border-0">
              <CardHeader 
                className="text-white rounded-t-lg"
                style={{ 
                  background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})` 
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {userLoading ? 'Chargement...' : displayName}
                    </h2>
                    <p className="text-white/80">Restaurateur</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {userLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: COLORS.primary }}></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{user?.email || 'Non disponible'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">ID: {user?.id || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Membre depuis {joinDate}</span>
                    </div>
                  </>
                )}
                <div className="pt-4 border-t">
                  <LogoutSection />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Actions Rapides</h3>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 flex items-center space-x-4 group relative"
                    style={{ backgroundColor: action.bgColor }}
                  >
                    <div className="p-2 rounded-lg" style={{ backgroundColor: action.color + '20' }}>
                      {React.cloneElement(action.icon, { style: { color: action.color } })}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            
            <Card className="bg-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Mes Restaurants</h3>
                <Button 
                  onClick={() => router.push("/restaurants")}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {userLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: COLORS.primary }}></div>
                  </div>
                ) : restaurants.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Aucun restaurant trouvé</p>
                    <Button onClick={() => router.push("/create-company")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer mon premier restaurant
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {restaurants.slice(0, 4).map((restaurant) => (
                      <div 
                        key={restaurant.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                        onClick={() => router.push(`/restaurants/${restaurant.id}`)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 truncate flex-1">{restaurant.name}</h4>
                          <Badge 
                            variant={restaurant.is_open ? "default" : "secondary"}
                            className={`ml-2 ${restaurant.is_open ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                          >
                            {restaurant.is_open ? "Ouvert" : "Fermé"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">{restaurant.description || "Aucune description"}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>Restaurant #{restaurant.id}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{restaurant.is_open ? "Actif" : "Inactif"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Aperçu des Commandes</h3>
                <Button 
                  onClick={() => router.push("/orders")}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: COLORS.primary }}></div>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                      {[
                        { key: 'pending', label: 'En attente', color: ORDER_STATUS_COLORS.pending },
                        { key: 'accepted', label: 'Acceptées', color: ORDER_STATUS_COLORS.accepted },
                        { key: 'preparing', label: 'Préparation', color: ORDER_STATUS_COLORS.preparing },
                        { key: 'ready', label: 'Prêtes', color: ORDER_STATUS_COLORS.ready },
                        { key: 'delivered', label: 'Livrées', color: ORDER_STATUS_COLORS.delivered },
                        { key: 'cancelled', label: 'Annulées', color: ORDER_STATUS_COLORS.cancelled }
                      ].map((status) => (
                        <div 
                          key={status.key}
                          className="text-center p-3 rounded-lg"
                          style={{ backgroundColor: status.color }}
                        >
                          <div 
                            className="text-lg font-bold"
                            style={{ color: ORDER_STATUS_TEXT_COLORS[status.key as keyof typeof ORDER_STATUS_TEXT_COLORS] }}
                          >
                            {statusCounts[status.key as keyof typeof statusCounts]}
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: ORDER_STATUS_TEXT_COLORS[status.key as keyof typeof ORDER_STATUS_TEXT_COLORS] }}
                          >
                            {status.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {allOrders.length === 0 ? (
                      <div className="text-center py-6">
                        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucune commande récente</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 mb-3">Commandes Récentes</h4>
                        {allOrders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: ORDER_STATUS_COLORS.pending }}
                              ></div>
                              <div>
                                <p className="font-medium text-sm">Commande #{order.id}</p>
                                <p className="text-xs text-gray-500">
                                  {order.orderItems?.length || 0} articles • €{calculateOrderTotal(order).toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {typeof order.status === 'object' ? order.status.name : order.status}
                              </Badge>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/orders`);
                                }}
                                className="text-blue-500 hover:text-blue-700 text-xs"
                              >
                                Voir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {restaurants.length > 0 && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Plus className="w-5 h-5 mr-2" style={{ color: COLORS.primary }} />
                  Actions Rapides - Menu
                </h3>
                <Badge variant="outline" className="text-xs">
                  {restaurants.length} restaurant{restaurants.length > 1 ? 's' : ''} disponible{restaurants.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => router.push(`/restaurants/${restaurants[0].id}/items`)}
                  className="p-6 h-auto flex flex-col items-center space-y-2 border-2 border-dashed hover:bg-blue-50 transition-colors"
                  variant="outline"
                >
                  <Plus className="w-8 h-8 text-blue-500" />
                  <span className="font-medium">Créer un Menu</span>
                  <span className="text-sm text-gray-500">Nouveau menu pour un restaurant</span>
                </Button>
                
                <Button
                  onClick={() => {
                    if (restaurants.length > 0) {
                      router.push(`/restaurants/${restaurants[0].id}`);
                    }
                  }}
                  className="p-6 h-auto flex flex-col items-center space-y-2 border-2 border-dashed hover:bg-green-50 transition-colors"
                  variant="outline"
                >
                  <Eye className="w-8 h-8 text-green-500" />
                  <span className="font-medium">Gérer Menu</span>
                  <span className="text-sm text-gray-500">Modifier menu existant</span>
                </Button>

                <Button
                  onClick={() => router.push("/stats")}
                  className="p-6 h-auto flex flex-col items-center space-y-2 border-2 border-dashed hover:bg-yellow-50 transition-colors"
                  variant="outline"
                >
                  <BarChart3 className="w-8 h-8 text-yellow-500" />
                  <span className="font-medium">Voir Stats</span>
                  <span className="text-sm text-gray-500">Performance des menus</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
