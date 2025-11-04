// src/pages/RestaurantMenuPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMenu, createBill } from '@/services/mockApi';
import { Button } from '@/components/ui/button';

const RestaurantMenuPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: menu, isLoading, error } = useQuery({
        queryKey: ['menu', id],
        queryFn: () => getMenu(id!)
    });

    const handleCreateBill = async () => {
        try {
            const newBill = await createBill(id!);
            navigate(`/bill/${newBill.code}`);
        } catch (error) {
            console.error("Failed to create bill:", error);
            // You could show a toast notification here
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {(error as Error).message}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Menu</h2>
                <Button onClick={handleCreateBill}>Create Bill</Button>
            </div>
            {menu?.map(category => (
                <div key={category.id} className="mb-4">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        {category.items?.map(item => (
                            <div key={item.id} className="p-4 border rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{item.name}</p>
                                    <p>R{item.price.toFixed(2)}</p>
                                </div>
                                <Button size="sm">+</Button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RestaurantMenuPage;
