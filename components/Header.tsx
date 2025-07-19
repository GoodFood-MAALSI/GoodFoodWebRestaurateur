"use client";

import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/shadcn/navigation-menu";
import Image from "next/image";
import { COLORS } from "@/app/constants";
import { User, Home, Building2, ShoppingCart, Star, BarChart3, LogOut } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default function Header({ showNavbar }: { showNavbar: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 bg-white shadow-lg border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <div className="relative">
              <Image
                src={`${basePath}/GoodFood/logo-textless.jpg`}
                alt="GoodFoodLogo"
                width={45}
                height={45}
                className="rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '45px',
                  maxHeight: '45px'
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ 
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                GoodFood
              </h1>
              <p className="text-xs font-medium" style={{ color: COLORS.text.secondary }}>Espace Restaurateur</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {showNavbar && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            )}
          </div>
        </div>

        {showNavbar && (
          <div className="border-t border-gray-100">
            <nav className="flex justify-center py-4">
              <NavigationMenu>
                <NavigationMenuList className="flex space-x-1 bg-gray-50 p-1 rounded-xl">
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      onClick={() => router.push("/")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white transition-all duration-200 cursor-pointer group"
                      style={{ color: COLORS.text.secondary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
                      onMouseLeave={(e) => e.currentTarget.style.color = COLORS.text.secondary}
                    >
                      <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Accueil</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      onClick={() => router.push("/profile")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white transition-all duration-200 cursor-pointer group"
                      style={{ color: COLORS.text.secondary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
                      onMouseLeave={(e) => e.currentTarget.style.color = COLORS.text.secondary}
                    >
                      <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Mon Profil</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      onClick={() => router.push("/restaurants")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white transition-all duration-200 cursor-pointer group"
                      style={{ color: COLORS.text.secondary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
                      onMouseLeave={(e) => e.currentTarget.style.color = COLORS.text.secondary}
                    >
                      <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Mes Restaurants</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      onClick={() => router.push("/orders")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white transition-all duration-200 cursor-pointer group"
                      style={{ color: COLORS.text.secondary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
                      onMouseLeave={(e) => e.currentTarget.style.color = COLORS.text.secondary}
                    >
                      <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Commandes</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      onClick={() => router.push("/ratings")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white transition-all duration-200 cursor-pointer group"
                      style={{ color: COLORS.text.secondary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
                      onMouseLeave={(e) => e.currentTarget.style.color = COLORS.text.secondary}
                    >
                      <Star className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Avis</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      onClick={() => router.push("/stats")}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white transition-all duration-200 cursor-pointer group"
                      style={{ color: COLORS.text.secondary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
                      onMouseLeave={(e) => e.currentTarget.style.color = COLORS.text.secondary}
                    >
                      <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Statistiques</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
