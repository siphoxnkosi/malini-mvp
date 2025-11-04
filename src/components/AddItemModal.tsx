// src/components/AddItemModal.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addItemToBill } from '@/services/mockApi';

interface AddItemModalProps {
  billCode: string;
  participants: { id: string; name: string }[];
  onClose: () => void;
}

const AddItemModal = ({ billCode, participants, onClose }: AddItemModalProps) => {
    const queryClient = useQueryClient();
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [assignedParticipants, setAssignedParticipants] = useState<string[]>([]);

    const mutation = useMutation({
        mutationFn: (newItem: { name: string; price: number; qty: number, assignments: {participantId: string}[] }) => addItemToBill(billCode, newItem),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bill', billCode] });
            onClose();
        },
    });

    const handleAddItem = () => {
        if (!itemName || !itemPrice || assignedParticipants.length === 0) {
            alert("Please fill all fields and assign at least one participant.");
            return;
        }
        mutation.mutate({
            name: itemName,
            price: parseFloat(itemPrice),
            qty: quantity,
            assignments: assignedParticipants.map(id => ({ participantId: id })),
        });
    };

    const handleParticipantToggle = (participantId: string) => {
        setAssignedParticipants(prev =>
            prev.includes(participantId)
                ? prev.filter(id => id !== participantId)
                : [...prev, participantId]
        );
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g., Classic Burger" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="itemPrice">Price</Label>
                <Input id="itemPrice" type="number" value={itemPrice} onChange={e => setItemPrice(e.target.value)} placeholder="e.g., 15.99" />
            </div>
            <div className="flex items-center justify-between">
                <p className="font-medium">Quantity</p>
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
                    <span>{quantity}</span>
                    <Button size="icon" variant="outline" onClick={() => setQuantity(q => q + 1)}>+</Button>
                </div>
            </div>
            <div>
                <p className="font-medium mb-2">Assign To</p>
                <div className="space-y-2">
                    {participants.map(p => (
                        <div key={p.id} className="flex items-center gap-2">
                            <Checkbox
                                id={`participant-${p.id}`}
                                checked={assignedParticipants.includes(p.id)}
                                onCheckedChange={() => handleParticipantToggle(p.id)}
                            />
                            <Label htmlFor={`participant-${p.id}`}>{p.name}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button onClick={handleAddItem} disabled={mutation.isPending}>
                    {mutation.isPending ? 'Adding...' : 'Add to Bill'}
                </Button>
            </div>
        </div>
    );
};

export default AddItemModal;
