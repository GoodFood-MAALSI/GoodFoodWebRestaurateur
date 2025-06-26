import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/shadcn/select";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Category {
  id: number;
  name: string;
  position: number;
}

interface CategoryStepProps {
  restaurantId: number;
  selectedCategory?: Category;
  onNext: (category: Category) => void;
}

export default function CategoryStep({
  restaurantId,
  selectedCategory,
  onNext,
}: CategoryStepProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState<number>(1);
  const [choice, setChoice] = useState<number | null>(
    selectedCategory?.id ?? null
  );

  const canNext = choice !== null || name.trim() !== "";

  useEffect(() => {
    fetchWithAuth(`/api/proxy/restaurant/${restaurantId}/menu-categories`)
      .then((res) => res.json())
      .then((json) => {
        setCategories(json.data?.menuCategories || []);
      });
  }, [restaurantId]);

  const handleNext = async () => {
    let category: Category;

    if (choice) {
      const found = categories.find((c) => c.id === choice);
      if (!found) {
        console.error("Category not found for ID:", choice);
        return;
      }
      category = found;
    } else {
      const res = await fetchWithAuth(
        `/api/proxy/restaurant/${restaurantId}/menu-categories`,
        {
          method: "POST",
          body: JSON.stringify({ name, position, restaurantId }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const json = await res.json();
      category = json.data;
      
    }

    onNext(category);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Étape 1: Catégorie</h3>
      <Select
        value={choice?.toString()}
        onValueChange={(v) => setChoice(Number(v))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choisir une catégorie existante" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id.toString()}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="border-t pt-4">
        <p className="font-medium">Ou créer une nouvelle:</p>
        <Input
          placeholder="Nom de la catégorie"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={handleNext} disabled={!canNext}>
          Suivant
        </Button>
      </div>
    </div>
  );
}
