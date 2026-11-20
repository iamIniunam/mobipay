import { createElement as h } from "react";
import { Column, Heading, Text } from "@hyper-elements/react";
import { formatMoney, formatDate } from "./format";
import { STATUS_COPY } from "./status";
import type { Brand, Transaction } from "./types";

function detail(label: string, value: string, fontFamily: string) {
    return h(
        Column,
        { style: { gap: 2 } },
        h(Text, { style: { fontFamily, fontSize: 12, color: "#6b7280" } }, label),
        h(Text, { style: { fontFamily, fontSize: 16, fontWeight: 600 } }, value),
    );
}

export function receiptBody(t: Transaction, brand: Brand, fontFamily: string) {
    const copy = STATUS_COPY[t.status];

    const rows = [
        detail("To", `${t.recipientName} (${t.recipientNumber})`, fontFamily),
        detail("From", t.senderName, fontFamily),
        detail("Network", t.network, fontFamily),
    ];
    if (copy.showCharges) {
        rows.push(
            detail("Fee", formatMoney(t.feeMinor, t.currency), fontFamily),
            detail("Total", formatMoney(t.amountMinor + t.feeMinor, t.currency), fontFamily),
        );
    }
    if (t.reason) rows.push(detail("Reason", t.reason, fontFamily));
    rows.push(
        detail("Date", formatDate(t.createdAt), fontFamily),
        detail("Reference", t.id, fontFamily),
    );
    if (t.note) rows.push(detail("Note", t.note, fontFamily));

    return h(
        Column,
        { style: { padding: 32, gap: 16 } },
        h(Text, { style: { fontFamily, fontSize: 14, fontWeight: 700, color: brand.accentColor } }, brand.name),
        h(Heading, { level: 1, style: { fontFamily, fontSize: 20, fontWeight: 700, color: copy.color } }, copy.heading,),
        h(Text, { style: { fontFamily, fontSize: 16 } }, copy.summary(t)),
        h(
            Column,
            { style: { gap: 2 } },
            h(Text, { style: { fontFamily, fontSize: 12, color: "#6b7280" } }, copy.amountLabel),
            h(Text, { style: { fontFamily, fontSize: 40, fontWeight: 700 } }, formatMoney(t.amountMinor, t.currency)),
        ),
        h(Text, { style: { fontFamily, fontSize: 14, color: "#374151" } }, copy.nextStep),
        ...rows,
        h(Text, { style: { fontFamily, fontSize: 12, color: "#6b7280" } }, `Questions? ${brand.supportContact}`),
        h(Text, { style: { fontFamily, fontSize: 12, fontWeight: 600, color: brand.accentColor } }, brand.footerLine),
    )
}
