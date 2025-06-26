"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/shadcn/dialog";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { RestaurantFormValues } from "@/app/create-company/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { restaurantSchema } from "@/app/create-company/schema";

interface RestaurantDetailsProps {
  restaurant: RestaurantFormValues;
  onUpdate: (data: Partial<RestaurantFormValues>) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function RestaurantDetails({ restaurant, onUpdate, onDelete }: RestaurantDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      ...restaurant,
      phone_number: restaurant.phone_number?.toString() ?? "",
    },
  });

  const { register, handleSubmit, formState: { errors }, getValues } = form;

  const onSubmit = async (values: RestaurantFormValues) => {
    setLoading(true);
    try {
      await onUpdate(values);
      toast.success("Restaurant mis à jour");
      setIsEditing(false);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const values = getValues();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">{values.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Description</p>
          <p>{values.description}</p>
        </div>
        <div>
          <p className="font-medium">Adresse</p>
          <p>{values.street_number} {values.street}, {values.city} {values.postal_code}, {values.country}</p>
        </div>
        <div>
          <p className="font-medium">Contact</p>
          <p>Email: {values.email}</p>
          <p>Téléphone: {values.phone_number}</p>
        </div>
        <div>
          <p className="font-medium">Statut</p>
          <p>{values.is_open ? "Ouvert" : "Fermé"}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline">Modifier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le restaurant</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input {...register("name")} placeholder="Nom" />
              <Textarea {...register("description")} placeholder="Description" />
              <div className="grid grid-cols-2 gap-2">
                <Input {...register("street_number")} placeholder="N°" />
                <Input {...register("street")} placeholder="Rue" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input {...register("city")} placeholder="Ville" />
                <Input {...register("postal_code")} placeholder="Code postal" />
              </div>
              <Input {...register("country")} placeholder="Pays" />
              <Input {...register("email")} placeholder="Email" />
              <Input {...register("phone_number")} placeholder="Téléphone" />
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)} type="button" disabled={loading}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Button variant="destructive" onClick={onDelete}>Supprimer</Button>
      </CardFooter>
    </Card>
  );
}
