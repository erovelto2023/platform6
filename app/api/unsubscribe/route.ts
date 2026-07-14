import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/connect';
import Subscriber from '@/lib/db/models/Subscriber';
import MailingList from '@/lib/db/models/MailingList';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get('email');
        const listId = url.searchParams.get('listId');
        const id = url.searchParams.get('id'); // internal ID if used instead of email

        if (!email && !id) {
            return new NextResponse('Missing identifier', { status: 400 });
        }

        await connectToDatabase();

        let subscriber = null;
        if (email) {
            subscriber = await Subscriber.findOne({ email });
        } else if (id) {
            subscriber = await Subscriber.findOne({ id });
        }

        if (!subscriber) {
            return new NextResponse('Subscriber not found', { status: 404 });
        }

        if (listId) {
            // Remove from specific list
            const hasList = subscriber.lists.some(l => l.toString() === listId);
            if (hasList) {
                await Subscriber.findByIdAndUpdate(subscriber._id, {
                    $pull: { lists: listId }
                });
                await MailingList.findByIdAndUpdate(listId, { $inc: { subscriberCount: -1 } });
            }
            return new NextResponse(`
                <html>
                    <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#f9fafb;">
                        <div style="background:white;padding:40px;border-radius:10px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);text-align:center;">
                            <h1 style="color:#10b981;margin-bottom:10px;">Unsubscribed</h1>
                            <p style="color:#4b5563;">You have been removed from this mailing list.</p>
                        </div>
                    </body>
                </html>
            `, { headers: { 'Content-Type': 'text/html' } });
        } else {
            // Global unsubscribe
            if (subscriber.status !== 'unsubscribed') {
                await Subscriber.findByIdAndUpdate(subscriber._id, { status: 'unsubscribed' });
                // Note: we do not decrement list counts for global unsubscribes immediately 
                // unless we also clear their lists array, but it's often better to keep them in the array 
                // and just check status when sending.
            }
            return new NextResponse(`
                <html>
                    <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#f9fafb;">
                        <div style="background:white;padding:40px;border-radius:10px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);text-align:center;">
                            <h1 style="color:#10b981;margin-bottom:10px;">Unsubscribed</h1>
                            <p style="color:#4b5563;">You have been unsubscribed from all emails.</p>
                        </div>
                    </body>
                </html>
            `, { headers: { 'Content-Type': 'text/html' } });
        }
    } catch (error) {
        console.error('Unsubscribe API Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
