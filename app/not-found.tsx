// app/not-found.tsx (Next.js App Router)
import Link from "next/link";
import { Button } from "@/components/ui/shadcn/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">
        Oups ! Cette page n&#39;existe pas.
      </p>
      <Link href="/" passHref>
        <Button className="mt-6">Retour à l&#39;accueil</Button>
      </Link>
    </main>
  );
}
