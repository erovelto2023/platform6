"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
// @ts-ignore
import { io } from "socket.io-client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";
import { Bell } from "lucide-react";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
        const socketInstance = new (io as any)(siteUrl, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        socketInstance.on("notification:new", (data: any) => {
            // We need to compare MongoDB _id, which usually comes from current user details
            // For now, if we don't have MongoDB _id yet, we just show it if clerkId matches or if it's targeted
            // Actually, we should probably fetch the DB user once on mount

            // Temporary check: if we have a way to identify the user
            // We'll use a simpler approach: the sender already restricted emission to the recipientId
            // but for safety in broadcast, we check it here
            const storage = window.localStorage.getItem('kb-user-id'); // Assuming we store it

            if (storage && data.recipientId === storage) {
                toast(`New ${data.type}`, {
                    description: `${data.senderName} ${data.content}`,
                    icon: <Bell className="h-4 w-4" />,
                    action: data.link ? {
                        label: "View",
                        onClick: () => window.location.href = data.link
                    } : undefined
                });
            }
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
