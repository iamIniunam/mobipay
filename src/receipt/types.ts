export type Currency = "GHS" | "NGN" | "USD";

export type TransactionStatus = | "successful" | "pending" | "failed" | "reversed";

export type Transaction = {
    id: string;
    status: TransactionStatus;
    amountMinor: number; // smallest unit: 12550 = ₵125.50
    feeMinor: number;
    currency: Currency;
    senderName: string;
    recipientName: string;
    recipientNumber: string;
    network: string;
    createdAt: string; // ISO date string
    note?: string; // optional, like String? in Dart
    reason?: string; // why it failed or was reversed
}

export type Brand = {
    name: string;
    accentColor: string;    // hex, e.g. "#0B6E4F"
    supportContact: string; // e.g. "help@mobipay.app"
    footerLine: string;
}