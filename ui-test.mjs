import { createElement as h } from "react";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Canvas, Column, Divider, Email, Row, Text, render } from "@hyper-elements/react";
import { renderImage } from "@hyper-elements/react/image";

const fonts = [["Regular", 400], ["SemiBold", 600], ["Bold", 700]].map(([n, weight]) => ({
    family: "Inter",
    src: readFileSync(`fonts/Inter_18pt-${n}.ttf`),
    weight,
}));

const t = (s, w = 400) => h(Text, { style: { fontFamily: "Inter", fontSize: 14, fontWeight: w } }, s);

const r = (s) =>
    h(Text, { style: { fontFamily: "Inter", fontSize: 14, fontWeight: 600, textAlign: "right" } }, s);

const variants = {
    "d-right-text": h(Row, null, t("To"), r("Kwame Boateng")),
    "e-cols-40-60": h(
        Row,
        null,
        h(Column, { style: { width: "40%" } }, t("To")),
        h(Column, { style: { width: "60%" } }, r("Kwame Boateng")),
    ),
    "f-gap": h(Column, { style: { gap: 12 } }, t("above"), h(Divider, null), t("below")),
};

mkdirSync("out/ui-test", { recursive: true });
for (const [name, el] of Object.entries(variants)) {
    try {
        const body = h(Column, { style: { padding: 16 } }, el);
        const { image } = await renderImage(h(Canvas, { width: 400, height: 120 }, body), { fonts, strict: true });
        writeFileSync(`out/ui-test/${name}.png`, image);
        const email = await render(h(Email, { width: 600 }, body));
        writeFileSync(`out/ui-test/${name}.html`, email.html);
        console.log(name, "ok");
    } catch (e) {
        console.log(name, "FAILED:", e.message);
    }
}