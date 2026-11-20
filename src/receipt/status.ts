import { formatMoney } from "./format";
import type { Transaction, TransactionStatus } from "./types";

export type StatusCopy = {
    heading: string;
    color: string;
    amountLabel: string;
    showCharges: boolean; // show Fee and Total rows?
    summary: (t: Transaction) => string;
    nextStep: string;
};

const amountOf = (t: Transaction) => formatMoney(t.amountMinor, t.currency);
export const STATUS_COPY: Record<TransactionStatus, StatusCopy> = {
    successful: {
        heading: "Payment successful",
        color: "#15803d",
        amountLabel: "Amount sent",
        showCharges: true,
        summary: (t) => `You sent ${amountOf(t)} to ${t.recipientName}.`,
        nextStep: "No further action is needed. Keep this receipt for your records.",
    },
    pending: {
        heading: "Payment pending",
        color: "#b45309",
        amountLabel: "Amount",
        showCharges: false,
        summary: (t) =>
            `Your payment of ${amountOf(t)} to ${t.recipientName} is still being processed.`,
        nextStep:
            "Please don't send it again. You'll get another message when it completes.",
    },
    failed: {
        heading: "Payment failed",
        color: "#b91c1c",
        amountLabel: "Amount attempted",
        showCharges: false,
        summary: (t) => `We couldn't send ${amountOf(t)} to ${t.recipientName}.`,
        nextStep: "No money was taken from your wallet. You can try again.",
    },
    reversed: {
        heading: "Payment reversed",
        color: "#1d4ed8",
        amountLabel: "Amount returned",
        showCharges: false,
        summary: (t) =>
            `The ${amountOf(t)} you sent to ${t.recipientName} has been reversed.`,
        nextStep:
            "The money has been returned to your wallet. Quote the reference below if you contact support.",
    },
};