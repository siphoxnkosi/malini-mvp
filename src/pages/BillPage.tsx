// src/pages/BillPage.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBill, addParticipantToBill, getCurrentUser } from '@/services/mockApi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AddItemModal from '@/components/AddItemModal';
import BillSummary from '@/components/BillSummary';
import { Input } from '@/components/ui/input';
import PatronBillView from '@/components/PatronBillView';

const BillPage = () => {
    const { code } = useParams<{ code: string }>();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newParticipantName, setNewParticipantName] = useState('');
    const user = getCurrentUser();

    const { data: bill, isLoading, error } = useQuery({
        queryKey: ['bill', code],
        queryFn: () => getBill(code!)
    });

    const addParticipantMutation = useMutation({
        mutationFn: (name: string) => addParticipantToBill(code!, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bill', code] });
            setNewParticipantName('');
        }
    });

    const handleAddParticipant = (e: React.FormEvent) => {
        e.preventDefault();
        if (newParticipantName.trim()) {
            addParticipantMutation.mutate(newParticipantName.trim());
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {(error as Error).message}</div>;
    if (!bill) return <div>Bill not found.</div>;

    // Render patron view if user is a patron
    if (user?.role === 'patron') {
        return <PatronBillView bill={bill} />;
    }

    // Otherwise, render the default waiter view
    return (
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
                <div className="border-b pb-4 mb-4">
                    <h1 className="text-3xl font-black">{bill.title}</h1>
                    <p className="text-gray-500">{new Date(bill.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="divide-y">
                    {bill.items.length === 0 && <p className="text-gray-500 py-4">No items yet. Add one to get started!</p>}
                    {bill.items.map(item => (
                        <div key={item.id} className="py-4 flex justify-between items-center">
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">${item.price.toFixed(2)} x {item.qty}</p>
                            </div>
                            <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="mt-4">Add Item</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Item to Bill</DialogTitle>
                        </DialogHeader>
                        <AddItemModal
                            billCode={code!}
                            participants={bill.participants}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Participants</h3>
                    <div className="space-y-2">
                        {bill.participants.map(p => (
                            <div key={p.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <p>{p.name}</p>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddParticipant} className="flex gap-2 mt-4">
                        <Input
                            placeholder="New participant name..."
                            value={newParticipantName}
                            onChange={(e) => setNewParticipantName(e.target.value)}
                        />
                        <Button type="submit" disabled={addParticipantMutation.isPending}>
                            {addParticipantMutation.isPending ? 'Adding...' : 'Add'}
                        </Button>
                    </form>
                </div>
                <BillSummary bill={bill} />
            </div>
        </div>
    );
};

export default BillPage;
