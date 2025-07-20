"use client";
import { useAuthForm } from "@/components/hooks/useAuthForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { Toaster } from "@/components/ui/shadcn/sonner";
import { loginTexts } from "@/app/auth/constants";
import { COLORS } from "@/app/constants";
import { ForgotPasswordModal } from "@/components/forms/forgotPasswordModal";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
export default function AuthForm() {
  const { form, handleSubmit, onSubmit } = useAuthForm();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <Toaster />
      <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div 
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
          }}
        >
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h1>
        <p className="text-gray-600">Connectez-vous à votre espace restaurateur</p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                    {loginTexts.fields.email.label}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder={loginTexts.fields.email.placeholder}
                        className="pl-12 h-12 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = COLORS.primary;
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.primary}20`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                          field.onBlur();
                        }}
                        onChange={field.onChange}
                        value={field.value}
                        name={field.name}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 mb-2 block">
                    {loginTexts.fields.password.label}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={loginTexts.fields.password.placeholder}
                        className="pl-12 pr-12 h-12 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = COLORS.primary;
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.primary}20`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                          field.onBlur();
                        }}
                        onChange={field.onChange}
                        value={field.value}
                        name={field.name}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full h-12 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${COLORS.status.medium} 0%, ${COLORS.status.darker} 100%)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`;
                }}
              >
                <LogIn className="w-5 h-5 mr-2" />
                {loginTexts.submitButton}
              </Button>
              <div className="text-center">
                <ForgotPasswordModal />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
    </>
  );
}
