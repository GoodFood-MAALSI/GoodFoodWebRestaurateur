"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";
import Image from "next/image";
import { 
  ClipboardList, 
  BarChart3, 
  Pencil, 
  Star, 
  Users, 
  TrendingUp,
  ArrowRight,
  Sparkles
} from "lucide-react";
export default function HomePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const stats = [
    {
      icon: <Users size={32} className="text-green-600" />,
      value: "500+",
      label: "Restaurants partenaires"
    },
    {
      icon: <Star size={32} className="text-yellow-500" />,
      value: "4.8/5",
      label: "Note moyenne"
    },
    {
      icon: <TrendingUp size={32} className="text-blue-600" />,
      value: "+35%",
      label: "Croissance mensuelle"
    }
  ];
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#B5E48C] via-[#76C893] to-[#1E6091] min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-white rounded-full blur-xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-white/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <Image 
                  src={`${basePath}/GoodFood/logo.png`} 
                  alt="Logo GoodFood" 
                  width={250} 
                  height={250}
                  className="relative rounded-full shadow-2xl hover:scale-105 transition-transform duration-300"
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '250px',
                    maxHeight: '250px'
                  }}
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Révolutionnez votre
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                restaurant
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Développez votre activité avec notre plateforme de livraison tout-en-un. 
              Gérez vos commandes, analysez vos performances et fidélisez vos clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-white text-[#1E6091] hover:bg-gray-100 font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <Link href="/auth" className="flex items-center gap-2">
                  <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                  Rejoignez l&apos;expérience GoodFood
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center justify-center mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi choisir
            <span className="text-[#1E6091]"> notre solution ?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
            Découvrez les fonctionnalités qui feront de votre restaurant un véritable succès
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ClipboardList size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Gérez vos commandes facilement</h3>
              <p className="text-gray-600">Optimisez le traitement des commandes et améliorez l&apos;organisation de votre cuisine.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Statistiques en temps réel</h3>
              <p className="text-gray-600">Suivez vos performances grâce à des tableaux de bord intuitifs et détaillés.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Pencil size={32} className="text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Mise à jour rapide du menu</h3>
              <p className="text-gray-600">Modifiez votre carte en quelques clics et informez instantanément vos clients.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-[#B5E48C] to-[#1E6091] rounded-3xl p-12 text-white max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à transformer votre restaurant ?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des centaines de restaurateurs qui ont fait confiance à GoodFood
            </p>
            <Button asChild size="lg" className="bg-white text-[#1E6091] hover:bg-gray-100 font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <Link href="/auth" className="flex items-center gap-2">
                Commencer maintenant
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
