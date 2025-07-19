import { MenuItem } from "@/types/menu/menuItem";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import { COLORS } from "@/app/constants";

interface EditItemFormProps {
  item: MenuItem;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  price: string;
  image: FileList;
}

const EditItemForm: React.FC<EditItemFormProps> = ({ item, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: item.name,
      price: item.price,
    },
  });

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: FormValues) => {
    setErrorMessage("");

    try {
      const res = await fetch(`api/menu-items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          name: data.name,
          price: data.price,
        }),
      });

      if (!res.ok) throw new Error("Échec de la mise à jour des données.");

      if (data.image && data.image.length > 0) {
        const formData = new FormData();
        formData.append("file", data.image[0]);

        const method = item.picture ? "PATCH" : "POST";

        const imgRes = await fetch(
          `/menu-items/${item.id}/upload-image`,
          {
            method,
            body: formData,
          }
        );

        if (!imgRes.ok)
          throw new Error(
            method === "POST"
              ? "Échec de l’upload de l’image."
              : "Échec du remplacement de l’image."
          );
      }

      onSuccess();
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const handleImageRemove = async () => {
    if (!item.imageId) return;
    try {
      const res = await fetch(
        `/menu-items/${item.id}/remove-image/${item.imageId}`,
        {
          method: "PATCH",
        }
      );
      if (!res.ok) throw new Error("Échec de la suppression de l’image.");
      onSuccess();
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nom</label>
        <input
          {...register("name", { required: true })}
          className="w-full border border-gray-300 p-2 rounded"
        />
        {errors.name && <p className="text-sm" style={{ color: COLORS.error }}>Nom requis</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Prix (€)</label>
        <input
          type="number"
          step="0.01"
          {...register("price", { required: true, valueAsNumber: true })}
          className="w-full border border-gray-300 p-2 rounded"
        />
        {errors.price && <p className="text-sm" style={{ color: COLORS.error }}>Prix requis</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          {item.picture ? "Remplacer l’image" : "Image (optionnelle)"}
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="w-full"
        />
      </div>

      {item.picture && (
        <div className="flex flex-col items-start space-y-2">
          <img
            src={item.picture}
            alt="Aperçu"
            className="w-32 h-32 object-cover rounded"
            style={{
              width: '128px',
              height: '128px',
              objectFit: 'cover'
            }}
          />
          <Button
            variant="destructive"
            type="button"
            onClick={handleImageRemove}
          >
            Supprimer l’image actuelle
          </Button>
        </div>
      )}

      {errorMessage && <p className="text-sm" style={{ color: COLORS.error }}>{errorMessage}</p>}

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sauvegarde..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default EditItemForm;
