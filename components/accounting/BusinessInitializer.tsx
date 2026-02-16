"use client";

import { useEffect } from "react";
import { switchBusiness } from "@/lib/actions/business.actions";

interface BusinessInitializerProps {
    businessId: string;
    activeBusinessId?: string;
}

export function BusinessInitializer({ businessId, activeBusinessId }: BusinessInitializerProps) {
    useEffect(() => {
        if (!activeBusinessId && businessId) {
            switchBusiness(businessId);
        }
    }, [businessId, activeBusinessId]);

    return null;
}
