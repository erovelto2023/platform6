"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star, X } from "lucide-react";
import { addDirectoryProductReview } from "@/lib/actions/directory-product.actions";

export default function ReviewForm({ productId }: { productId: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        const user = formData.get("user") as string;
        const comment = formData.get("comment") as string;
        
        if (!user || !comment) {
            setMessage("Please fill out all fields.");
            return;
        }

        setMessage("");
        startTransition(async () => {
            const result = await addDirectoryProductReview(productId, { user, rating, comment });
            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage("Success! Your review has been submitted and is pending approval.");
                setTimeout(() => setIsOpen(false), 3000);
            }
        });
    }

    if (!isOpen) {
        return (
            <Button 
                onClick={() => setIsOpen(true)}
                variant="outline" 
                className="border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:bg-zinc-900 rounded-xl px-8 h-12 flex items-center gap-2"
            >
                <MessageSquare size={14} /> Submit Your Review
            </Button>
        );
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md relative z-10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-black uppercase tracking-widest text-sm">Write a Review</h3>
                <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>
            
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star 
                                    size={24} 
                                    className={`${(hoveredRating || rating) >= star ? "text-amber-400 fill-amber-400" : "text-zinc-700"} transition-colors`} 
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Your Name *</label>
                    <input 
                        name="user" 
                        required 
                        maxLength={50}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="e.g. Alex D."
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Your Review *</label>
                    <textarea 
                        name="comment" 
                        required 
                        rows={4}
                        maxLength={500}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        placeholder="What do you think of this tool?"
                    />
                </div>

                {message && (
                    <div className={`p-3 rounded-xl text-xs font-bold leading-relaxed ${message.startsWith('Success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'}`}>
                        {message}
                    </div>
                )}

                <Button 
                    type="submit" 
                    disabled={isPending || message.startsWith('Success')}
                    className="w-full bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest h-12 rounded-xl"
                >
                    {isPending ? "Submitting..." : "Publish Review"}
                </Button>
            </form>
        </div>
    );
}
