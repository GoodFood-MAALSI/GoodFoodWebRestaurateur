import React, { useState, useEffect } from "react";
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
import { Order, OrderStatusType, OrderStatus, DetailedOrder } from "@/types/order";
import { useOrderDetails } from "@/components/hooks/useOrderDetails";
import { ORDER_STATUS_COLORS } from "@/app/constants";
import { ORDER_STATUS_LABELS } from "@/app/orders/constants";
import { Clock, MapPin, User, Phone, Mail, Loader2 } from "lucide-react";
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
  const { orderDetails, loading: detailsLoading, error: detailsError, fetchOrderDetails, clearOrderDetails } = useOrderDetails();
  useEffect(() => {
    if (isOpen && order) {
      fetchOrderDetails(order.id);
    } else if (!isOpen) {
      clearOrderDetails();
    }
  }, [isOpen, order?.id]);
  useEffect(() => {
    setCurrentOrder(order);
    setNotes(order?.notes || "");
  }, [order]);
  if (!currentOrder) return null;
  const displayOrder = orderDetails || currentOrder;
  const getStatusString = (status: unknown): string => {
    if (typeof status === 'object' && status !== null && 'name' in status) {
      return String((status as { name: string }).name).toLowerCase();
    }
    return String(status).toLowerCase();
  };
  const handleStatusChange = async (newStatus: OrderStatusType) => {
    if (!currentOrder) return;
    try {
      setLoading(true);
      await onStatusChange(currentOrder.id, newStatus);
      const updatedOrder = { ...currentOrder, status: { name: newStatus } as OrderStatus };
      setCurrentOrder(updatedOrder);
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
    if (!displayOrder) return 0;
    const subtotal = parseFloat(displayOrder.subtotal);
    const deliveryCosts = parseFloat(displayOrder.delivery_costs);
    const serviceCharge = parseFloat(displayOrder.service_charge);
    const discount = parseFloat(displayOrder.global_discount);
    return subtotal + deliveryCosts + serviceCharge - discount;
  };
  const currentStatusString = getStatusString(displayOrder.status);
  const deliveryAddress = `${displayOrder.street_number} ${displayOrder.street}, ${displayOrder.city} ${displayOrder.postal_code}`;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Commande #{displayOrder.id}</DialogTitle>
            <Badge className={statusColors[currentStatusString] || "bg-gray-100 text-gray-800"}>
              {statusLabels[currentStatusString] || (typeof displayOrder.status === 'object' ? displayOrder.status.name : displayOrder.status)}
            </Badge>
          </div>
          <DialogDescription>
            Détails de la commande et gestion du statut. Vous pouvez mettre à jour le statut de la commande ci-dessous.
          </DialogDescription>
        </DialogHeader>
        {detailsLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Chargement des détails de la commande...</span>
          </div>
        )}
        {detailsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{detailsError}</p>
          </div>
        )}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Informations client</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>
                  {displayOrder.client ? 
                    `${displayOrder.client.first_name} ${displayOrder.client.last_name}` : 
                    currentOrder.customer ? 
                      `${currentOrder.customer.first_name} ${currentOrder.customer.last_name}` : 
                      `Client #${displayOrder.client_id}`
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>
                  {displayOrder.client?.email || currentOrder.customer?.email || 'Email non disponible'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{deliveryAddress}</span>
              </div>
              {displayOrder.description && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">Instructions: </span>
                    <span className="text-sm text-gray-600">{displayOrder.description}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>Commandé le {new Date(displayOrder.created_at).toLocaleString("fr-FR")}</span>
              </div>
              {displayOrder.restaurant && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Restaurant</h4>
                  <div className="text-sm text-gray-600">
                    <div>{displayOrder.restaurant.name}</div>
                    <div>{displayOrder.restaurant.street_number} {displayOrder.restaurant.street}</div>
                    <div>{displayOrder.restaurant.city} {displayOrder.restaurant.postal_code}</div>
                    <div>{displayOrder.restaurant.email}</div>
                    <div>{displayOrder.restaurant.phone_number}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Articles commandés</h3>
            {orderDetails && orderDetails.orderItems && orderDetails.orderItems.length > 0 ? (
              <div className="space-y-3">
                {orderDetails.orderItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{item.menu_item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Quantité: {item.quantity} × {parseFloat(item.unit_price).toFixed(2)} €
                          </p>
                          {item.notes && (
                            <p className="text-sm text-gray-500 italic">Note: {item.notes}</p>
                          )}
                        </div>
                      </div>
                      {item.menu_item_option_values && item.menu_item_option_values.length > 0 && (
                        <div className="mt-2 ml-3">
                          <div className="text-sm text-gray-600">
                            <strong>Options:</strong>
                            <div className="ml-2">
                              {item.menu_item_option_values.map((optionValue) => (
                                <div key={optionValue.id} className="flex justify-between">
                                  <span>{optionValue.name}</span>
                                  {parseFloat(optionValue.extra_price) > 0 && (
                                    <span>+{parseFloat(optionValue.extra_price).toFixed(2)} €</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-medium">
                        {(
                          parseFloat(item.unit_price) * item.quantity + 
                          (item.menu_item_option_values?.reduce((total, optionValue) => 
                            total + parseFloat(optionValue.extra_price) * item.quantity, 0) || 0)
                        ).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : currentOrder.orderItems && currentOrder.orderItems.length > 0 ? (
              <div className="space-y-3">
                {currentOrder.orderItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {'item' in item && item.item?.picture && (
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
                          <h4 className="font-medium">
                            {'item' in item ? (item.item?.name || 'Article sans nom') : 'Article sans nom'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Quantité: {item.quantity} × {'item' in item ? (item.item?.price?.toFixed(2) || '0.00') : '0.00'} €
                          </p>
                        </div>
                      </div>
                      {'selectedOptions' in item && item.selectedOptions?.length > 0 && (
                        <div className="mt-2 ml-15">
                          {item.selectedOptions.map((option: any, optIndex: number) => (
                            <div key={optIndex} className="text-sm text-gray-600">
                              <strong>{option?.name || 'Option'}:</strong>
                              {option?.selectedValues?.map((value: any, valIndex: number) => (
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
                        {('item' in item ? (
                          item.price * item.quantity + 
                          (item.selectedOptions?.reduce((total: number, option: any) => 
                            total + (option?.selectedValues?.reduce((valTotal: number, value: any) => 
                              valTotal + (value?.extra_price || 0) * item.quantity, 0) || 0), 0) || 0)
                        ) : 0).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>{currentOrder.items_count || 'N/A'} article(s) commandé(s)</p>
                <p className="text-sm">
                  {detailsLoading ? 'Chargement des détails...' : 'Détails des articles non disponibles'}
                </p>
              </div>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{parseFloat(displayOrder.subtotal).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison:</span>
                <span>{parseFloat(displayOrder.delivery_costs).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de service:</span>
                <span>{parseFloat(displayOrder.service_charge).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Réduction:</span>
                <span>-{parseFloat(displayOrder.global_discount).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{calculateTotal().toFixed(2)} €</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajouter des notes sur cette commande..."
              rows={3}
            />
          </div>
          <div className="flex flex-wrap gap-2">
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
