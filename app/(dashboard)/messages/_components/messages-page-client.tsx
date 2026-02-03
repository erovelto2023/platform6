"use client";

import { useState } from "react";
import { ConversationList } from "./conversation-list";
import { ChatWindow } from "./chat-window";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface MessagesPageClientProps {
    currentUser: any;
    initialConversations: any[];
    initialSelectedId?: string;
}

export function MessagesPageClient({ currentUser, initialConversations, initialSelectedId }: MessagesPageClientProps) {
    const [conversations, setConversations] = useState(initialConversations);
    const [selectedConversation, setSelectedConversation] = useState<any>(
        initialSelectedId
            ? conversations.find(c => c._id === initialSelectedId) || null
            : null
    );

    return (
        <div className="h-full flex">
            {/* Conversations List */}
            <div className="w-full md:w-80 lg:w-96 border-r bg-white flex-shrink-0">
                <ConversationList
                    conversations={conversations}
                    currentUser={currentUser}
                    selectedConversation={selectedConversation}
                    onSelectConversation={setSelectedConversation}
                />
            </div>

            {/* Chat Window */}
            <div className="flex-1 hidden md:flex flex-col">
                {selectedConversation ? (
                    <ChatWindow
                        conversation={selectedConversation}
                        currentUser={currentUser}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-slate-50">
                        <div className="text-center">
                            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">
                                Select a conversation
                            </h3>
                            <p className="text-sm text-slate-500">
                                Choose a conversation from the list to start messaging
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
