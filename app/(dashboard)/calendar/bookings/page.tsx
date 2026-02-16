
import { BookingsList } from "@/components/accounting/BookingsList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BookingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Bookings History</h2>
                    <p className="text-sm text-slate-500">View and manage all your past and upcoming appointments.</p>
                </div>
                {/* 
                <Link href="/calendar/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Booking
                    </Button>
                </Link>
                */}
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="all">All Bookings</TabsTrigger>
                </TabsList>
                <div className="mt-4">
                    <BookingsList />
                </div>
            </Tabs>
        </div>
    );
}
