import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { render } from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { receiptGroups } from "../src/receipt/body";
import { mobipayBrand } from "../src/receipt/brands";
import { formatDate } from "../src/receipt/format";
import { renderReceiptImage } from "../src/receipt/image";
import { emailReceipt, pageReceipt, pdfReceipt } from "../src/receipt/outputs";
import { inCurrency, sampleTransactions } from "../src/receipt/sample";
import { receiptTimestamp, STATUS_COPY } from "../src/receipt/status";
import type { Transaction } from "../src/receipt/types";

const lines = (t: Transaction) => receiptGroups(t).flatMap((group) => group.lines);
const fonts = [
    ["Inter_18pt-Regular.ttf", 400],
    ["Inter_18pt-SemiBold.ttf", 600],
    ["Inter_18pt-Bold.ttf", 700],
].map(([file, weight]) => ({ family: "Inter", src: readFileSync(`fonts/${file}`), weight: Number(weight) }));

test("a failed status does not imply a zero debit", () => {
    const failed = { ...sampleTransactions.failed, debitedMinor: undefined };
    assert.doesNotMatch(STATUS_COPY.failed.nextStep(failed), /No money was debited/);
    assert.match(STATUS_COPY.failed.nextStep({ ...failed, debitedMinor: 0 }), /No money was debited/);
    assert.doesNotMatch(STATUS_COPY.failed.nextStep({ ...failed, debitedMinor: 100 }), /No money was debited/);
    assert.equal(lines(failed).find((line) => line.label === "Total debited"), undefined);
});

test("refund totals require confirmed principal and fee; zero is a confirmed value", () => {
    const reversed = { ...sampleTransactions.reversed, refundedFeeMinor: undefined };
    assert.equal(lines(reversed).find((line) => line.label === "Total refunded"), undefined);
    assert.equal(lines(reversed).find((line) => line.label === "Fee refunded")?.value, "Not confirmed");
    const partial = { ...reversed, refundedAmountMinor: 10000, refundedFeeMinor: 0 };
    assert.equal(lines(partial).find((line) => line.label === "Total refunded")?.value, "₵100.00");
    const unknown = { ...reversed, refundedAmountMinor: undefined };
    assert.doesNotMatch(STATUS_COPY.reversed.nextStep(unknown), /confirmed refund is listed/);
});

test("completion and reversal times are distinct from initiation and explicitly UTC", () => {
    assert.equal(receiptTimestamp(sampleTransactions.successful).value, sampleTransactions.successful.completedAt);
    assert.equal(receiptTimestamp(sampleTransactions.reversed).value, sampleTransactions.reversed.reversedAt);
    assert.equal(receiptTimestamp(sampleTransactions.pending).label, "Initiated");
    assert.equal(receiptTimestamp({ ...sampleTransactions.reversed, reversedAt: undefined }).label, "Initiated");
    assert.equal(formatDate("2026-11-21T00:30:00+01:00"), "20 Nov 2026, 23:30 UTC");
});

test("sample amounts, debits and refunds agree for each currency", () => {
    for (const currency of ["GHS", "NGN", "USD"] as const) {
        const success = inCurrency(sampleTransactions.successful, currency);
        const reversed = inCurrency(sampleTransactions.reversed, currency);
        assert.equal(success.debitedMinor, success.amountMinor + success.feeMinor);
        assert.equal(reversed.refundedAmountMinor, reversed.amountMinor);
        assert.equal(reversed.refundedFeeMinor, reversed.feeMinor);
        assert.equal(inCurrency({ ...reversed, refundedFeeMinor: 0 }, currency).refundedFeeMinor, 0);
        assert.equal(inCurrency(sampleTransactions.failed, currency).debitedMinor, 0);
        assert.equal(inCurrency(sampleTransactions.pending, currency).debitedMinor, undefined);
    }
});

test("optional details are omitted and support links carry the reference", async () => {
    const t = { ...sampleTransactions.failed, reason: undefined, note: undefined };
    assert.equal(lines(t).find((line) => line.label === "Reason"), undefined);
    assert.equal(lines(t).find((line) => line.label === "Note"), undefined);
    const result = await render(emailReceipt(t));
    assert.match(result.html, new RegExp(encodeURIComponent(`Payment enquiry: ${t.id}`)));
    assert.match(result.text, /Transaction receipt/);
});

test("long content and large amounts export in all four formats without PNG overflow", async () => {
    const t = {
        ...sampleTransactions.reversed,
        id: "MP-20261120-INTERNATIONAL-TRANSFER-RECONCILIATION-0045",
        recipientName: "Nana Akua Adjei Boateng Mensah and Associates",
        senderName: "Ama Serwaa Mensah International Trading",
        amountMinor: 987654321,
        debitedMinor: 987654421,
        refundedAmountMinor: 987654321,
        reason: "The recipient account could not be credited after the provider completed its verification checks.",
        note: "Payment for supplies and delivery. Please quote the transaction reference when contacting support about this transfer.",
    };
    const email = await render(emailReceipt(t));
    const web = await render(pageReceipt(t));
    assert.match(email.text, /9,876,543.21/);
    assert.match(web.text, /Nana Akua/);
    const { pdf } = await renderPdf(pdfReceipt(t), { fonts });
    assert.equal(new TextDecoder().decode(pdf.slice(0, 4)), "%PDF");
    const normal = await renderReceiptImage(sampleTransactions.reversed, mobipayBrand, { fonts });
    const long = await renderReceiptImage(t, mobipayBrand, { fonts });
    assert.ok(long.height > normal.height);
    assert.equal(long.width, 640);
});
