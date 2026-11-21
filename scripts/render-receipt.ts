import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { render } from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { renderReceiptImage } from "../src/receipt/image";
import { inCurrency, sampleTransactions } from "../src/receipt/sample";
import { brands, brandSlug } from "../src/receipt/brands";
import type { Currency } from "../src/receipt/types";
import {
    emailReceipt,
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

const currencies: Currency[] = ["GHS", "NGN", "USD"];

for (const brand of brands) {
    for (const currency of currencies) {
        for (const [status, base] of Object.entries(sampleTransactions)) {
            const t = inCurrency(base, currency);
            const dir = `public/previews/${brandSlug(brand)}/${currency}/${status}`;
            mkdirSync(dir, { recursive: true });

            const email = await render(emailReceipt(t, brand));
            writeFileSync(`${dir}/receipt-email.html`, email.html);
            writeFileSync(`${dir}/receipt-email.txt`, email.text);

            const page = await render(pageReceipt(t, brand));
            writeFileSync(`${dir}/receipt-page.html`, page.html);

            const { pdf } = await renderPdf(pdfReceipt(t, brand), { fonts });
            writeFileSync(`${dir}/receipt.pdf`, pdf);

            const { image } = await renderReceiptImage(t, brand, { fonts });
            writeFileSync(`${dir}/receipt.png`, image);

            console.log(dir, "ok");
        }
    }
}
