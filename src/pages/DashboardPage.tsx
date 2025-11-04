// src/pages/DashboardPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRestaurants } from '@/services/mockApi';
import RestaurantCard from '@/components/RestaurantCard';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { toast } from "sonner"

const DashboardPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: restaurants, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants
  });

  const filteredRestaurants = restaurants?.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6">
        <h2 className="text-2xl font-bold">Your Restaurants</h2>
        <div className="flex gap-2">
            <Input
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
            />
          <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}>
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}>
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants?.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRestaurants?.map(restaurant => (
            <div key={restaurant.id} className="p-4 border rounded-lg">
                {restaurant.name}
            </div>
          ))}
        </div>
      )}

        <div className="fixed bottom-8 right-8">
            <Button
                size="icon"
                className="w-16 h-16 rounded-full shadow-lg"
                onClick={() => toast("Coming soon!", { description: "Custom bill creation will be available in a future update." })}
            >
                <Plus className="w-8 h-8" />
            </Button>
        </div>
    </div>
  );
};

export default DashboardPage;
