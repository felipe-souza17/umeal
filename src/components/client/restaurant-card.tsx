import { MapPin, Clock, Star } from 'lucide-react'
import Image from 'next/image'

interface RestaurantCardProps {
  restaurant: {
    id: number
    name: string
    categories: string[]
    image: string
    deliveryTime: string
    rating: number
    reviews: number
    address: string
  }
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="group cursor-pointer rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10">
      {/* Image Container */}
      <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-secondary">
        <img 
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-1">{restaurant.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {restaurant.categories.join(' • ')}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock size={16} className="text-primary" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star size={16} className="fill-primary text-primary" />
            <span className="font-medium">{restaurant.rating}</span>
            <span>({restaurant.reviews})</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1 text-sm text-muted-foreground">
          <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary" />
          <span className="line-clamp-1">{restaurant.address}</span>
        </div>

        {/* CTA Button */}
        <button className="w-full rounded-lg bg-primary py-2 font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95">
          View Menu
        </button>
      </div>
    </div>
  )
}
