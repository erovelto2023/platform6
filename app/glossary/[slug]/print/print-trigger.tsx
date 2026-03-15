"use client";

import { useEffect } from "react";

// Auto-opens the print dialog when the print page loads
export default function PrintTrigger() {
    useEffect(() => {
        // Small delay to allow the page to fully render before printing
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            zIndex: 9999,
            display: "flex",
            gap: "0.5rem",
        }} className="print-hide">
            <button
                onClick={() => window.print()}
                style={{
                    background: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                }}
            >
                🖨️ Print / Save PDF
            </button>
            <button
                onClick={() => window.close()}
                style={{
                    background: "#f1f5f9",
                    color: "#334155",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                }}
            >
                ✕ Close
            </button>
        </div>
    );
}
