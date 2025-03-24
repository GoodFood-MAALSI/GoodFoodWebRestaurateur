import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/shadcn/select";
import { Label } from "@/components/ui/shadcn/label";
import { Button } from "@/components/ui/shadcn/button";

interface ArticleFormProps {
  onSubmit: (data: any) => void;
  initialData?: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    image?: string;
  };
}

const createItem: React.FC<ArticleFormProps> = ({
  onSubmit,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price || "",
    category: initialData.category || "",
    image: initialData.image || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-lg mx-auto mt-20 p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Créer un nouvel article</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de l'article</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={formData.category}
              onValueChange={(value: string) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entree">Entrée</SelectItem>
                <SelectItem value="plat">Plat principal</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
                <SelectItem value="boisson">Boisson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="imageUpload">Télécharger une image</Label>
            <Input
              id="imageUpload"
              name="imageUpload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData((prev) => ({
                      ...prev,
                      image: reader.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <Button type="submit" className="w-full">
            Créer l'article
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default createItem;
