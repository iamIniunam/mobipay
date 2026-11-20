import type { Transaction, TransactionStatus } from "./types";

export type StatusCopy = {
    heading: string; // not drawn in the body now; keep for email subject / page title
    showCharges: boolean; // show Fee and Total rows?
    summary: (t: Transaction) => string;
    nextStep: string;
};

export const STATUS_COPY: Record<TransactionStatus, StatusCopy> = {
    successful: {
        heading: "Payment successful",
        showCharges: true,
        summary: (t) => `Sent to ${t.recipientName}.`,
        nextStep: "No further action is needed. Keep this receipt for your records.",
    },
    pending: {
        heading: "Payment pending",
        showCharges: false,
        summary: (t) => `Still being sent to ${t.recipientName}.`,
        nextStep: "Please don't send it again. You'll get another message when it completes.",
    },
    failed: {
        heading: "Payment failed",
        showCharges: false,
        summary: (t) => `Not sent to ${t.recipientName}.`,
        nextStep: "No money was taken from your wallet. You can try again.",
    },
    reversed: {
        heading: "Payment reversed",
        showCharges: false,
        summary: (t) => `Your payment to ${t.recipientName} was reversed.`,
        nextStep:
            "The money has been returned to your wallet. Quote the reference below if you contact support.",
    },
};