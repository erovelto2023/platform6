"use client";

import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const NoteItem = ({ note }: { note: any }) => {
    return (
        <div
            className={`p-4 rounded-lg border ${note.isStaff ? "bg-blue-50 border-blue-100" : "bg-white"
                }`}
        >
            <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                    {/* We might need to fetch user details for avatar if not stored in note or we rely on isStaff */}
                    <AvatarFallback>
                        {note.isStaff ? "S" : "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                                {note.isStaff ? "Staff Response" : "User Response"}
                            </span>
                            {note.isStaff && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                    Staff
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {format(new Date(note.createdAt), "MMM d, h:mm a")}
                        </span>
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                        {note.text}
                    </p>
                </div>
            </div>
        </div>
    );
}
