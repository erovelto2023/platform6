'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { formatCurrency } from "@/lib/utils";

interface DownloadInvoiceButtonProps {
    invoice: any;
}

export function DownloadInvoiceButton({ invoice }: DownloadInvoiceButtonProps) {
    const generatePDF = () => {
        const doc = new jsPDF();

        // Add logo or header
        doc.setFontSize(20);
        doc.text("INVOICE", 105, 20, { align: "center" });

        // Invoice Details
        doc.setFontSize(10);
        doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 40);
        doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 20, 45);
        doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 50);

        // Bill To
        doc.text("Bill To:", 20, 65);
        doc.setFontSize(12);
        doc.text(invoice.clientId?.name || "Unknown Client", 20, 70);
        doc.setFontSize(10);
        if (invoice.clientId?.email) doc.text(invoice.clientId.email, 20, 75);
        if (invoice.clientId?.address?.city) doc.text(`${invoice.clientId.address.city}, ${invoice.clientId.address.state || ''}`, 20, 80);

        // Table Header
        let yPos = 100;
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.setFont("helvetica", "bold");
        doc.text("Description", 25, yPos);
        doc.text("Qty", 110, yPos);
        doc.text("Rate", 130, yPos);
        doc.text("Amount", 160, yPos);

        // Table Rows
        doc.setFont("helvetica", "normal");
        yPos += 10;
        invoice.items.forEach((item: any) => {
            doc.text(item.description, 25, yPos);
            doc.text(item.quantity.toString(), 110, yPos);
            doc.text(formatCurrency(item.rate), 130, yPos);
            doc.text(formatCurrency(item.amount), 160, yPos);
            yPos += 10;
        });

        // Totals
        yPos += 10;
        doc.line(20, yPos, 190, yPos);
        yPos += 10;

        doc.text("Subtotal:", 130, yPos);
        doc.text(formatCurrency(invoice.subtotal), 160, yPos);
        yPos += 7;

        if (invoice.tax > 0) {
            doc.text("Tax:", 130, yPos);
            doc.text(formatCurrency(invoice.tax), 160, yPos);
            yPos += 7;
        }

        doc.setFont("helvetica", "bold");
        doc.text("Total:", 130, yPos);
        doc.text(formatCurrency(invoice.total), 160, yPos);

        // Footer
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.text("Thank you for your business!", 105, 280, { align: "center" });

        doc.save(`${invoice.invoiceNumber}.pdf`);
    };

    return (
        <Button onClick={generatePDF} variant="outline" className="flex gap-2">
            <Download className="h-4 w-4" />
            Download PDF
        </Button>
    );
}
