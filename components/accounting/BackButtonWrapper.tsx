"use client";

import { BackButton } from "@/components/accounting/BackButton";

export function BackButtonWrapper({ href }: { href?: string }) {
    return <BackButton href={href} />;
}
