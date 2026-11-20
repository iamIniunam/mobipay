import type { TransactionStatus } from "./types";

export const INK = "#171717";
export const MUTED = "#6B7280";
export const RULE = "#E5E7EB";

type StatusStyle = {
    label: string;
    ink: string;          // chip and callout text
    tint: string;         // chip and callout background
    mutedAmount: boolean; // gray out the hero amount
};

export const STATUS_STYLE: Record<TransactionStatus, StatusStyle> = {
    successful: { label: "Successful", ink: "#166534", tint: "#DCFCE7", mutedAmount: false },
    pending: { label: "Pending", ink: "#92400E", tint: "#FEF3C7", mutedAmount: false },
    failed: { label: "Failed", ink: "#991B1B", tint: "#FEE2E2", mutedAmount: true },
    reversed: { label: "Reversed", ink: "#1E40AF", tint: "#DBEAFE", mutedAmount: true },
};

// Chips can't shrink-wrap here, so estimate a width from the label length.
export const chipWidth = (label: string) => label.length * 8 + 28;