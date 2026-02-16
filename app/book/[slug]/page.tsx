
import { getAvailableSlots, createBooking } from "@/lib/actions/booking.actions";
import { getProduct } from "@/lib/actions/product.actions";
import { format, addDays, startOfToday } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BookingClient } from "@/components/accounting/BookingClient";

interface BookingPageProps {
    params: {
        slug: string; // Product ID
    };
    searchParams: {
        date?: string;
    };
}

export default async function PublicBookingPage(props: BookingPageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const productId = params.slug;
    const dateParam = searchParams.date || format(startOfToday(), 'yyyy-MM-dd');

    const { data: product, error } = await getProduct(productId);

    if (error || !product || !product.isBookable) {
        return <div className="p-8 text-center">Service not found or not bookable.</div>;
    }

    const { data: slots } = await getAvailableSlots(new Date(dateParam), productId);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Left Sidebar: Service Details */}
                <div className="w-full md:w-1/3 bg-slate-100 p-8 border-r border-slate-200">
                    <div className="sticky top-8">
                        {/* Avatar/Logo placeholder */}
                        <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6">
                            K
                        </div>
                        <h2 className="text-slate-500 font-medium text-sm uppercase tracking-wide mb-1">KBAcademy</h2>
                        <h1 className="text-2xl font-bold text-slate-900 mb-4">{product.name}</h1>

                        <div className="space-y-3 text-slate-600">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                <span>{product.duration} min</span>
                            </div>
                            {product.price > 0 && (
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
                                    <span>${product.price}</span>
                                </div>
                            )}
                        </div>

                        <p className="mt-6 text-slate-500 text-sm leading-relaxed">
                            {product.description || "Book a session with us."}
                        </p>
                    </div>
                </div>

                {/* Right Content: Calendar & Slots */}
                <div className="w-full md:w-2/3 p-8">
                    <BookingClient
                        productId={productId}
                        initialDate={dateParam}
                        slots={slots || []}
                    />
                </div>
            </div>
        </div>
    );
}
