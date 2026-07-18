'use server';

import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/db/connect';
import Client from '@/lib/db/models/Client';
import Invoice from '@/lib/db/models/Invoice';
import { getActiveBusinessId } from './business.actions';

export async function getStatementRecipients(status: 'open' | 'overdue' | 'all' = 'open') {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };

        await connectDB();
        const businessId = await getActiveBusinessId();

        // Fetch clients
        const clients = await Client.find({ businessId }).sort({ name: 1 });
        const clientIds = clients.map(c => c._id);

        // Fetch all invoices for these clients
        const invoices = await Invoice.find({
            businessId,
            clientId: { $in: clientIds }
        });

        // Map client balances
        const today = new Date();
        const recipients = clients.map(client => {
            const clientInvoices = invoices.filter(inv => inv.clientId.toString() === client._id.toString());
            
            // Calculate balances
            let openBalance = 0;
            let overdueBalance = 0;

            clientInvoices.forEach(inv => {
                if (inv.status !== 'paid') {
                    openBalance += inv.total;
                    const dueDate = new Date(inv.dueDate);
                    if (dueDate < today) {
                        overdueBalance += inv.total;
                    }
                }
            });

            return {
                id: client._id.toString(),
                name: client.name,
                email: client.email || '',
                openBalance,
                overdueBalance,
                hasActivity: clientInvoices.length > 0
            };
        });

        // Filter based on selected criteria
        const filtered = recipients.filter(r => {
            if (status === 'open') return r.openBalance > 0;
            if (status === 'overdue') return r.overdueBalance > 0;
            return r.hasActivity; // all with activity
        });

        return { data: JSON.parse(JSON.stringify(filtered)) };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to fetch statement recipients' };
    }
}

export async function createStatement(data: {
    clientId: string;
    statementType: string;
    statementDate: string;
    startDate: string;
    endDate: string;
}) {
    try {
        const { userId } = await auth();
        if (!userId) return { error: 'Unauthorized' };
        // In a real system, we'd save this statement to the DB.
        // For now, we simulate success for the demo.
        return { success: true };
    } catch (e) {
        return { error: 'Failed to create statement' };
    }
}
