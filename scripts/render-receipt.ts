import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { render } from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { renderImage } from "@hyper-elements/react/image";
import { sampleTransactions } from "../src/receipt/sample";
import {
    emailReceipt,
    imageReceipt,
    pageReceipt,
    pdfReceipt,
} from "../src/receipt/outputs";

const fontFiles: [string, number][] = [
    ["Inter_18pt-Regular.ttf", 400],
    ["Inter_18pt-SemiBold.ttf", 600],
    ["Inter_18pt-Bold.ttf", 700],
];
const fonts = fontFiles.map(([file, weight]) => ({
    family: "Inter",
    src: readFileSync(`fonts/${file}`),
    weight,
}));

for (const [status, t] of Object.entries(sampleTransactions)) {
    const dir = `out/${status}`;
    mkdirSync(dir, { recursive: true });

    const email = await render(emailReceipt(t));
    writeFileSync(`${dir}/receipt-email.html`, email.html);
    writeFileSync(`${dir}/receipt-email.txt`, email.text);

    const page = await render(pageReceipt(t));
    writeFileSync(`${dir}/receipt-page.html`, page.html);

    const { pdf } = await renderPdf(pdfReceipt(t), { fonts });
    writeFileSync(`${dir}/receipt.pdf`, pdf);

    const { image } = await renderImage(imageReceipt(t), { fonts, strict: true });
    writeFileSync(`${dir}/receipt.png`, image);

    console.log(status, "ok");
}