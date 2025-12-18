"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { searchUsers } from "@/lib/actions/community.actions";
import { UserCard } from "../_components/user-card";

interface MembersClientProps {
    currentUserId: string;
    initialUsers: any[];
}

export function MembersClient({ currentUserId, initialUsers }: MembersClientProps) {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState(initialUsers);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const results = await searchUsers(query, currentUserId);
                setUsers(results);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, currentUserId]);

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search members..."
                    className="pl-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <UserCard key={user._id} user={user} currentUserId={currentUserId} />
                ))}
                {users.length === 0 && !isLoading && (
                    <div className="col-span-full text-center py-10 text-slate-500">
                        No members found.
                    </div>
                )}
                {isLoading && (
                    <div className="col-span-full text-center py-10 text-slate-500">
                        Searching...
                    </div>
                )}
            </div>
        </div>
    );
}
