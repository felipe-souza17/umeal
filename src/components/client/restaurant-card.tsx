import { MapPin, Clock, Star } from "lucide-react";
import Image from "next/image";
import { DeliveryAddress } from "../restaurant/restaurant-kanban";
import Link from "next/link";

export interface Restaurant {
  id: string;
  restaurantName: string;
  cnpj: string;
  address: DeliveryAddress;
  categories: { id: number; name: string }[];
  imageUrl?: string;
}

const getPlaceholderImage = (category: string = "food") => {
  const keywords: Record<string, string> = {
    Japonesa: "sushi",
    Brasileira: "feijoada",
    Pizza: "pizza",
    Hambúrguer: "burger",
    Lanches: "sandwich",
    Bebidas: "cocktail",
    Sobremesas: "dessert",
  };
  const keyword = keywords[category] || "restaurant";
  return `https://picsum.photos/500/300?${keyword},food`;
};

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const category =
    restaurant.categories.length > 0 ? restaurant.categories[0].name : "Geral";
  const image = restaurant.imageUrl || getPlaceholderImage(category);
  return (
    <Link href={`restaurant/${restaurant.id}`}>
      <div className="group cursor-pointer rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10">
        {/* Image Container */}
        <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-secondary">
          <img
            src={image}
            alt={restaurant.restaurantName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-1">
              {restaurant.restaurantName}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {restaurant.categories.map((c) => c.name).join(" • ")}
            </p>
          </div>

          {/* <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock size={16} className="text-foreground" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star size={16} className="fill-primary text-foreground" />
            <span className="font-medium">{restaurant.rating}</span>
            <span>({restaurant.reviews})</span>
          </div>
        </div> */}

          {/* Address */}
          <div className="flex items-start gap-1 text-sm text-muted-foreground">
            <MapPin
              size={16}
              className="mt-0.5 flex-shrink-0 text-foreground"
            />
            <span className="line-clamp-1">
              {restaurant.address.street}, {restaurant.address.number} -{" "}
              {restaurant.address.neighborhood}, {restaurant.address.city} -{" "}
              {restaurant.address.state}
            </span>
          </div>

          {/* CTA Button */}
          <button className="w-full rounded-lg bg-primary py-2 font-medium text-foreground-foreground transition-all hover:bg-primary/90 active:scale-95">
            Ver Menu
          </button>
        </div>
      </div>
    </Link>
  );
}
