"use client";

import { useEffect } from "react";

export default function PrintTrigger() {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            zIndex: 9999,
            display: "flex",
            gap: "0.75rem",
        }} className="no-print">
            <button
                onClick={() => window.print()}
                style={{
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.6rem 1.25rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
            >
                🖨️ Print / Save PDF
            </button>
            <button
                onClick={() => window.close()}
                style={{
                    background: "white",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "0.6rem 1.25rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
            >
                ✕ Close
            </button>
        </div>
    );
}
