import { useState } from "react";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { Switch } from "@/components/ui/shadcn/switch";
import { Button } from "@/components/ui/shadcn/button";

interface ItemDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  promotion: number;
  is_available: boolean;
  position: number;
}

interface ItemDetailsStepProps {
  initial?: ItemDetails;
  onBack: () => void;
  onNext: (details: ItemDetails) => void;
}

export default function ItemDetailsStep({ initial, onBack, onNext }: ItemDetailsStepProps) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price || 0);
  const [promotion, setPromotion] = useState(initial?.promotion || 0);
  const [isAvailable, setIsAvailable] = useState(initial?.is_available ?? true);
  const [position, setPosition] = useState(initial?.position || 1);

  const canNext = name.trim() !== "" && price >= 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Étape 2: Détails de l&apos;article</h3>
      <Input
        placeholder="Nom de l&apos;article"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-sm font-medium text-gray-700">Prix</label>
        <Input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
        />
        <label className="block text-sm font-medium text-gray-700">Promotion (%)</label>
        <Input
          type="number"
          placeholder="Promotion (%)"
          value={promotion}
          onChange={e => setPromotion(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
        <span>Disponible</span>
      </div>
      <label className="block text-sm font-medium text-gray-700">Position dans le menu</label>
      <Input
        type="number"
        placeholder="Position"
        value={position}
        onChange={e => setPosition(Number(e.target.value))}
      />
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Précédent</Button>
        <Button
          onClick={() => onNext({ id: crypto.randomUUID(), name, description, price, promotion, is_available: isAvailable, position })}
          disabled={!canNext}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
