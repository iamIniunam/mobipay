import type { Currency } from "./types";

const SYMBOLS: Record<Currency, string> = {
    GHS: "₵",
    NGN: "₦",
    USD: "$",
};

export function formatMoney(amountMinor: number, currency: Currency): string {
    const major = amountMinor / 100;
    const digits = major.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${SYMBOLS[currency]}${digits}`;
}

export function formatDate(iso: string): string {
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
    }).format(new Date(iso));
}