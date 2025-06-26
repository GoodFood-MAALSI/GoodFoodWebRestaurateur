interface RestaurantCardProps {
  name: string;
  description: string;
  image?: string;
  onClick?: () => void;
}

export const RestaurantCard = ({ name, description, image, onClick }: RestaurantCardProps) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border p-4 shadow-md hover:shadow-lg transition"
    >
      {image && (
        <img src={image} alt={name} className="w-full h-40 object-cover rounded-md mb-4" />
      )}
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
