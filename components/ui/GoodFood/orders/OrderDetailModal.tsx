import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/shadcn/dialog";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { Order, OrderStatusType, OrderStatus } from "@/types/order";
import { ORDER_STATUS_COLORS } from "@/app/constants";
import { ORDER_STATUS_LABELS } from "@/app/orders/constants";
import { Clock, MapPin, User, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: number, status: OrderStatusType) => Promise<void>;
  onOrderUpdate?: (updatedOrder: Order) => void;
}

const statusColors: Record<string, string> = ORDER_STATUS_COLORS;
const statusLabels: Record<string, string> = ORDER_STATUS_LABELS;

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusChange,
  onOrderUpdate,
}: OrderDetailModalProps) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(order);
  const [notes, setNotes] = useState(order?.notes || "");
  const [loading, setLoading] = useState(false);

  // Update local state when order prop changes
  React.useEffect(() => {
    setCurrentOrder(order);
    setNotes(order?.notes || "");
  }, [order]);

  if (!currentOrder) return null;

  const getStatusString = (status: any): string => {
    if (typeof status === 'object' && status.name) {
      return status.name.toLowerCase();
    }
    return String(status).toLowerCase();
  };

  const handleStatusChange = async (newStatus: OrderStatusType) => {
    if (!currentOrder) return;
    
    try {
      setLoading(true);
      await onStatusChange(currentOrder.id, newStatus);
      
      // Update the local order state to reflect the new status immediately
      const updatedOrder = { ...currentOrder, status: { name: newStatus } as OrderStatus };
      setCurrentOrder(updatedOrder);
      
      // Notify parent component of the update
      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }
      
      toast.success("Statut mis à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!currentOrder) return 0;
    const subtotal = parseFloat(currentOrder.subtotal);
    const deliveryCosts = parseFloat(currentOrder.delivery_costs);
    const serviceCharge = parseFloat(currentOrder.service_charge);
    const discount = parseFloat(currentOrder.global_discount);
    return subtotal + deliveryCosts + serviceCharge - discount;
  };

  const currentStatusString = getStatusString(currentOrder.status);
  const deliveryAddress = `${currentOrder.street_number} ${currentOrder.street}, ${currentOrder.city} ${currentOrder.postal_code}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Commande #{currentOrder.id}</DialogTitle>
            <Badge className={statusColors[currentStatusString] || "bg-gray-100 text-gray-800"}>
              {statusLabels[currentStatusString] || (typeof currentOrder.status === 'object' ? currentOrder.status.name : currentOrder.status)}
            </Badge>
          </div>
          <DialogDescription>
            Détails de la commande et gestion du statut. Vous pouvez mettre à jour le statut de la commande ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Informations client</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>
                  {currentOrder.customer ? 
                    `${currentOrder.customer.first_name} ${currentOrder.customer.last_name}` : 
                    `Client #${currentOrder.client_id}`
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{currentOrder.customer?.email || 'Email non disponible'}</span>
              </div>
              {currentOrder.customer?.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{currentOrder.customer.phone_number}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{deliveryAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>Commandé le {new Date(currentOrder.created_at).toLocaleString("fr-FR")}</span>
              </div>
            </div>
          </div>

          {/* Order Items - Show message if no items available */}
          <div>
            <h3 className="font-semibold mb-3">Articles commandés</h3>
            {currentOrder.orderItems && currentOrder.orderItems.length > 0 ? (
              <div className="space-y-3">
                {currentOrder.orderItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {item.item?.picture && (
                          <img
                            src={item.item.picture}
                            alt={item.item.name || 'Item'}
                            className="w-12 h-12 object-cover rounded"
                            style={{
                              width: '48px',
                              height: '48px',
                              objectFit: 'cover'
                            }}
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{item.item?.name || 'Article sans nom'}</h4>
                          <p className="text-sm text-gray-600">
                            Quantité: {item.quantity} × {item.item?.price?.toFixed(2) || '0.00'} €
                          </p>
                        </div>
                      </div>
                      
                      {item.selectedOptions?.length > 0 && (
                        <div className="mt-2 ml-15">
                          {item.selectedOptions.map((option, optIndex) => (
                            <div key={optIndex} className="text-sm text-gray-600">
                              <strong>{option?.name || 'Option'}:</strong>
                              {option?.selectedValues?.map((value, valIndex) => (
                                <span key={valIndex} className="ml-1">
                                  {value?.name || 'Valeur'}
                                  {value?.extra_price > 0 && ` (+${value.extra_price.toFixed(2)} €)`}
                                  {valIndex < (option.selectedValues?.length || 0) - 1 && ", "}
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-medium">
                        {(item.price * item.quantity + 
                          (item.selectedOptions?.reduce((total, option) => 
                            total + (option?.selectedValues?.reduce((valTotal, value) => 
                              valTotal + (value?.extra_price || 0) * item.quantity, 0) || 0), 0) || 0)
                        ).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>{currentOrder.items_count} article(s) commandé(s)</p>
                <p className="text-sm">Détails des articles non disponibles</p>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{parseFloat(currentOrder.subtotal).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison:</span>
                <span>{parseFloat(currentOrder.delivery_costs).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de service:</span>
                <span>{parseFloat(currentOrder.service_charge).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Réduction:</span>
                <span>-{parseFloat(currentOrder.global_discount).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{calculateTotal().toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="font-semibold mb-2">Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajouter des notes sur cette commande..."
              rows={3}
            />
          </div>

          {/* Status Actions */}
          <div className="flex flex-wrap gap-2">
            {/* Show Accept button only for pending orders */}
            {(currentStatusString.includes("attente") || currentStatusString === "pending") && (
              <>
                <Button 
                  onClick={() => handleStatusChange("accepted")}
                  disabled={loading}
                  className="text-white"
                  style={{ backgroundColor: ORDER_STATUS_COLORS.accepted }}
                >
                  Accepter
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={loading}
                >
                  Refuser
                </Button>
              </>
            )}
            
            {currentStatusString === "accepted" && (
              <Button 
                onClick={() => handleStatusChange("preparing")}
                disabled={loading}
                className="text-white"
                style={{ backgroundColor: ORDER_STATUS_COLORS.preparing }}
              >
                Commencer la préparation
              </Button>
            )}
            
            {currentStatusString === "preparing" && (
              <Button 
                onClick={() => handleStatusChange("ready")}
                disabled={loading}
                className="text-white"
                style={{ backgroundColor: ORDER_STATUS_COLORS.ready }}
              >
                Marquer comme prête
              </Button>
            )}
            
            {currentStatusString === "ready" && (
              <Button 
                onClick={() => handleStatusChange("delivered")}
                disabled={loading}
                className="text-white"
                style={{ backgroundColor: ORDER_STATUS_COLORS.delivered }}
              >
                Marquer comme livrée
              </Button>
            )}
          </div>
        </div>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
      </DialogContent>
    </Dialog>
  );
}
