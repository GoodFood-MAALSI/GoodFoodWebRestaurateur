import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/shadcn/dialog";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { Switch } from "@/components/ui/shadcn/switch";
import { Trash2, Plus, Edit, Upload, Image as ImageIcon } from "lucide-react";
import { MenuItem } from "@/types/menu/menuItem";
import { MenuItemOption } from "@/types/menu/menuItemOption";
import { MenuItemOptionValue } from "@/types/menu/menuItemOptionValue";
import { COLORS } from "@/app/constants";

interface MenuItemModalProps {
  item: MenuItem;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedItem: MenuItem) => void;
  onDelete?: (itemId: number) => void;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, open, onClose, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState("item");
  const [editingItem, setEditingItem] = useState(item);
  const [editingOption, setEditingOption] = useState<MenuItemOption | null>(null);
  const [editingValue, setEditingValue] = useState<MenuItemOptionValue | null>(null);
  const [newOption, setNewOption] = useState<Partial<MenuItemOption>>({});
  const [newValues, setNewValues] = useState<Record<number, Partial<MenuItemOptionValue>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isLocalImagePreview, setIsLocalImagePreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditingItem(item);
    const picture = item.picture;
    if (picture && (picture.startsWith('http') || picture.startsWith('data:') || picture.startsWith('/'))) {
      setImagePreview(picture);
      setIsLocalImagePreview(false);
    } else {
      setImagePreview(null);
      setIsLocalImagePreview(false);
    }
  }, [item]);

  const getNewValueForOption = (optionId: number) => {
    return newValues[optionId] || {};
  };

  const updateNewValueForOption = (optionId: number, updates: Partial<MenuItemOptionValue>) => {
    setNewValues(prev => ({
      ...prev,
      [optionId]: { ...prev[optionId], ...updates }
    }));
  };

  const clearNewValueForOption = (optionId: number) => {
    setNewValues(prev => {
      const newState = { ...prev };
      delete newState[optionId];
      return newState;
    });
  };

  const handleUpdateItem = async () => {
    try {
      const payload = {
        name: editingItem.name,
        price: parseFloat(editingItem.price.toString()),
        description: editingItem.description,
        promotion: parseFloat(editingItem.promotion.toString()),
        is_available: editingItem.is_available,
        position: editingItem.position,
        menuCategoryId: editingItem.menuCategoryId,
      };

      const response = await fetch(`/api/proxy/menu-items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Échec de la mise à jour");
      
      const result = await response.json();
      const updatedItemWithImage = { 
        ...(result.data || result), 
        picture: editingItem.picture
      };
      onUpdate(updatedItemWithImage);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
    
    try {
      const response = await fetch(`/api/proxy/menu-items/${item.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Échec de la suppression");
      
      if (onDelete) {
        onDelete(item.id);
      }
      onClose();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleCreateOption = async () => {
    try {
      const payload = {
        name: newOption.name,
        is_required: newOption.is_required || false,
        is_multiple_choice: newOption.is_multiple_choice || false,
        position: newOption.position || 1,
        menuItemId: item.id,
      };

      const response = await fetch("/api/proxy/menu-item-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Échec de la création");
      
      const result = await response.json();
      const createdOption = result.data || result;
      
      setEditingItem(prev => ({
        ...prev,
        menuItemOptions: [...(prev.menuItemOptions || []), createdOption]
      }));
      
      setNewOption({});
    } catch (error) {
      console.error("Error creating option:", error);
    }
  };

  const handleUpdateOption = async (option: MenuItemOption) => {
    try {
      const payload = {
        name: option.name,
        is_required: option.is_required,
        is_multiple_choice: option.is_multiple_choice,
        position: option.position,
      };

      const response = await fetch(`/api/proxy/menu-item-options/${option.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Échec de la mise à jour");
      
      setEditingItem(prev => ({
        ...prev,
        menuItemOptions: prev.menuItemOptions?.map(opt => 
          opt.id === option.id ? option : opt
        ) || []
      }));
      
      setEditingOption(null);
    } catch (error) {
      console.error("Error updating option:", error);
    }
  };

  const handleDeleteOption = async (optionId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette option ?")) return;
    
    try {
      const response = await fetch(`/api/proxy/menu-item-options/${optionId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Échec de la suppression");
      
      setEditingItem(prev => ({
        ...prev,
        menuItemOptions: prev.menuItemOptions?.filter(opt => opt.id !== optionId) || []
      }));
    } catch (error) {
      console.error("Error deleting option:", error);
    }
  };

  const handleCreateValue = async (optionId: number) => {
    const currentNewValue = getNewValueForOption(optionId);
    
    try {
      const payload = {
        name: currentNewValue.name,
        extra_price: parseFloat(currentNewValue.extra_price?.toString() || "0"),
        position: currentNewValue.position || 1,
        menuItemOptionId: optionId,
      };

      const response = await fetch("/api/proxy/menu-item-option-values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Échec de la création");
      
      const result = await response.json();
      const createdValue = result.data || result;
      
      setEditingItem(prev => ({
        ...prev,
        menuItemOptions: prev.menuItemOptions?.map(option => 
          option.id === optionId 
            ? { ...option, menuItemOptionValues: [...(option.menuItemOptionValues || []), createdValue] }
            : option
        ) || []
      }));
      
      clearNewValueForOption(optionId);
    } catch (error) {
      console.error("Error creating value:", error);
    }
  };

  const handleDeleteValue = async (valueId: number, optionId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette valeur ?")) return;
    
    try {
      const response = await fetch(`/api/proxy/menu-item-option-values/${valueId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Échec de la suppression");
      
      setEditingItem(prev => ({
        ...prev,
        menuItemOptions: prev.menuItemOptions?.map(option => 
          option.id === optionId 
            ? { ...option, menuItemOptionValues: option.menuItemOptionValues?.filter(val => val.id !== valueId) || [] }
            : option
        ) || []
      }));
    } catch (error) {
      console.error("Error deleting value:", error);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`/api/proxy/menu-items/${item.id}/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Échec du téléchargement");
      
      const result = await response.json();
      console.log("Upload result:", result);
      
      const imageUrl = result.image_url || result.picture || result.imageUrl;
      if (imageUrl) {
        const updatedItem = { ...editingItem, picture: imageUrl };
        setEditingItem(updatedItem);
        setImagePreview(imageUrl);
        setIsLocalImagePreview(false);
        console.log("Updated with server image URL:", imageUrl);
      } else {
        console.warn("No image URL found in upload response:", result);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La taille du fichier ne doit pas dépasser 5MB');
      return;
    }

    console.log('Selected file:', file.name, file.type, file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log('FileReader result length:', result?.length);
      console.log('FileReader result type:', typeof result);
      console.log('FileReader result preview:', result?.substring(0, 50) + '...');
      setImagePreview(result);
      setIsLocalImagePreview(true); 
    };
    reader.onerror = (e) => {
      console.error('FileReader error:', e);
      alert('Erreur lors de la lecture du fichier');
    };
    reader.readAsDataURL(file);
    handleImageUpload(file);
    event.target.value = '';
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      console.log('Dropped file:', file.name, file.type, file.size);
      
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            console.log('Drag drop FileReader result length:', result?.length);
            setImagePreview(result);
            setIsLocalImagePreview(true);
          };
          reader.onerror = (e) => {
            console.error('Drag drop FileReader error:', e);
            alert('Erreur lors de la lecture du fichier');
          };
          reader.readAsDataURL(file);
          
          handleImageUpload(file);
        } else {
          alert('La taille du fichier ne doit pas dépasser 5MB');
        }
      } else {
        alert('Veuillez sélectionner un fichier image valide');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-h-[95vh] overflow-auto" 
        style={{ 
          width: '90vw', 
          maxWidth: '1200px',
          minWidth: '800px'
        }}
      >
        <DialogHeader>
          <DialogTitle>Gestion de l'article - {item.name}</DialogTitle>
          <DialogDescription>
            Gérez les détails de l'article, ses options et ses valeurs d'options. Utilisez les onglets pour naviguer entre les différentes sections.
          </DialogDescription>
        </DialogHeader>

        <div className={`grid grid-cols-1 gap-6 ${activeTab === "item" ? "lg:grid-cols-4" : "lg:grid-cols-1"}`}>
          <div className={`space-y-4 ${activeTab === "item" ? "lg:col-span-3" : "lg:col-span-1"}`}>
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "item"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("item")}
              >
                Article
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "options"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("options")}
              >
                Options ({editingItem.menuItemOptions?.length || 0})
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "values"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("values")}
              >
                Valeurs
              </button>
            </div>

          {activeTab === "item" && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">📄</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Informations de l'article</h2>
                    <p className="text-sm text-gray-600">Modifiez les détails de votre article de menu</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Informations générales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                      Nom de l'article *
                    </Label>
                    <Input
                      id="name"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="ex: Pizza Margherita"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position" className="text-sm font-medium text-gray-700 mb-2 block">
                      Position dans le menu
                    </Label>
                    <Input
                      id="position"
                      type="number"
                      min="1"
                      value={editingItem.position}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, position: parseInt(e.target.value) }))}
                      placeholder="1"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre article, ses ingrédients, ses spécificités..."
                    className="w-full min-h-[100px] resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Une bonne description aide vos clients à faire leur choix</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Tarification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
                      Prix de base (€) *
                    </Label>
                    <div className="relative">
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        className="w-full pr-8"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">€</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="promotion" className="text-sm font-medium text-gray-700 mb-2 block">
                      Prix promotionnel (€)
                    </Label>
                    <div className="relative">
                      <Input
                        id="promotion"
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingItem.promotion}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, promotion: e.target.value }))}
                        placeholder="0.00"
                        className="w-full pr-8"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">€</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Laissez vide si aucune promotion</p>
                  </div>
                </div>
                
                {editingItem.price && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Aperçu du prix:</span>
                      <div className="flex items-center space-x-2">
                        {editingItem.promotion && parseFloat(editingItem.promotion) > 0 && parseFloat(editingItem.promotion) < parseFloat(editingItem.price) ? (
                          <>
                            <span className="text-lg font-bold text-green-600">{editingItem.promotion}€</span>
                            <span className="text-sm text-gray-500 line-through">{editingItem.price}€</span>
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              -{Math.round(((parseFloat(editingItem.price) - parseFloat(editingItem.promotion)) / parseFloat(editingItem.price)) * 100)}%
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">{editingItem.price}€</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Paramètres
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${editingItem.is_available ? 'bg-green-100' : 'bg-red-100'}`}>
                      <span className="text-lg">{editingItem.is_available ? '✅' : '❌'}</span>
                    </div>
                    <div>
                      <Label htmlFor="available" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Article disponible
                      </Label>
                      <p className="text-xs text-gray-500">
                        {editingItem.is_available 
                          ? 'Cet article est visible et commandable par les clients' 
                          : 'Cet article est masqué et non commandable'
                        }
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="available"
                    checked={editingItem.is_available}
                    onCheckedChange={(checked) => setEditingItem(prev => ({ ...prev, is_available: checked }))}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button 
                    onClick={handleUpdateItem} 
                    className="flex items-center justify-center"
                    style={{ backgroundColor: COLORS.primary, color: COLORS.text.inverse }}
                  >
                    <span className="mr-2">💾</span>
                    Sauvegarder les modifications
                  </Button>
                  <Button 
                    onClick={handleDeleteItem} 
                    variant="destructive"
                    className="flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer l'article
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  ⚠️ La suppression de l'article est définitive et supprimera aussi toutes ses options et valeurs
                </p>
              </div>
            </div>
          )}

          {activeTab === "options" && (
            <div className="space-y-6">
              <div className="border-l-4 border-green-400 bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-4">Créer une nouvelle option</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newOptionName" className="text-sm font-medium text-gray-700">Nom de l'option *</Label>
                    <Input
                      id="newOptionName"
                      value={newOption.name || ""}
                      onChange={(e) => setNewOption(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="ex: Choix de boisson"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newOptionPosition" className="text-sm font-medium text-gray-700">Position</Label>
                    <Input
                      id="newOptionPosition"
                      type="number"
                      min="1"
                      value={newOption.position || ""}
                      onChange={(e) => setNewOption(prev => ({ ...prev, position: parseInt(e.target.value) }))}
                      placeholder="1"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="required"
                      checked={newOption.is_required || false}
                      onCheckedChange={(checked) => setNewOption(prev => ({ ...prev, is_required: checked }))}
                    />
                    <Label htmlFor="required" className="text-sm font-medium">Option requise</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="multiple"
                      checked={newOption.is_multiple_choice || false}
                      onCheckedChange={(checked) => setNewOption(prev => ({ ...prev, is_multiple_choice: checked }))}
                    />
                    <Label htmlFor="multiple" className="text-sm font-medium">Choix multiple</Label>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleCreateOption} 
                    disabled={!newOption.name}
                    style={{ backgroundColor: COLORS.success, color: COLORS.text.inverse }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer l'option
                  </Button>
                </div>
              </div>

              {editingItem.menuItemOptions && editingItem.menuItemOptions.length > 0 ? (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Options existantes ({editingItem.menuItemOptions.length})</h3>
                  <div className="space-y-4">
                    {editingItem.menuItemOptions.map((option, index) => (
                      <div key={option.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        {editingOption?.id === option.id ? (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <h4 className="font-medium text-yellow-800 mb-3">Modification de l'option</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Nom</Label>
                                <Input
                                  value={editingOption.name}
                                  onChange={(e) => setEditingOption(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Position</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={editingOption.position}
                                  onChange={(e) => setEditingOption(prev => prev ? ({ ...prev, position: parseInt(e.target.value) }) : null)}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-6 mt-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={editingOption.is_required}
                                  onCheckedChange={(checked) => setEditingOption(prev => prev ? ({ ...prev, is_required: checked }) : null)}
                                />
                                <Label className="text-sm font-medium">Requis</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={editingOption.is_multiple_choice}
                                  onCheckedChange={(checked) => setEditingOption(prev => prev ? ({ ...prev, is_multiple_choice: checked }) : null)}
                                />
                                <Label className="text-sm font-medium">Choix multiple</Label>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button onClick={() => handleUpdateOption(editingOption)} size="sm">
                                Sauvegarder
                              </Button>
                              <Button onClick={() => setEditingOption(null)} variant="outline" size="sm">
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-medium text-lg text-gray-900">{option.name}</h4>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                    <span>Position: {option.position}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${option.is_required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                      {option.is_required ? 'Requis' : 'Optionnel'}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs ${option.is_multiple_choice ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                      {option.is_multiple_choice ? 'Choix multiple' : 'Choix unique'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-2">
                                    {option.menuItemOptionValues?.length || 0} valeur(s) configurée(s)
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={() => setEditingOption(option)} size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button onClick={() => handleDeleteOption(option.id)} size="sm" variant="destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">🎛️</div>
                  <h3 className="text-xl font-semibold mb-2">Aucune option créée</h3>
                  <p>Commencez par créer votre première option ci-dessus</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "values" && (
            <div className="space-y-6">
              {editingItem.menuItemOptions?.map((option) => {
                const currentNewValue = getNewValueForOption(option.id);
                
                return (
                  <div key={option.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{option.name}</h3>
                        <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                          {option.menuItemOptionValues?.length || 0} valeur(s)
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {option.is_required ? "Requis" : "Optionnel"} • 
                        {option.is_multiple_choice ? " Choix multiple" : " Choix unique"}
                      </p>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                        <h4 className="font-medium text-blue-800 mb-3">Ajouter une nouvelle valeur</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Nom *</Label>
                            <Input
                              value={currentNewValue.name || ""}
                              onChange={(e) => updateNewValueForOption(option.id, { name: e.target.value })}
                              placeholder="ex: Coca Cola"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Supplément (€)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={currentNewValue.extra_price || ""}
                              onChange={(e) => updateNewValueForOption(option.id, { extra_price: e.target.value })}
                              placeholder="0.00"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Position</Label>
                            <Input
                              type="number"
                              min="1"
                              value={currentNewValue.position || ""}
                              onChange={(e) => updateNewValueForOption(option.id, { position: parseInt(e.target.value) })}
                              placeholder="1"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button 
                            onClick={() => handleCreateValue(option.id)} 
                            size="sm"
                            disabled={!currentNewValue.name}
                            style={{ backgroundColor: COLORS.primary, color: COLORS.text.inverse }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter cette valeur
                          </Button>
                        </div>
                      </div>

                      {option.menuItemOptionValues && option.menuItemOptionValues.length > 0 ? (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-3">Valeurs existantes</h4>
                          <div className="space-y-2">
                            {option.menuItemOptionValues.map((value, index) => (
                              <div key={value.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">{value.name}</span>
                                    <div className="text-sm text-gray-500">
                                      {parseFloat(value.extra_price) > 0 ? (
                                        <span className="text-green-600">+{value.extra_price}€</span>
                                      ) : (
                                        <span>Gratuit</span>
                                      )}
                                      <span className="mx-2">•</span>
                                      <span>Position: {value.position}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => handleDeleteValue(value.id, option.id)} 
                                  size="sm" 
                                  variant="destructive"
                                  className="hover:bg-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <div className="text-4xl mb-2">📝</div>
                          <p>Aucune valeur pour cette option</p>
                          <p className="text-sm">Ajoutez la première valeur ci-dessus</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}              {(!editingItem.menuItemOptions || editingItem.menuItemOptions.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">⚙️</div>
                  <h3 className="text-xl font-semibold mb-2">Aucune option disponible</h3>
                  <p>Créez d'abord des options dans l'onglet "Options" pour pouvoir ajouter des valeurs.</p>
                </div>
              )}
            </div>
          )}
          </div>

          {activeTab === "item" && (
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Image de l'article
                  </h3>
                  
                  <div className="mb-4">
                    {imagePreview ? (
                      <div 
                        className={`relative group ${isDraggingFile ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <img
                          src={imagePreview}
                          alt={editingItem.name}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                          style={{ 
                            backgroundColor: '#f8f9fa',
                            minHeight: '192px',
                            height: '192px',
                            width: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', imagePreview);
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            console.error('Image failed to load:', imagePreview);
                            console.error('Error details:', e);
                            if (target.src !== '/food/cheeseburger.jpg') {
                              target.src = '/food/cheeseburger.jpg';
                            } else {
                              console.error('Even fallback image failed to load');
                              setImagePreview(null);
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <Button
                            onClick={triggerFileSelect}
                            variant="secondary"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            disabled={isUploadingImage}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Changer
                          </Button>
                        </div>
                        {isDraggingFile && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-500">
                            <p className="text-blue-700 font-medium">Déposez l'image ici</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div 
                        className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 transition-colors cursor-pointer ${
                          isDraggingFile 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={triggerFileSelect}
                      >
                        <ImageIcon className={`w-12 h-12 mb-2 ${isDraggingFile ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className="text-sm text-center mb-2">
                          {isDraggingFile ? 'Déposez votre image ici' : 'Aucune image'}
                        </p>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerFileSelect();
                          }}
                          variant="outline"
                          size="sm"
                          disabled={isUploadingImage}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {isDraggingFile ? 'Ou cliquez ici' : 'Ajouter une image'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {isUploadingImage && (
                    <div className="flex items-center justify-center p-2 bg-blue-50 rounded-lg text-blue-700 text-sm mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                      Téléchargement en cours...
                    </div>
                  )}

                  {isLocalImagePreview && !isUploadingImage && (
                    <div className="flex items-center justify-center p-2 bg-yellow-50 rounded-lg text-yellow-700 text-sm mb-2">
                      <span className="text-yellow-600 mr-2">⚠️</span>
                      Aperçu local - L'image sera sauvegardée lors de la validation
                    </div>
                  )}

                  {imagePreview && (
                    <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-50 rounded">
                      <p><strong>Debug Info:</strong></p>
                      <p>Source: {isLocalImagePreview ? 'Local preview' : 'Server URL'}</p>
                      <p>URL length: {imagePreview.length}</p>
                      <p>URL type: {imagePreview.startsWith('data:') ? 'Data URL' : imagePreview.startsWith('http') ? 'HTTP URL' : 'Relative URL'}</p>
                      {imagePreview.startsWith('data:') && (
                        <p>MIME type: {imagePreview.split(';')[0].replace('data:', '')}</p>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-4">
                    <p>• Glissez-déposez ou cliquez pour ajouter</p>
                    <p>• Format acceptés: JPG, PNG, GIF</p>
                    <p>• Taille maximale: 5MB</p>
                    <p>• Recommandé: 400x300px minimum</p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemModal;
