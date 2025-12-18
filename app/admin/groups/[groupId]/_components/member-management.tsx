"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Shield, ShieldAlert, UserX } from "lucide-react";
import { updateGroupMemberRole, removeGroupMember } from "@/lib/actions/group.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MemberManagementProps {
    groupId: string;
    members: any[];
}

export function MemberManagement({ groupId, members }: MemberManagementProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChange = async (userId: string, newRole: string) => {
        setIsLoading(true);
        try {
            await updateGroupMemberRole(groupId, userId, newRole);
            toast.success(`Role updated to ${newRole}`);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update role");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm("Are you sure you want to remove this member?")) return;

        setIsLoading(true);
        try {
            await removeGroupMember(groupId, userId);
            toast.success("Member removed");
            router.refresh();
        } catch (error) {
            toast.error("Failed to remove member");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border border-slate-200">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-medium text-sm text-slate-500 flex justify-between">
                    <span>Member</span>
                    <span>Role & Actions</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {members.map((member) => (
                        <div key={member._id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-slate-100">
                                    <AvatarImage src={member.user?.avatar} />
                                    <AvatarFallback>{member.user?.firstName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium text-slate-900">
                                        {member.user?.firstName} {member.user?.lastName}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Joined {new Date(member.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Badge
                                    variant={member.role === 'Admin' ? 'default' : member.role === 'Moderator' ? 'secondary' : 'outline'}
                                    className={member.role === 'Admin' ? 'bg-indigo-600' : ''}
                                >
                                    {member.role}
                                </Badge>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" disabled={isLoading}>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleRoleChange(member.user._id, "Admin")}>
                                            <ShieldAlert className="h-4 w-4 mr-2" />
                                            Make Admin
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleChange(member.user._id, "Moderator")}>
                                            <Shield className="h-4 w-4 mr-2" />
                                            Make Moderator
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleChange(member.user._id, "Member")}>
                                            <Shield className="h-4 w-4 mr-2 opacity-50" />
                                            Demote to Member
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600"
                                            onClick={() => handleRemoveMember(member.user._id)}
                                        >
                                            <UserX className="h-4 w-4 mr-2" />
                                            Remove Member
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
