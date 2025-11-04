// src/pages/PaymentPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBill, makePayment } from '@/services/mockApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';

const PaymentPage = () => {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isPaid, setIsPaid] = useState(false);

    const { data: bill, isLoading, error } = useQuery({
        queryKey: ['bill', code],
        queryFn: () => getBill(code!)
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {(error as Error).message}</div>;
    if (!bill) return <div>Bill not found.</div>;

    const subtotal = bill.items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tipAmount = subtotal * (bill.tipPct / 100);
    const total = subtotal + tipAmount;
    const amountToPay = total / bill.participants.length;

    const handlePayment = async () => {
        try {
            await makePayment(code!, amountToPay, paymentMethod);
            setIsPaid(true);
            setTimeout(() => navigate('/home'), 2000); // Redirect after 2s
        } catch (err) {
            console.error(err);
            // Show error toast
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-4xl font-black">Pay R{amountToPay.toFixed(2)}</CardTitle>
                    <CardDescription>Choose your payment method for your share of the bill.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-6 space-y-2">
                        <Label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                            <div>
                                <p className="font-medium">PayShap</p>
                                <p className="text-sm text-gray-500">Scan the QR to pay</p>
                            </div>
                            <RadioGroupItem value="payshap" />
                        </Label>
                         <Label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                            <div>
                                <p className="font-medium">Card</p>
                                <p className="text-sm text-gray-500">Use a debit or credit card</p>
                            </div>
                            <RadioGroupItem value="card" />
                        </Label>
                         <Label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                            <div>
                                <p className="font-medium">Cash</p>
                                <p className="text-sm text-gray-500">Pay with physical currency</p>
                            </div>
                            <RadioGroupItem value="cash" />
                        </Label>
                    </RadioGroup>
                    <Button onClick={handlePayment} className="w-full">Confirm Payment</Button>
                </CardContent>
            </Card>

            {isPaid && (
                 <div className="fixed bottom-5 right-5 flex items-center gap-4 bg-green-600 text-white p-4 rounded-xl shadow-2xl">
                    <CheckCircle />
                    <p className="text-sm font-medium">Payment confirmed</p>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
