import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Order, OrderStatusType } from "@/types/order";
import { ORDER_STATUS_COLORS } from "@/app/constants";
import { ORDER_STATUS_LABELS } from "@/app/orders/constants";
import { Clock, MapPin, User, Phone, Mail } from "lucide-react";
interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: number, status: OrderStatusType) => Promise<void>;
  onView: (order: Order) => void;
}
const statusColors: Record<string, string> = ORDER_STATUS_COLORS;
const statusLabels: Record<string, string> = ORDER_STATUS_LABELS;
export default function OrderCard({ order, onStatusChange, onView }: OrderCardProps) {
  const getStatusString = (status: unknown): string => {
    if (typeof status === 'object' && status !== null && 'name' in status) {
      return String((status as { name: string }).name).toLowerCase();
    }
    return String(status).toLowerCase();
  };
  const handleStatusChange = async (newStatus: OrderStatusType) => {
    try {
      await onStatusChange(order.id, newStatus);
    } catch (error) {
    }
  };
  const getNextStatus = (currentStatus: unknown): OrderStatusType | null => {
    const statusString = getStatusString(currentStatus);
    const statusFlow: Record<string, OrderStatusType | null> = {
      "en attente de l'acceptation du restaurant": "accepted",
      "pending": "accepted",
      accepted: "preparing",
      preparing: "ready",
      ready: "delivered",
      delivered: null,
      cancelled: null,
    };
    return statusFlow[statusString] || null;
  };
  const currentStatusString = getStatusString(order.status);
  const nextStatus = getNextStatus(order.status);
  const deliveryAddress = `${order.street_number} ${order.street}, ${order.city} ${order.postal_code}`;
  const totalPrice = parseFloat(order.subtotal) + parseFloat(order.delivery_costs) + parseFloat(order.service_charge) - parseFloat(order.global_discount);
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Commande #{order.id}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleString("fr-FR")}
              </span>
            </div>
          </div>
          <Badge className={statusColors[currentStatusString] || "bg-gray-100 text-gray-800"}>
            {statusLabels[currentStatusString] || (typeof order.status === 'object' ? order.status.name : order.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              {order.client ? 
                `${order.client.first_name} ${order.client.last_name}` : 
                order.customer ? 
                  `${order.customer.first_name} ${order.customer.last_name}` : 
                  `Client #${order.client_id}`
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              {order.client?.email || order.customer?.email || 'Email non disponible'}
            </span>
          </div>
          {order.description && (
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
              <span className="text-sm text-gray-600">{order.description}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{deliveryAddress}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <div>
              <span className="text-sm text-gray-600">
                {order.items_count} article(s)
              </span>
              <div className="font-semibold">{totalPrice.toFixed(2)} €</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(order)}>
                Voir détails
              </Button>
              {(currentStatusString.includes("attente") || currentStatusString === "pending") && !currentStatusString.includes("livreur") && (
                <Button 
                  size="sm" 
                  onClick={() => handleStatusChange("accepted")}
                  className="text-white"
                  style={{ backgroundColor: ORDER_STATUS_COLORS.accepted }}
                >
                  Accepter
                </Button>
              )}
              {nextStatus && currentStatusString !== "pending" && !currentStatusString.includes("attente") && currentStatusString !== "delivered" && currentStatusString !== "cancelled" && (
                <Button 
                  size="sm" 
                  onClick={() => handleStatusChange(nextStatus)}
                  className="text-white"
                  style={{ backgroundColor: ORDER_STATUS_COLORS.accepted }}
                >
                  {statusLabels[nextStatus] || nextStatus}
                </Button>
              )}
              {(currentStatusString.includes("attente") || currentStatusString === "pending") && !currentStatusString.includes("livreur") && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleStatusChange("cancelled")}
                >
                  Refuser
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
