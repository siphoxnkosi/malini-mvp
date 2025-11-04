// src/pages/PastBillsPage.tsx
import { useQuery } from '@tanstack/react-query';
import { getBills, getCurrentUser } from '@/services/mockApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const PastBillsPage = () => {
    const user = getCurrentUser();
    const { data: bills, isLoading, error } = useQuery({
        queryKey: ['bills', user?.id],
        queryFn: () => getBills(user!.id),
        enabled: !!user,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {(error as Error).message}</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Past Bills</h2>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bills?.map(bill => {
                            const total = bill.items.reduce((acc, item) => acc + item.price * item.qty, 0) * (1 + bill.tipPct / 100);
                            return (
                                <TableRow key={bill.code}>
                                    <TableCell>{new Date(bill.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>${total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={bill.settled ? 'default' : 'secondary'}>
                                            {bill.settled ? 'Settled' : 'Pending'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {/* Actions like view details could go here */}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default PastBillsPage;
