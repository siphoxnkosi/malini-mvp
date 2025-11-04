// src/components/PatronBillView.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// This is a simplified version of the Bill type from the API
interface Bill {
    code: string;
    title: string;
    createdAt: Date;
    items: { id: string, name: string; price: number; qty: number }[];
    participants: { id: string; name: string }[];
    tipPct: number;
}

interface PatronBillViewProps {
    bill: Bill;
}

const PatronBillView = ({ bill }: PatronBillViewProps) => {
    const subtotal = bill.items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tipAmount = subtotal * (bill.tipPct / 100);
    const total = subtotal + tipAmount;

    // Simple calculation for equal split
    const amountPerPerson = total / bill.participants.length;

    return (
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
                <div className="border-b pb-6 mb-6">
                    <h1 className="text-4xl font-black">{bill.title}</h1>
                    <p className="text-gray-500 mt-1">Bill Details</p>
                </div>
                <h3 className="text-lg font-bold mb-4">Itemized Bill</h3>
                <div className="divide-y">
                    {bill.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                            </div>
                            <p className="font-medium">R{(item.price * item.qty).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-6 border-t">
                    <div className="space-y-3">
                        <div className="flex justify-between text-gray-600"><p>Subtotal</p><p>R{subtotal.toFixed(2)}</p></div>
                        <div className="flex justify-between text-gray-600"><p>Tip ({bill.tipPct}%)</p><p>R{tipAmount.toFixed(2)}</p></div>
                        <div className="flex justify-between text-lg font-bold pt-3 border-t mt-3"><p>Grand Total</p><p>R{total.toFixed(2)}</p></div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-lg font-bold mb-4">Participants</h3>
                    <div className="flex items-center -space-x-4 mb-6">
                        {/* Simplified participant avatars */}
                        {bill.participants.map(p => (
                            <div key={p.id} className="inline-block size-12 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center">
                                <span className="font-semibold">{p.name.charAt(0)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-blue-50 rounded-xl shadow-lg p-8 text-center">
                    <p className="text-lg font-medium text-gray-600">You Pay</p>
                    <p className="text-5xl font-black my-2">R{amountPerPerson.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Split {bill.participants.length} ways</p>
                    <Button asChild className="w-full mt-6"><Link to={`/pay/${bill.code}`}>Settle My Portion</Link></Button>
                </div>
            </div>
        </div>
    );
};

export default PatronBillView;
