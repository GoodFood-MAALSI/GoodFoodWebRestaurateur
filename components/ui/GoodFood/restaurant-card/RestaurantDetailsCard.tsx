interface Props {
  restaurant: {
    name: string;
    description: string;
    street_number: string;
    street: string;
    city: string;
    postal_code: string;
    country: string;
    siret: string;
    is_open: boolean;
  };
}
export function RestaurantDetailsCard({ restaurant }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-3">
      <p><strong>Description:</strong> {restaurant.description}</p>
      <p><strong>Adresse:</strong> {`${restaurant.street_number} ${restaurant.street}, ${restaurant.postal_code} ${restaurant.city}, ${restaurant.country}`}</p>
      <p><strong>SIRET:</strong> {restaurant.siret}</p>
      <p><strong>Statut:</strong> {restaurant.is_open ? "Ouvert" : "Fermé"}</p>
    </div>
  );
}
