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
  const [formData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Form submitted:", data);
  };

  return (
    <div>
      <CreateItem onSubmit={handleSubmit} initialData={formData} />
      <ListItems
        items={sampleDishes.map((dish) => ({
          ...dish,
          id: dish.id.toString(),
        }))}
      />
    </div>
  );
}
