"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEvents } from "@/lib/actions/event.actions";
import Link from "next/link";

interface EventsTabProps {
    currentUser: any;
}

export function EventsTab({ currentUser }: EventsTabProps) {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Assuming getEvents returns a list of events
                const res = await getEvents();
                // Ensure res is an array (it might be { events: [] } or just [])
                const eventsList = Array.isArray(res) ? res : (res.events || []);
                setEvents(eventsList);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-xl font-semibold">Upcoming Events</h2>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Discover and join community events
                    </p>
                </CardHeader>
            </Card>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            ) : events.length > 0 ? (
                <div className="grid gap-4">
                    {events.map((event) => (
                        <Card key={event._id} className="hover:shadow-md transition">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Date Badge */}
                                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-700">
                                        <span className="text-xs font-semibold uppercase">{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-2xl font-bold">{new Date(event.startDate).getDate()}</span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {event.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Link href={`/community/events/${event._id}`}>
                                            <Button>View Details</Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-slate-500">
                    No upcoming events found.
                </div>
            )}
        </div>
    );
}
