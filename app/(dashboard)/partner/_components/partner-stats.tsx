"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Clock, Wallet } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { motion } from "framer-motion";

interface PartnerStatsProps {
    totalSignups: number;
    totalEarnings: number;
    pendingEarnings: number;
    availableBalance: number;
}

export const PartnerStats = ({
    totalSignups,
    totalEarnings,
    pendingEarnings,
    availableBalance
}: PartnerStatsProps) => {
    const stats = [
        {
            label: "Total Signups",
            value: totalSignups,
            icon: Users,
            color: "text-indigo-400",
            bg: "bg-indigo-950/80 border border-indigo-800/80",
        },
        {
            label: "Total Earnings",
            value: formatPrice(totalEarnings),
            icon: DollarSign,
            color: "text-emerald-400",
            bg: "bg-emerald-950/80 border border-emerald-800/80",
        },
        {
            label: "Pending (30 days)",
            value: formatPrice(pendingEarnings),
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-950/80 border border-amber-800/80",
        },
        {
            label: "Available Balance",
            value: formatPrice(availableBalance),
            icon: Wallet,
            color: "text-purple-400",
            bg: "bg-purple-950/80 border border-purple-800/80",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card className="hover:border-orange-500/50 transition-all bg-slate-900 border border-slate-800 shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                                {stat.label}
                            </CardTitle>
                            <div className={`${stat.bg} p-2 rounded-xl`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black font-mono text-slate-100">{stat.value}</div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};
