// src/pages/BillReadyPage.tsx
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy } from 'lucide-react';

const BillReadyPage = () => {
    const { code } = useParams<{ code: string }>();

    const handleCopy = () => {
        navigator.clipboard.writeText(code!);
        // You could show a toast notification here
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-green-100 p-3 rounded-full">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold pt-4">Your Bill is Ready!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-500">Share this code with your group to split the bill.</p>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Bill Code</p>
                        <p className="text-3xl font-bold tracking-widest my-2">{code}</p>
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                            <Copy className="w-4 h-4 mr-2" />
                            Tap to copy
                        </Button>
                    </div>
                    <div className="flex flex-col gap-3 pt-4">
                        <Button>Share Code</Button>
                        <Button variant="outline" asChild>
                            <Link to={`/bill/${code}`}>View Bill Overview</Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link to="/home">Back to Restaurants</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BillReadyPage;
