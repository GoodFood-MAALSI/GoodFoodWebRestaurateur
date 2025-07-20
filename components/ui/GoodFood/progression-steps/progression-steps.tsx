import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Progress } from "@/components/ui/shadcn/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/shadcn/carousel";
import { User, Camera, Info, ShieldCheck, Upload } from "lucide-react";
import { COLORS } from "@/app/constants";
const defaultSteps = [
  {
    id: 1,
    title: "Informations de base",
    description:
      "Fournissez les informations essentielles de votre restaurant.",
    icon: User,
  },
  {
    id: 2,
    title: "Photo de profil",
    description: "Ajoutez une photo de profil pour représenter votre marque.",
    icon: Camera,
  },
  {
    id: 3,
    title: "Premier élément du menu",
    description: "Créez votre premier élément de menu.",
    icon: Info,
  },
  {
    id: 4,
    title: "Catégorie de plats",
    description: "Créez une catégorie pour vos plats.",
    icon: ShieldCheck,
  },
  {
    id: 5,
    title: "Consulter les KPIs",
    description:
      "Analysez les performances de votre restaurant grâce aux KPIs.",
    icon: Upload,
  },
];
export default function ProfileSetupSteps({ steps = defaultSteps }) {
  const [currentStep, setCurrentStep] = useState(0);
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  return (
    <Card className="shadow-lg p-6">
      <CardHeader>
        <h2 className="text-xl font-bold">
          Suivez ces étapes pour bien renseigner votre profil
        </h2>
      </CardHeader>
      <CardContent>
        <Carousel>
          <CarouselContent>
            {steps.map((step, index) => (
              <CarouselItem
                key={step.id}
                className={index === currentStep ? "block" : "hidden"}
              >
                <div className="flex flex-col items-center text-center p-6">
                  <step.icon style={{ color: COLORS.info }} size={48} />
                  <h3 className="text-lg font-semibold mt-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {step.description}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Progress
          value={(currentStep / (steps.length - 1)) * 100}
          className="mt-4"
        />
        <div className="flex justify-between mt-4">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
          >
            Précédent
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
          >
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
