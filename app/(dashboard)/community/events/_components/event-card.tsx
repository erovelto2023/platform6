"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { joinEvent, leaveEvent, deleteEvent } from "@/lib/actions/event.actions";
import { toast } from "sonner";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventCardProps {
    event: any;
    currentUserId: string;
    isAdmin: boolean;
}

export function EventCard({ event, currentUserId, isAdmin }: EventCardProps) {
    const isAttending = event.attendees.some((a: any) => a._id === currentUserId);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleAttendance = async () => {
        setIsLoading(true);
        try {
            if (isAttending) {
                await leaveEvent(event._id, currentUserId);
                toast.success("Left event");
            } else {
                await joinEvent(event._id, currentUserId);
                toast.success("Joined event!");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent(event._id);
            toast.success("Event deleted");
        } catch (error) {
            toast.error("Failed to delete event");
        }
    };

    return (
        <Card className="overflow-hidden flex flex-col h-full">
            {event.coverImage && (
                <div className="h-48 w-full bg-slate-100 relative">
                    <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                </div>
            )}
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg">{event.title}</h3>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(event.startDate), "PPP p")}
                        </div>
                        {event.location && (
                            <div className="flex items-center text-sm text-slate-500 mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {event.location}
                            </div>
                        )}
                    </div>
                    {isAdmin && (
                        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-slate-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-1">
                <p className="text-sm text-slate-600 line-clamp-3 mb-4">{event.description}</p>

                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {event.attendees.slice(0, 5).map((attendee: any) => (
                            <Avatar key={attendee._id} className="h-6 w-6 border-2 border-white">
                                <AvatarImage src={attendee.avatar || attendee.imageUrl} />
                                <AvatarFallback>{attendee.firstName?.[0]}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    {event.attendees.length > 0 && (
                        <span className="text-xs text-slate-500">
                            {event.attendees.length} attending
                        </span>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 mt-auto">
                <Button
                    className={`w-full ${isAttending ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-indigo-600 hover:bg-indigo-700"}`}
                    onClick={handleToggleAttendance}
                    disabled={isLoading}
                >
                    {isAttending ? "Leave Event" : "Join Event"}
                </Button>
            </CardFooter>
        </Card>
    );
}
