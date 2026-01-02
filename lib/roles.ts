import { Roles } from '@/types/globals';
import { auth } from '@clerk/nextjs/server';

export const checkRole = async (role: Roles) => {
    const { sessionClaims } = await auth();
    return (sessionClaims?.metadata as { role?: Roles })?.role === role;
};

export const getUserRole = async (): Promise<Roles> => {
    const { sessionClaims } = await auth();
    return ((sessionClaims?.metadata as { role?: Roles })?.role as Roles) || 'student';
};
