import { createElement as h } from "react";
import { Column, Heading, Row, Text } from "@hyper-elements/react";
import { formatMoney, formatDate } from "./format";
import { STATUS_COPY } from "./status";
import { INK, MUTED, RULE, STATUS_STYLE, chipWidth } from "./theme";
import type { Brand, Transaction } from "./types";

type Line = { label: string; value: string; strong?: boolean };

const txt = (fontFamily: string, s: string, size: number, color: string, extra: object = {}) =>
    h(Text, { style: { fontFamily, fontSize: size, color, ...extra } }, s);

const rule = (heavy = false) =>
    h(Column, { style: { height: heavy ? 2 : 1, backgroundColor: heavy ? INK : RULE } });

function row(line: Line, fontFamily: string) {
    const strong = line.strong ?? false;
    return h(
        Row,
        null,
        h(Column, { style: { width: "40%" } }, txt(fontFamily, line.label, 14, MUTED)),
        h(
            Column,
            { style: { width: "60%" } },
            txt(fontFamily, line.value, strong ? 16 : 14, INK, {
                fontWeight: strong ? 700 : 600,
                textAlign: "right",
            }),
        ),
    );
}

// Rows separated by hairlines. A strong row (Total) gets a heavy rule above it.
function table(lines: Line[], fontFamily: string) {
    return h(
        Column,
        { style: { gap: 10 } },
        ...lines.flatMap((line, i) => [row(line, fontFamily), rule(lines[i + 1]?.strong)]),
    );
}

function groupsOf(t: Transaction): Line[][] {
    const copy = STATUS_COPY[t.status];

    const people: Line[] = [];
    if (t.reason) people.push({ label: "Reason", value: t.reason });
    people.push(
        { label: "To", value: `${t.recipientName} (${t.recipientNumber})` },
        { label: "From", value: t.senderName },
        { label: "Network", value: t.network },
    );

    const money: Line[] = copy.showCharges
        ? [
            { label: "Fee", value: formatMoney(t.feeMinor, t.currency) },
            {
                label: "Total",
                value: formatMoney(t.amountMinor + t.feeMinor, t.currency),
                strong: true,
            },
        ]
        : [];

    const meta: Line[] = [
        { label: "Date", value: formatDate(t.createdAt) },
        { label: "Reference", value: t.id },
    ];
    if (t.note) meta.push({ label: "Note", value: t.note });

    return [people, money, meta].filter((g) => g.length > 0);
}

// Rough PNG height from the row and group count, so no blank space is left.
export function receiptHeight(t: Transaction) {
    const groups = groupsOf(t);
    const rows = groups.reduce((n, g) => n + g.length, 0);
    // The callout wraps to extra lines when the next-step text is long.
    const wraps = Math.ceil(STATUS_COPY[t.status].nextStep.length / 70) - 1;
    return 380 + rows * 42 + groups.length * 24 + wraps * 22;
}

export function receiptBody(t: Transaction, brand: Brand, fontFamily: string) {
    const copy = STATUS_COPY[t.status];
    const look = STATUS_STYLE[t.status];

    const people: Line[] = [];
    if (t.reason) people.push({ label: "Reason", value: t.reason });
    people.push(
        { label: "To", value: `${t.recipientName} (${t.recipientNumber})` },
        { label: "From", value: t.senderName },
        { label: "Network", value: t.network },
    );

    // const money: Line[] = copy.showCharges
    //     ? [
    //         { label: "Fee", value: formatMoney(t.feeMinor, t.currency) },
    //         {
    //             label: "Total",
    //             value: formatMoney(t.amountMinor + t.feeMinor, t.currency),
    //             strong: true,
    //         },
    //     ]
    //     : [];

    const meta: Line[] = [
        { label: "Date", value: formatDate(t.createdAt) },
        { label: "Reference", value: t.id },
    ];
    if (t.note) meta.push({ label: "Note", value: t.note });

    const groups = groupsOf(t).map((g) => table(g, fontFamily));

    return h(
        Column,
        { style: { width: "100%" } },
        h(Column, { style: { height: 6, backgroundColor: brand.accentColor } }),
        h(
            Column,
            { style: { padding: 32, gap: 24 } },
            txt(fontFamily, brand.name, 14, INK, { fontWeight: 700 }),
            h(
                Column,
                { style: { gap: 10 } },
                h(
                    Column,
                    {
                        style: {
                            width: chipWidth(look.label),
                            padding: 6,
                            borderRadius: 999,
                            backgroundColor: look.tint,
                        },
                    },
                    txt(fontFamily, look.label, 13, look.ink, { fontWeight: 600, textAlign: "center" }),
                ),
                txt(fontFamily, formatMoney(t.amountMinor, t.currency), 40, look.mutedAmount ? MUTED : INK, {
                    fontWeight: 700,
                }),
                h(
                    Heading,
                    { level: 1, style: { fontFamily, fontSize: 18, fontWeight: 600, color: INK } },
                    copy.summary(t),
                ),
            ),
            h(
                Column,
                { style: { padding: 12, borderRadius: 6, backgroundColor: look.tint } },
                txt(fontFamily, copy.nextStep, 14, look.ink),
            ),
            ...groups,
            h(
                Column,
                { style: { gap: 2 } },
                txt(fontFamily, `Need help? ${brand.supportContact}`, 12, MUTED),
                txt(fontFamily, brand.footerLine, 12, MUTED),
            ),
        ),
    );
}