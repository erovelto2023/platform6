"use client";
// Force rebuild

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CommunitySidebarProps {
    user: any;
}

export function CommunitySidebar({ user }: CommunitySidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="space-y-6">
            {/* Navigation Menu */}
            <Card>
                <CardContent className="p-4 space-y-1">
                    <Link href="/community">
                        <div className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer ${isActive('/community') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}>
                            News Feed
                        </div>
                    </Link>
                    <Link href="/community/friends">
                        <div className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer ${isActive('/community/friends') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}>
                            Friends
                        </div>
                    </Link>
                    <Link href="/community/members">
                        <div className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer ${isActive('/community/members') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}>
                            Find Members
                        </div>
                    </Link>
                    <Link href="/community/events">
                        <div className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer ${isActive('/community/events') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}>
                            Events
                        </div>
                    </Link>
                    <Link href="/community/groups">
                        <div className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer ${isActive('/community/groups') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}>
                            Groups
                        </div>
                    </Link>
                    {['Saved'].map((item) => (
                        <div key={item} className="px-4 py-2 text-sm font-medium rounded-lg cursor-pointer text-slate-600 hover:bg-slate-100">
                            {item}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* About Widget */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <div>
                        <span className="font-semibold text-slate-900">Joined: </span>
                        <span className="text-slate-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold text-slate-900">Email: </span>
                        <span className="text-slate-500">{user.email}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Photos Preview */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Photos</CardTitle>
                    <span className="text-xs text-indigo-600 cursor-pointer hover:underline">See All</span>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-square bg-slate-100 rounded-md overflow-hidden"></div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
