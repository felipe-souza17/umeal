'use client'

import { useState, useMemo } from 'react'
import { Search, MapPin, Clock, Star } from 'lucide-react'
import { RestaurantCard } from './restaurant-card'
import { PromoBanner } from './promo-banner'

const CATEGORIES = ['Pizza', 'Sushi', 'Burgers', 'Thai', 'Chinese', 'Mexican', 'Salads', 'Desserts']

const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: 'Pizzeria Bella',
    categories: ['Pizza', 'Italian'],
    image: '/placeholder.svg?height=200&width=400',
    deliveryTime: '30-45 min',
    rating: 4.8,
    reviews: 342,
    address: '123 Main St, Downtown'
  },
  {
    id: 2,
    name: 'Sushi Master',
    categories: ['Sushi', 'Japanese'],
    image: '/placeholder.svg?height=200&width=400',
    deliveryTime: '25-35 min',
    rating: 4.9,
    reviews: 521,
    address: '456 Oak Ave, Midtown'
  },
  {
    id: 3,
    name: 'Burger Haven',
    categories: ['Burgers', 'American'],
    image: '/placeholder.svg?height=200&width=400',
    deliveryTime: '20-30 min',
    rating: 4.6,
    reviews: 289,
    address: '789 Pine St, Downtown'
  },
  {
    id: 4,
    name: 'Thai Garden',
    categories: ['Thai', 'Asian'],
    image: '/placeholder.svg?height=200&width=400',
    deliveryTime: '35-50 min',
    rating: 4.7,
    reviews: 198,
    address: '321 Elm Rd, Uptown'
  },
  {
    id: 5,
    name: 'Dragon Wok',
    categories: ['Chinese', 'Asian'],
    image: '/placeholder.svg?height=200&width=400',
    deliveryTime: '30-40 min',
    rating: 4.5,
    reviews: 412,
    address: '654 Maple Dr, East Side'
  },
  {
    id: 6,
    name: 'Taco Fiesta',
    categories: ['Mexican', 'Street Food'],
    image: '/placeholder.svg?height=200&width=400',
    deliveryTime: '15-25 min',
    rating: 4.8,
    reviews: 356,
    address: '987 Cedar Ln, West Side'
  }
]

export function ClientHome() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRestaurants = useMemo(() => {
    return MOCK_RESTAURANTS.filter(restaurant => {
      const matchesCategory = !selectedCategory || restaurant.categories.includes(selectedCategory)
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="bg-background">
      {/* Hero Section with Promo */}
      <PromoBanner />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 pl-12 text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground border border-border hover:border-primary'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground border border-border hover:border-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {selectedCategory ? `${selectedCategory} Restaurants` : 'Popular Restaurants'}
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="rounded-xl border border-border bg-card/50 py-12 text-center">
              <p className="text-muted-foreground">No restaurants found. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
