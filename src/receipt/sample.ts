import type { Transaction, TransactionStatus } from "./types";

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