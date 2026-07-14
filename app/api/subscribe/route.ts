import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/connect';
import Subscriber from '@/lib/db/models/Subscriber';
import MailingList from '@/lib/db/models/MailingList';

export async function POST(req: NextRequest) {
    try {
        let body;
        
        // Handle both JSON and FormData (for standard HTML forms)
        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            body = await req.json();
        } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            body = {
                email: formData.get('email')?.toString(),
                name: formData.get('name')?.toString(),
                listId: formData.get('listId')?.toString()
            };
        } else {
            return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
        }

        const { email, name, listId } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Capture IP Address
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

        await connectToDatabase();

        let listsToAssign: string[] = [];
        if (listId) {
            // Verify list exists
            const list = await MailingList.findById(listId);
            if (list) {
                listsToAssign.push(listId);
            }
        }

        const existing = await Subscriber.findOne({ email });

        if (existing) {
            // If already exists, update name, IP, and append list
            const updatedLists = new Set([...existing.lists.map(l => l.toString()), ...listsToAssign]);
            
            await Subscriber.findByIdAndUpdate(existing._id, {
                name: name || existing.name,
                ipAddress: ipAddress,
                status: 'active',
                lists: Array.from(updatedLists)
            });

            // Adjust counts if a NEW list was added
            if (listId && !existing.lists.some(l => l.toString() === listId)) {
                await MailingList.findByIdAndUpdate(listId, { $inc: { subscriberCount: 1 } });
            }

            return NextResponse.json({ success: true, message: 'Successfully updated subscription' });
        }

        // Create new subscriber
        const id = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        await Subscriber.create({
            id,
            email,
            name,
            ipAddress,
            status: 'active',
            lists: listsToAssign
        });

        if (listsToAssign.length > 0) {
            await MailingList.updateMany({ _id: { $in: listsToAssign } }, { $inc: { subscriberCount: 1 } });
        }

        // Return a successful redirect if it came from an HTML form (optional, could just return json)
        if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
            // Check if there's a referrer to redirect back to, or return simple HTML success
            return new NextResponse(`
                <html>
                    <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#f9fafb;">
                        <div style="background:white;padding:40px;border-radius:10px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);text-align:center;">
                            <h1 style="color:#10b981;margin-bottom:10px;">Success!</h1>
                            <p style="color:#4b5563;">You have been successfully subscribed.</p>
                            <a href="javascript:history.back()" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#4f46e5;color:white;text-decoration:none;border-radius:5px;">Go Back</a>
                        </div>
                    </body>
                </html>
            `, { headers: { 'Content-Type': 'text/html' } });
        }

        return NextResponse.json({ success: true, message: 'Successfully subscribed' });
    } catch (error: any) {
        console.error('Subscription API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
