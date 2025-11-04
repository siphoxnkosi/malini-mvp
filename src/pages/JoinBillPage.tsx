// src/pages/JoinBillPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { joinBill } from '@/services/mockApi';
import { AlertCircle } from 'lucide-react';

const JoinBillPage = () => {
  const [billCode, setBillCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await joinBill(billCode.toUpperCase());
      navigate(`/bill/${billCode.toUpperCase()}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black">Enter Bill Code</CardTitle>
          <CardDescription>Join an existing bill-splitting session by entering the code below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="billCode">Bill Code</Label>
              <Input
                id="billCode"
                placeholder="ABCD-1234"
                value={billCode}
                onChange={(e) => setBillCode(e.target.value)}
                required
                className="uppercase tracking-widest"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full">
              Join
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinBillPage;
