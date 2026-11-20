import { createElement as h } from "react";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Canvas, Column, Divider, Email, Text, render } from "@hyper-elements/react";
import { renderImage } from "@hyper-elements/react/image";

const fonts = [["Regular", 400], ["SemiBold", 600], ["Bold", 700]].map(([n, weight]) => ({
    family: "Inter",
    src: readFileSync(`fonts/Inter_18pt-${n}.ttf`),
    weight,
}));

const txt = (s, extra = {}) =>
    h(Text, { style: { fontFamily: "Inter", fontSize: 14, color: "#171717", ...extra } }, s);
const label = (s) => txt(s, { fontSize: 11, color: "#6B7280" });

const variants = {
    "1 bar: Column height + backgroundColor": h(Column, {
        style: { height: 6, backgroundColor: "#0B6E4F" },
    }),
    "2 chip: bg + borderRadius + padding": h(
        Column,
        { style: { backgroundColor: "#FEE2E2", borderRadius: 999, padding: 6 } },
        txt("Failed", { fontSize: 13, fontWeight: 600, color: "#991B1B" }),
    ),
    "3 chip with alignSelf flex-start": h(
        Column,
        { style: { backgroundColor: "#FEE2E2", borderRadius: 999, padding: 6, alignSelf: "flex-start" } },
        txt("Failed", { fontSize: 13, fontWeight: 600, color: "#991B1B" }),
    ),
    "4 callout: bg + borderRadius 6": h(
        Column,
        { style: { backgroundColor: "#FEE2E2", borderRadius: 6, padding: 12 } },
        txt("No money was taken from your wallet.", { color: "#991B1B" }),
    ),
    "5 strike-through": txt("₵125.50", {
        fontSize: 32,
        fontWeight: 700,
        color: "#6B7280",
        textDecoration: "line-through",
    }),
    "6 rules as thin Columns": h(
        Column,
        { style: { gap: 8 } },
        txt("above"),
        h(Column, { style: { height: 1, backgroundColor: "#E5E7EB" } }),
        txt("below"),
        h(Column, { style: { height: 2, backgroundColor: "#171717" } }),
        txt("after heavy rule"),
    ),
    "7 Divider with color/thickness props (guess)": h(
        Column,
        { style: { gap: 8 } },
        txt("above"),
        h(Divider, { color: "#E5E7EB", thickness: 1 }),
        txt("below"),
    ),
};

const ok = [];
for (const [name, el] of Object.entries(variants)) {
    try {
        const canvas = h(Canvas, { width: 400, height: 140 }, h(Column, { style: { padding: 16 } }, el));
        await renderImage(canvas, { fonts, strict: true });
        ok.push([name, el]);
        console.log(name, "ok");
    } catch (e) {
        console.log(name, "FAILED:", e.message);
    }
}

const sheet = h(
    Column,
    { style: { padding: 16, gap: 18 } },
    ...ok.flatMap(([name, el]) => [label(name), el]),
);

mkdirSync("out/ui-test", { recursive: true });
const { image } = await renderImage(h(Canvas, { width: 440, height: 900 }, sheet), { fonts, strict: true });
writeFileSync("out/ui-test/sheet.png", image);
const email = await render(h(Email, { width: 600 }, sheet));
writeFileSync("out/ui-test/sheet.html", email.html);
console.log("sheet written");