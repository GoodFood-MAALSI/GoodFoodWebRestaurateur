import { useState } from "react";
import { Input } from "@/components/ui/shadcn/input";
import { Switch } from "@/components/ui/shadcn/switch";
import { Button } from "@/components/ui/shadcn/button";

interface OptionConfig {
  id?: string;
  name: string;
  is_required: boolean;
  is_multiple_choice: boolean;
  position: number;
}

interface OptionStepProps {
  initial?: OptionConfig[];
  onBack: () => void;
  onNext: (options: OptionConfig[]) => void;
}

export default function OptionStep({ initial = [], onBack, onNext }: OptionStepProps) {
  const [options, setOptions] = useState<OptionConfig[]>(initial);

  const addEmpty = () => {
    setOptions(prev => [...prev, { id: crypto.randomUUID(), name: "", is_required: false, is_multiple_choice: false, position: prev.length + 1 }]);
  };

  const updateOption = (idx: number, key: keyof OptionConfig, value: unknown) => {
    setOptions(prev => prev.map((o,i) => i === idx ? { ...o, [key]: value } : o));
    crypto.randomUUID()
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Étape 3: Options</h3>
      {options.map((opt, idx) => (
        <div key={idx} className="grid grid-cols-2 gap-2 p-2 border rounded">
          <label className="block text-sm font-medium text-gray-700">Option {idx + 1} :</label>
          <Input
            placeholder="Nom de l'option"
            value={opt.name}
            onChange={e => updateOption(idx, 'name', e.target.value)}
          />
          <label className="block text-sm font-medium text-gray-700">Position :</label>
          <Input
            type="number"
            placeholder="Position"
            value={opt.position}
            onChange={e => updateOption(idx, 'position', Number(e.target.value))}
          />
          <div className="flex items-center space-x-2">
            <Switch checked={opt.is_required} onCheckedChange={v => updateOption(idx, 'is_required', v)} />
            <span>Requis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={opt.is_multiple_choice} onCheckedChange={v => updateOption(idx, 'is_multiple_choice', v)} />
            <span>Choix multiple</span>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={addEmpty}>Ajouter une option</Button>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Précédent</Button>
        <Button onClick={() => onNext(options)}>Suivant</Button>
      </div>
    </div>
  );
}
