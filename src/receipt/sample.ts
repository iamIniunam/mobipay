import type { Transaction, TransactionStatus, Currency } from "./types";

export const sampleTransaction: Transaction = {
    id: "MP-20261120-0042",
    status: "successful",
    amountMinor: 12550,
    feeMinor: 100,
    currency: "GHS",
    senderName: "Ama Mensah",
    recipientName: "Kwame Boateng",
    recipientNumber: "+233 24 123 4567",
    network: "MTN MoMo",
    createdAt: "2026-11-20T14:32:00Z",
    note: "Lunch money",
};

export const sampleTransactions: Record<TransactionStatus, Transaction> = {
    successful: sampleTransaction,
    pending: { ...sampleTransaction, id: "MP-20261120-0043", status: "pending" },
    failed: {
        ...sampleTransaction,
        id: "MP-20261120-0044",
        status: "failed",
        reason: "Insufficient wallet balance",
    },
    reversed: {
        ...sampleTransaction,
        id: "MP-20261120-0045",
        status: "reversed",
        reason: "Recipient number could not be credited",
    },
};

const CURRENCY_PATCH: Record<Currency, Partial<Transaction>> = {
    GHS: {},
    NGN: {
        currency: "NGN",
        amountMinor: 2_500_000, // ₦25,000.00
        feeMinor: 5_000,        // ₦50.00
        recipientName: "Chidi Okafor",
        recipientNumber: "+234 803 123 4567",
        senderName: "Ngozi Eze",
        network: "OPay",
    },
    USD: {
        currency: "USD",
        amountMinor: 4_200, // $42.00
        feeMinor: 50,       // $0.50
        recipientName: "Grace Banda",
        recipientNumber: "+260 97 123 4567",
        senderName: "Daniel Mensah",
        network: "Airtel Money",
    },
};

export const inCurrency = (t: Transaction, c: Currency): Transaction => ({
    ...t,
    ...CURRENCY_PATCH[c],
});