"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/shadcn/dialog";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { RestaurantFormValues } from "@/app/create-company/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { restaurantSchema } from "@/app/create-company/schema";
import { COLORS } from "@/app/constants";
import { Edit, Upload, Image as ImageIcon, MapPin, Phone, Mail, Users, X } from "lucide-react";
interface RestaurantDetailsProps {
  restaurant: RestaurantFormValues & { 
    id?: number;
    images?: Array<{
      id: number;
      path: string;
      isMain: boolean;
    }>;
  };
  onUpdate: (data: Partial<RestaurantFormValues>) => Promise<void>;
  onDelete: () => Promise<void>;
}
export default function RestaurantDetails({ restaurant, onUpdate, onDelete }: RestaurantDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      ...restaurant,
      phone_number: restaurant.phone_number?.toString() ?? "",
    },
  });
  const { register, handleSubmit, formState: { errors }, getValues } = form;
  const handleImageUpload = async (file: File) => {
    if (!file || !restaurant.id) return;
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(`/api/proxy/restaurant/${restaurant.id}/upload-image`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Échec du téléchargement");
      const result = await response.json();
      let imageUrl = null;
      if (result.data && result.data.images && result.data.images.length > 0) {
        imageUrl = result.data.images[0].path;
      } else {
        imageUrl = result.image_url || result.picture || result.imageUrl;
      }
      if (imageUrl) {
        const fullImagePath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        setImagePreview(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/restaurateur/api${fullImagePath}`);
        toast.success("Image téléchargée avec succès");
        window.location.reload();
      } else {
        toast.error("Erreur: URL d'image non trouvée");
      }
    } catch (error) {
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploadingImage(false);
    }
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image valide');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille du fichier ne doit pas dépasser 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.onerror = () => {
      toast.error('Erreur lors de la lecture du fichier');
    };
    reader.readAsDataURL(file);
    handleImageUpload(file);
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
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
  const mainImage = restaurant.images?.find(img => img.isMain);
  const displayImage = mainImage?.path || restaurant.images?.[0]?.path;
  const fullImageUrl = displayImage 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}/restaurateur/api${displayImage}`
    : null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="relative h-48 bg-gradient-to-r from-gray-100 to-gray-200">
        {fullImageUrl || imagePreview ? (
          <div className="relative w-full h-full">
            <img
              src={imagePreview || fullImageUrl || ''}
              alt={values.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ImageIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Button
            onClick={triggerFileInput}
            disabled={isUploadingImage}
            className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
            size="sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploadingImage ? "Upload..." : "Photo"}
          </Button>
        </div>
        <div className="absolute bottom-4 left-6">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            {values.name}
          </h2>
          <p className="text-white/90 drop-shadow">
            {values.description?.substring(0, 80)}{values.description && values.description.length > 80 ? '...' : ''}
          </p>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Adresse</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {values.street_number} {values.street}<br />
                {values.city} {values.postal_code}<br />
                {values.country}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Email</h3>
                <p className="text-gray-600 text-sm">{values.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Téléphone</h3>
                <p className="text-gray-600 text-sm">{values.phone_number}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">SIRET</h3>
                <p className="text-gray-600 text-sm">{values.siret}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                values.is_open 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {values.is_open ? '🟢 Ouvert' : '🔴 Fermé'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" style={{ color: COLORS.text.primary }}>
                Modifier le restaurant
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Modifiez les informations de votre restaurant. Tous les champs sont obligatoires.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Photo du restaurant
                </label>
                <div className="relative">
                  {imagePreview || fullImageUrl ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                      <img
                        src={imagePreview || fullImageUrl || ''}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          onClick={triggerFileInput}
                          className="bg-white/90 hover:bg-white text-gray-800"
                          size="sm"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Changer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={triggerFileInput}
                      className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Cliquez pour ajouter une photo</p>
                      <p className="text-xs text-gray-400">PNG, JPG jusqu&apos;à 5MB</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du restaurant
                  </label>
                  <Input 
                    {...register("name")} 
                    placeholder="Nom du restaurant"
                    className="border-gray-300 focus:border-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea 
                    {...register("description")} 
                    placeholder="Description du restaurant"
                    className="border-gray-300 focus:border-blue-500 min-h-[80px]"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Adresse</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro
                    </label>
                    <Input 
                      {...register("street_number")} 
                      placeholder="123"
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rue
                    </label>
                    <Input 
                      {...register("street")} 
                      placeholder="Rue de la Paix"
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <Input 
                      {...register("city")} 
                      placeholder="Paris"
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <Input 
                      {...register("postal_code")} 
                      placeholder="75001"
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <Input 
                    {...register("country")} 
                    placeholder="France"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input 
                      {...register("email")} 
                      type="email"
                      placeholder="restaurant@example.com"
                      className="border-gray-300 focus:border-blue-500"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <Input 
                      {...register("phone_number")} 
                      placeholder="01 23 45 67 89"
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-6 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)} 
                  type="button" 
                  disabled={loading}
                  className="border-gray-300"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  style={{ backgroundColor: COLORS.primary }}
                  className="hover:opacity-90"
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Button 
          variant="destructive" 
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600"
        >
          <X className="w-4 h-4 mr-2" />
          Supprimer
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
}
