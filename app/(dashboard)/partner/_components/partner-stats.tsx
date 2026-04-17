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
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            label: "Total Earnings",
            value: formatPrice(totalEarnings),
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            label: "Pending (30 days)",
            value: formatPrice(pendingEarnings),
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-100",
        },
        {
            label: "Available Balance",
            value: formatPrice(availableBalance),
            icon: Wallet,
            color: "text-purple-600",
            bg: "bg-purple-100",
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
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};
