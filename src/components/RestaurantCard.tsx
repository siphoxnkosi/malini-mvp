// src/components/RestaurantCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Restaurant {
  id: string;
  name: string;
  tags: string[];
  rating: number;
  distanceKm: number;
  imageUrl?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
        <Card className="overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
        <div
            className="w-full bg-center bg-cover aspect-[4/3]"
            style={{ backgroundImage: `url(${restaurant.imageUrl})` }}
        />
        <CardContent className="p-4">
            <h3 className="text-lg font-bold">{restaurant.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.distanceKm} km</span>
            </div>
            </div>
            <div className="flex items-center gap-2 pt-3">
            {restaurant.tags.map(tag => (
                <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {tag}
                </span>
            ))}
            </div>
        </CardContent>
        </Card>
    </Link>
  );
};

export default RestaurantCard;
