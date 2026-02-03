"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EventsTabProps {
    currentUser: any;
}

export function EventsTab({ currentUser }: EventsTabProps) {
    const events = [
        {
            id: 1,
            title: "Marketing Masterclass Webinar",
            date: "Feb 15, 2026",
            time: "2:00 PM EST",
            location: "Online",
            attendees: 45,
            type: "Webinar",
            description: "Learn advanced marketing strategies from industry experts."
        },
        {
            id: 2,
            title: "Networking Mixer",
            date: "Feb 20, 2026",
            time: "6:00 PM EST",
            location: "Virtual Room",
            attendees: 28,
            type: "Networking",
            description: "Connect with fellow entrepreneurs and business owners."
        },
        {
            id: 3,
            title: "Content Creation Workshop",
            date: "Feb 25, 2026",
            time: "1:00 PM EST",
            location: "Online",
            attendees: 62,
            type: "Workshop",
            description: "Hands-on workshop for creating engaging content."
        },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-xl font-semibold">Upcoming Events</h2>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Join community events and workshops
                    </p>
                </CardHeader>
            </Card>

            <div className="grid gap-4">
                {events.map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg">{event.title}</h3>
                                        <Badge variant="secondary">{event.type}</Badge>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-4">{event.description}</p>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Calendar className="h-4 w-4" />
                                            {event.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Clock className="h-4 w-4" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <MapPin className="h-4 w-4" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Users className="h-4 w-4" />
                                            {event.attendees} attending
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button className="flex-1">Register</Button>
                                <Button variant="outline">Learn More</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
