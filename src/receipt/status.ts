import type { Transaction, TransactionStatus } from "./types";

type StatusCopy = {
    heading: string;
    amountLabel: string;
    summary: (t: Transaction) => string;
    nextStep: (t: Transaction) => string;
};

export const STATUS_COPY: Record<TransactionStatus, StatusCopy> = {
    successful: {
        heading: "Payment successful",
        amountLabel: "Amount sent",
        summary: (t) => `Sent to ${t.recipientName}`,
        nextStep: () => "Payment complete. Keep this receipt for your records.",
    },
    pending: {
        heading: "Payment pending",
        amountLabel: "Amount requested",
        summary: (t) => `Payment to ${t.recipientName} is processing`,
        nextStep: () => "Completion is not yet confirmed. Check the payment status before sending again.",
    },
    failed: {
        heading: "Payment failed",
        amountLabel: "Amount attempted",
        summary: (t) => `Not sent to ${t.recipientName}`,
        nextStep: (t) => t.debitedMinor === 0
            ? "No money was debited. Check the payment details before trying again."
            : "Check your wallet before trying again. Contact support with this reference if you see a debit.",
    },
    reversed: {
        heading: "Payment reversed",
        amountLabel: "Original payment amount",
        summary: (t) => `Payment to ${t.recipientName} was reversed`,
        nextStep: (t) => t.refundedAmountMinor !== undefined
            ? "The confirmed refund is listed below. Contact support with this reference if you need help."
            : "Check your wallet for the refund. Contact support with this reference to confirm the amount returned.",
    },
};

export function receiptTimestamp(t: Transaction) {
    if (t.status === "reversed" && t.reversedAt) return { label: "Reversed", value: t.reversedAt };
    if (t.status === "successful" && t.completedAt) return { label: "Completed", value: t.completedAt };
    return { label: "Initiated", value: t.createdAt };
}
