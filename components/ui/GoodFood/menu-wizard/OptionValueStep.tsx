import { useState } from "react";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";

interface OptionValue {
  id?: string;
  name: string;
  extra_price: number;
  position: number;
}

interface OptionValueStepProps {
  options: { id: string; name: string }[];
  initial?: OptionValue[][];
  onBack: () => void;
  onFinish: (values: OptionValue[][]) => void;
}

export default function OptionValueStep({ options, initial = [], onBack, onFinish }: OptionValueStepProps) {
  const [valuesByOption, setValuesByOption] = useState<OptionValue[][]>(
    options.map((_, idx) => initial[idx] || [])
  );

  const addValue = (optIdx: number) => {
    setValuesByOption(prev => {
      const copy = [...prev];
      copy[optIdx] = [...copy[optIdx], { id: crypto.randomUUID(), name: "", extra_price: 0, position: copy[optIdx].length + 1 }];
      return copy;
    });
  };

  const updateValue = (optIdx: number, valIdx: number, key: keyof OptionValue, v: any) => {
    setValuesByOption(prev => {
      const copy = prev.map(arr => arr.slice());
      copy[optIdx][valIdx] = { ...copy[optIdx][valIdx], [key]: v };
      return copy;
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Étape 4: Valeurs des options</h3>
      {options.map((opt, idx) => (
        <div key={opt.id} className="border rounded p-4">
          <h4 className="font-medium mb-2">{opt.name}</h4>
          {valuesByOption[idx].map((val, vidx) => (
            <div key={vidx} className="grid grid-cols-3 gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">Valeur {vidx + 1} :</label>
              <label className="block text-sm font-medium text-gray-700">Supplément :</label>
              <label className="block text-sm font-medium text-gray-700">Position :</label>

              <Input
                placeholder="Nom"
                value={val.name}
                onChange={e => updateValue(idx, vidx, 'name', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Prix sup."
                value={val.extra_price}
                onChange={e => updateValue(idx, vidx, 'extra_price', Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Position"
                value={val.position}
                onChange={e => updateValue(idx, vidx, 'position', Number(e.target.value))}
              />
            </div>
          ))}
          <Button variant="outline" onClick={() => addValue(idx)}>Ajouter valeur</Button>
        </div>
      ))}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Précédent</Button>
        <Button onClick={() => onFinish(valuesByOption)}>Terminer</Button>
      </div>
    </div>
  );
}
