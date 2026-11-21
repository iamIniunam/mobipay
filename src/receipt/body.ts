import { createElement as h } from "react";
import { Column, Heading, Link, Row, Text } from "@hyper-elements/react";
import { formatMoney, formatDate } from "./format";
import { receiptTimestamp, STATUS_COPY } from "./status";
import { INK, MUTED, RULE, STATUS_STYLE, chipWidth } from "./theme";
import type { Brand, Transaction } from "./types";

type Line = { label: string; value: string; secondary?: string; strong?: boolean; stacked?: boolean };
type Group = { title: string; lines: Line[] };

const txt = (fontFamily: string, s: string, size: number, color: string, extra: object = {}) =>
    h(Text, { style: { fontFamily, fontSize: size, color, ...extra } }, s);
const rule = () => h(Column, { style: { height: 1, backgroundColor: RULE } });

function row(line: Line, fontFamily: string) {
    if (line.stacked) return h(Column, { style: { gap: 4 } },
        txt(fontFamily, line.label, 13, MUTED),
        txt(fontFamily, line.value, 14, INK, { fontWeight: line.label === "Reference" ? 600 : 400 }),
    );
    return h(Row, { stackOnMobile: false, style: { gap: 12 } },
        h(Column, { style: { width: "36%" } }, txt(fontFamily, line.label, 13, MUTED)),
        h(Column, { style: { width: "64%", gap: 2 } },
            txt(fontFamily, line.value, line.strong ? 16 : 14, INK, {
                fontWeight: line.strong ? 700 : 600, textAlign: "right",
            }),
            line.secondary ? txt(fontFamily, line.secondary, 13, MUTED, { textAlign: "right" }) : null,
        ),
    );
}

export function receiptGroups(t: Transaction): Group[] {
    const money = (n: number) => formatMoney(n, t.currency);
    const payment: Line[] = [
        { label: "Recipient", value: t.recipientName, secondary: t.recipientNumber },
        { label: "Sender", value: t.senderName },
        { label: "Network", value: t.network },
    ];
    if (t.reason && (t.status === "failed" || t.status === "reversed")) {
        payment.push({ label: "Reason", value: t.reason, stacked: true });
    }

    const charges: Line[] = [];
    if (t.status === "successful") charges.push({ label: "Fee", value: money(t.feeMinor) });
    if (t.debitedMinor !== undefined) charges.push({ label: "Total debited", value: money(t.debitedMinor), strong: t.status !== "reversed" });
    if (t.status === "reversed") {
        if (t.refundedAmountMinor !== undefined) charges.push({ label: "Payment refunded", value: money(t.refundedAmountMinor) });
        charges.push({ label: "Fee refunded", value: t.refundedFeeMinor === undefined ? "Not confirmed" : money(t.refundedFeeMinor) });
        if (t.refundedAmountMinor !== undefined && t.refundedFeeMinor !== undefined) {
            charges.push({ label: "Total refunded", value: money(t.refundedAmountMinor + t.refundedFeeMinor), strong: true });
        }
    }

    const details: Line[] = [
        { label: "Initiated", value: formatDate(t.createdAt) },
        { label: "Reference", value: t.id, stacked: true },
    ];
    if (t.note) details.push({ label: "Note", value: t.note, stacked: true });
    return [
        { title: "Payment details", lines: payment },
        ...(charges.length ? [{ title: t.status === "successful" ? "Charges" : "Wallet movements", lines: charges }] : []),
        { title: "Transaction details", lines: details },
    ];
}

function section(group: Group, fontFamily: string) {
    return h(Column, { style: { gap: 12 } },
        h(Heading, { level: 2, style: { fontFamily, fontSize: 13, fontWeight: 700, color: INK } }, group.title),
        ...group.lines.map((line) => h(Column, { style: { gap: 10 } },
            line.strong ? rule() : null,
            row(line, fontFamily),
        )),
    );
}

export function receiptBody(t: Transaction, brand: Brand, fontFamily: string, responsive = false) {
    const copy = STATUS_COPY[t.status];
    const look = STATUS_STYLE[t.status];
    const timestamp = receiptTimestamp(t);
    const supportHref = `mailto:${brand.supportContact}?subject=${encodeURIComponent(`Payment enquiry: ${t.id}`)}`;

    return h(Column, { id: "receipt-body", style: { width: "100%" } },
        h(Column, { style: { height: 5, backgroundColor: brand.accentColor } }),
        h(Column, { style: { padding: 24, gap: 22, ...(responsive ? { mobile: { padding: 18 } } : {}) } },
            h(Column, { style: { gap: 3 } },
                txt(fontFamily, brand.name, 17, INK, { fontWeight: 700 }),
                txt(fontFamily, "Transaction receipt", 12, MUTED),
            ),
            h(Column, { style: { gap: 8 } },
                h(Column, { style: { width: chipWidth(look.label), padding: 6, borderRadius: 999, backgroundColor: look.tint } },
                    txt(fontFamily, look.label, 13, look.ink, { fontWeight: 600, textAlign: "center" }),
                ),
                txt(fontFamily, `${timestamp.label} ${formatDate(timestamp.value)}`, 12, MUTED),
                txt(fontFamily, `${copy.amountLabel} (${t.currency})`, 13, MUTED),
                txt(fontFamily, formatMoney(t.amountMinor, t.currency), 36, look.mutedAmount ? MUTED : INK, {
                    fontWeight: 700, ...(responsive ? { mobile: { fontSize: 28 } } : {}),
                }),
                h(Heading, { level: 1, style: { fontFamily, fontSize: 17, fontWeight: 600, color: INK } }, copy.summary(t)),
            ),
            t.status === "successful"
                ? txt(fontFamily, copy.nextStep(t), 13, MUTED)
                : h(Column, { style: { padding: 12, borderRadius: 6, backgroundColor: look.tint } }, txt(fontFamily, copy.nextStep(t), 13, look.ink)),
            ...receiptGroups(t).map((group) => section(group, fontFamily)),
            rule(),
            h(Column, { style: { gap: 4 } },
                txt(fontFamily, "Need help? Quote your transaction reference.", 12, MUTED),
                h(Text, { style: { fontFamily, fontSize: 12, color: brand.accentColor } },
                    h(Link, { href: supportHref, style: { color: brand.accentColor } }, brand.supportContact)),
                txt(fontFamily, brand.footerLine, 11, MUTED),
            ),
        ),
    );
}
