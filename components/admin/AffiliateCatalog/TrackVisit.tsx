"use client";

import { useEffect, useRef } from "react";
import { trackCatalogVisitByUrl } from "@/lib/actions/personal-affiliate.actions";

export default function TrackVisit() {
    const tracked = useRef(false);

    useEffect(() => {
        if (tracked.current) return;
        tracked.current = true;

        const url = window.location.href;
        // Fire and forget tracking call
        trackCatalogVisitByUrl(url).catch(() => {});
    }, []);

    return null; // Invisible "pixel"
}
