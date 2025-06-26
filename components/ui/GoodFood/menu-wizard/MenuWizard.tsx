import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/shadcn/dialog";
import { Button } from "@/components/ui/shadcn/button";
import CategoryStep from "./CategoryStep";
import ItemDetailsStep from "./ItemDetailsStep";
import OptionStep from "./OptionStep";
import OptionValueStep from "./OptionValueStep";
import ProgressionSteps from "@/components/ui/GoodFood/progression-steps/ProgressionSteps";
import { MenuItem } from "@/types/menu/menuItem";

interface MenuWizardProps {
  restaurantId: number;
  onFinish: (data: MenuItem) => void;
}

export default function MenuWizard({ restaurantId, onFinish }: MenuWizardProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<any>();
  const [details, setDetails] = useState<any>();
  const [options, setOptions] = useState<any[]>([]);
  const [values, setValues] = useState<any[][]>([]);

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const handleFinish = () => {
    const id = Date.now()
    const item: MenuItem = {
      id,
      name: details.name,
      description: details.description,
      price: details.price,
      promotion: details.promotion,
      picture: "null",
      is_available: details.is_available,
      position: details.position,
      menuCategoryId: category.id,
      menuItemOptions: options.map((opt, idx) => ({
      id: Date.now(),
      name: opt.name,
      is_required: opt.is_required,
      is_multiple_choice: opt.is_multiple_choice,
      position: opt.position,
      menuItemOptionValues: values[idx] || [],
      })),
    };
    onFinish(item);
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      setStep(0);
      setCategory(undefined);
      setDetails(undefined);
      setOptions([]);
      setValues([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un article</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Création d'article</DialogTitle>
        </DialogHeader>
        <ProgressionSteps
          steps={["Catégorie", "Détails", "Options", "Valeurs"]}
          current={step}
        />
        <div className="py-4">
          {step === 0 && (
            <CategoryStep
              restaurantId={restaurantId}
              selectedCategory={category}
              onNext={(c) => { setCategory(c); next(); }}
            />
          )}
          {step === 1 && (
            <ItemDetailsStep
              initial={details}
              onBack={back}
              onNext={(d) => { setDetails(d); next(); }}
            />
          )}
          {step === 2 && (
            <OptionStep
              initial={options}
              onBack={back}
              onNext={(o) => { setOptions(o); next(); }}
            />
          )}
          {step === 3 && (
            <OptionValueStep
              options={options.map((o) => ({ id: o.id, name: o.name }))}
              initial={values}
              onBack={back}
              onFinish={(v) => { setValues(v); handleFinish(); }}
            />
          )}
        </div>
        <DialogFooter>
          {step === 3 ? (
            <Button onClick={handleFinish}>Terminer</Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
