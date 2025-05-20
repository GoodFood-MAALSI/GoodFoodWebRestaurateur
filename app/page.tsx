"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";

import Image from "next/image";

import { ClipboardList, BarChart3, Pencil } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const features = [
  {
    title: "Gérez vos commandes facilement",
    description:
      "Optimisez le traitement des commandes et améliorez l’organisation de votre cuisine.",
    icon: <ClipboardList size={32} className="text-primary" />,
  },
  {
    title: "Statistiques en temps réel",
    description:
      "Suivez vos performances grâce à des tableaux de bord intuitifs et détaillés.",
    icon: <BarChart3 size={32} className="text-primary" />,
  },
  {
    title: "Mise à jour rapide du menu",
    description:
      "Modifiez votre carte en quelques clics et informez instantanément vos clients.",
    icon: <Pencil size={32} className="text-primary" />,
  },
];

const LandingPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#B5E48C] to-[#1E6091] flex flex-col">
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <Image src={`${basePath}/GoodFood/logo.png`} alt="Logo" width={200} height={200} />
        <p className="text-lg text-white/80 mb-8 animate-fadeInUp">
          Développez votre activité avec notre plateforme de livraison
          tout-en-un.
        </p>
        <Link href="/auth" passHref>
          <Button variant="default" size="lg">
            Rejoignez l'expérience GoodFood
          </Button>
        </Link>
      </section>

      <section className="bg-white rounded-t-3xl py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Pourquoi choisir notre solution ?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="shadow-md hover:shadow-xl transition-shadow duration-300 p-4"
              >
                <CardHeader className="flex items-center space-x-4">
                  {feature.icon}
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
