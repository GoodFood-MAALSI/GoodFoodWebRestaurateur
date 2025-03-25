"use client";

import { useState } from "react";
import CreateItem from "@/components/ui/GoodFood/create-item/create-item";
import ListItems from "@/components/ui/GoodFood/list-items/list-items";
import { sampleDishes } from "./constants";

interface FormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function RestaurantItemForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div>
      <CreateItem onSubmit={handleSubmit} initialData={formData} />
      <ListItems items={sampleDishes} />
    </div>
  );
}
