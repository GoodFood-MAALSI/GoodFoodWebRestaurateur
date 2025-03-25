import React from "react";

interface Item {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface ListItemsProps {
  items: Item[];
}

const ListItems: React.FC<ListItemsProps> = ({ items }) => {
  const categorizedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  const categoryOrder = ["Entrée", "Plat Principal", "Dessert", "Boisson"];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {categoryOrder.map(
        (category, index) =>
          categorizedItems[category] && (
            <div key={`${category}-${index}`}>
              <h2>{category}</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "10px",
                }}
              >
                {categorizedItems[category].map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      <h3>{item.title}</h3>
                      <p>${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default ListItems;
