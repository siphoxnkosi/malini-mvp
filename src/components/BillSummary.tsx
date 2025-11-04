// src/components/BillSummary.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { updateBill } from '@/services/mockApi';

interface Bill {
    code: string;
    items: { price: number; qty: number }[];
    tipPct: number;
}

interface BillSummaryProps {
    bill: Bill;
}

const BillSummary = ({ bill }: BillSummaryProps) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const tipOptions = [10, 15, 20];

    const subtotal = bill.items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tipAmount = subtotal * (bill.tipPct / 100);
    const total = subtotal + tipAmount;

    const tipMutation = useMutation({
        mutationFn: (tipPct: number) => updateBill(bill.code, { tipPct }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bill', bill.code] });
        }
    });

    const settleMutation = useMutation({
        mutationFn: () => updateBill(bill.code, { settled: true }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bill', bill.code] });
            navigate(`/bill/${bill.code}/ready`);
        }
    });

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Summary</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tip ({bill.tipPct}%)</span>
                    <span>${tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            <div className="mt-6">
                <p className="font-medium mb-2">Tip</p>
                <div className="grid grid-cols-3 gap-2">
                    {tipOptions.map(tip => (
                        <Button
                            key={tip}
                            variant={bill.tipPct === tip ? 'secondary' : 'outline'}
                            onClick={() => tipMutation.mutate(tip)}
                        >
                            {tip}%
                        </Button>
                    ))}
                </div>
            </div>
            <Button
                className="w-full mt-6"
                onClick={() => settleMutation.mutate()}
                disabled={settleMutation.isPending}
            >
                {settleMutation.isPending ? 'Settling...' : 'Settle & Generate Bill Code'}
            </Button>
        </div>
    );
};

export default BillSummary;
