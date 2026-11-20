import { createElement as h } from "react";
import { writeFileSync } from "node:fs";
import { Column, Document, Heading, Text } from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";

const content = h(Column, { style: { padding: 32, gap: 16 } },
    h(Heading, { level: 1 }, "Hello MobiPay"),
    h(Text, null, "My first PDF."));

const { pdf, diagnostics } = await renderPdf(h(Document, null, content));
writeFileSync("hello.pdf", pdf);
console.log("ok", pdf.length, diagnostics);