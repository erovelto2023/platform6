import { Roles } from '@/types/globals';
import { auth } from '@clerk/nextjs/server';

export const checkRole = async (role: Roles) => {
    const { sessionClaims } = await auth();
    console.log('[checkRole] Full sessionClaims:', JSON.stringify(sessionClaims, null, 2));

    // Clerk stores public metadata in sessionClaims.public_metadata or sessionClaims.metadata
    const publicMetadata = (sessionClaims?.public_metadata || sessionClaims?.metadata) as { role?: Roles };
    const userRole = publicMetadata?.role;

    console.log('[checkRole] public_metadata:', publicMetadata);
    console.log('[checkRole] Checking if', userRole, '===', role, ':', userRole === role);
    return userRole === role;
};

export const getUserRole = async (): Promise<Roles> => {
    const { sessionClaims } = await auth();

    // Clerk stores public metadata in sessionClaims.public_metadata or sessionClaims.metadata
    const publicMetadata = (sessionClaims?.public_metadata || sessionClaims?.metadata) as { role?: Roles };
    const userRole = (publicMetadata?.role as Roles) || 'student';

    console.log('[getUserRole] Returning role:', userRole);
    return userRole;
};
