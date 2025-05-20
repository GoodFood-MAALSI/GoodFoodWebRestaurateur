"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/shadcn/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/shadcn/avatar";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import ProfileSetupSteps from "@/components/ui/GoodFood/progression-steps/progression-steps";
import LogoutSection from "@/components/ui/GoodFood/logout/Logout";

const customersServedData = [
  { date: "03/10", Clients: 80 },
  { date: "03/11", Clients: 120 },
  { date: "03/12", Clients: 95 },
  { date: "03/13", Clients: 150 },
  { date: "03/14", Clients: 110 },
];

const restaurantRatingData = [
  { period: "Jour", Notes: 4.6 },
  { period: "Semaine", Notes: 4.4 },
  { period: "Mois", Notes: 4.7 },
];

const ordersDeliveredData = [
  { date: "Mar 10", Commandes: 50 },
  { date: "Mar 11", Commandes: 70 },
  { date: "Mar 12", Commandes: 65 },
  { date: "Mar 13", Commandes: 90 },
  { date: "Mar 14", Commandes: 80 },
];

interface ProfileData {
  restaurantName: string;
  email: string;
  phone: string;
}

const ProfileCard: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    restaurantName: "Le Gourmet Express",
    email: "gourmetexpress@gmail.com",
    phone: "0123456789",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(profile);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="/avatar/cesi.png" alt={profile.restaurantName} />
          <AvatarFallback>{profile.restaurantName.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{profile.restaurantName}</h2>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="restaurantName"
              >
                Restaurant Name
              </label>
              <Input
                id="restaurantName"
                name="restaurantName"
                type="text"
                value={formData.restaurantName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">
                N° de téléphone
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <CardFooter className="flex justify-end space-x-2">
              <Button type="submit">Save</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </CardFooter>
          </form>
        ) : (
          <div className="space-y-2">
            <div>
              <strong>Email:</strong> {profile.email}
            </div>
            <div>
              <strong>N° de téléphone:</strong> {profile.phone}
            </div>
          </div>
        )}
      </CardContent>
      {!isEditing && (
        <CardFooter className="flex self-center">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Mettre à jour les coordonnées
          </Button>
          <LogoutSection />
        </CardFooter>
      )}
    </Card>
  );
};

const QuickMenuSection: React.FC = () => {
  const router = useRouter();

  const handleCreateMenu = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/create-menu");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-bold">Ajout rapide</h2>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleCreateMenu}
          className="flex items-center space-x-3"
        >
          <Input
            type="text"
            placeholder="Entrer le nom du nouveau plat"
            required
          />
          <Button type="submit">Passer à la création</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const KPISection: React.FC = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-bold">Métriques récentes</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Clients</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={customersServedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="Clients"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Évaluations</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={restaurantRatingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[4, 5]} />
              <Tooltip />
              <Bar dataKey="Notes" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Commandes traités</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ordersDeliveredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Commandes" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const RestaurateurProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full max-w-[1400px] mx-auto px-6 pt-20 pb-6 flex-1 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <ProfileCard />
            <QuickMenuSection />
          </div>
          <div>
            <KPISection />
          </div>
        </div>
        <div>
          <ProfileSetupSteps />
        </div>
      </div>
    </div>
  );
};

export default RestaurateurProfilePage;
