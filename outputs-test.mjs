import { createElement as h } from "react";
import { readFileSync, writeFileSync } from "node:fs";
import { Canvas, Column, Document, Heading, Text } from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { renderImage } from "@hyper-elements/react/image";

const inter = [
    ["Inter_18pt-Regular.ttf", 400],
    ["Inter_18pt-SemiBold.ttf", 600],
    ["Inter_18pt-Bold.ttf", 700],
].map(([file, weight]) => ({
    family: "Inter",
    src: readFileSync(`fonts/${file}`),
    weight,
}));

const font = { fontFamily: "Inter" };
const content = h(Column, { style: { padding: 32, gap: 16 } },
    h(Heading, { level: 1, style: { ...font, fontWeight: 700 } }, "Payment successful"),
    h(Text, { style: font }, "GH₵500.00  ·  ₦25,000  ·  $40.00"));

try {
    const { pdf } = await renderPdf(h(Document, null, content), { fonts: inter });
    writeFileSync("inter-test.pdf", pdf);
    console.log("PDF ok", pdf.length);
} catch (e) { console.log("PDF failed:", e.message); }

try {
    const { image, width, height } = await renderImage(
        h(Canvas, { width: 800, height: 400 }, content),
        { fonts: inter, strict: true },
    );
    writeFileSync("inter-test.png", image);
    console.log("PNG ok", width, height);
} catch (e) { console.log("PNG failed:", e.message); }