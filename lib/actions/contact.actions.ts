
'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '../db/connect';
import Contact from '../db/models/Contact';
import { getOrCreateBusiness } from './business.actions';

export async function getContacts(search = "") {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        const query: any = { businessId };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        const contacts = await Contact.find(query).sort({ updatedAt: -1 });

        return { success: true, data: JSON.parse(JSON.stringify(contacts)) };
    } catch (error) {
        console.error('[GET_CONTACTS]', error);
        return { success: false, error: 'Failed to fetch contacts' };
    }
}

export async function createContact(data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();

        // Check for duplicate email
        const existing = await Contact.findOne({ businessId, email: data.email });
        if (existing) {
            return { success: false, error: 'Contact with this email already exists' };
        }

        const contact = await Contact.create({
            ...data,
            businessId,
        });

        revalidatePath('/calendar/contacts');
        return { success: true, data: JSON.parse(JSON.stringify(contact)) };
    } catch (error) {
        console.error('[CREATE_CONTACT]', error);
        return { success: false, error: 'Failed to create contact' };
    }
}

export async function updateContact(id: string, data: any) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        const contact = await Contact.findOneAndUpdate(
            { _id: id, businessId },
            data,
            { new: true }
        );

        if (!contact) return { success: false, error: 'Contact not found' };

        revalidatePath('/calendar/contacts');
        return { success: true, data: JSON.parse(JSON.stringify(contact)) };
    } catch (error) {
        console.error('[UPDATE_CONTACT]', error);
        return { success: false, error: 'Failed to update contact' };
    }
}

export async function deleteContact(id: string) {
    try {
        const businessResult = await getOrCreateBusiness();
        if (!businessResult.success || !businessResult.data) {
            return { success: false, error: 'Business not found' };
        }
        const businessId = businessResult.data._id;

        await connectToDatabase();
        await Contact.findOneAndDelete({ _id: id, businessId });

        revalidatePath('/calendar/contacts');
        return { success: true };
    } catch (error) {
        console.error('[DELETE_CONTACT]', error);
        return { success: false, error: 'Failed to delete contact' };
    }
}
