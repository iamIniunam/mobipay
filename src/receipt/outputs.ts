import { createElement as h } from "react";
import { Canvas, Document, Email, Page } from "@hyper-elements/react";
import { receiptBody } from "./body";
import { STATUS_COPY } from "./status";
import type { Brand, Transaction } from "./types";
import { mobipayBrand } from "./brands";

// Email/web: if Inter isn't installed, fall back instead of showing a serif font.
const WEB_FONT = "Inter, Arial, Helvetica, sans-serif";
// PDF/PNG use the font files we pass in, so the name must match exactly.
const FILE_FONT = "Inter";

export const emailReceipt = (t: Transaction, brand: Brand = mobipayBrand) =>
    h(Email, { width: 600, title: `${brand.name}: ${STATUS_COPY[t.status].heading}` }, receiptBody(t, brand, WEB_FONT, true));

export const pageReceipt = (t: Transaction, brand: Brand = mobipayBrand) =>
    h(Page, { width: 640, title: `${brand.name}: ${STATUS_COPY[t.status].heading}` }, receiptBody(t, brand, WEB_FONT, true));

export const pdfReceipt = (t: Transaction, brand: Brand = mobipayBrand) =>
    h(Document, { title: `${brand.name}: ${STATUS_COPY[t.status].heading}` }, receiptBody(t, brand, FILE_FONT));

// Use a generous measuring canvas; renderReceiptImage fits the final PNG to its content.
export const imageReceipt = (t: Transaction, brand: Brand = mobipayBrand, height = 10000) =>
    h(Canvas, { width: 640, height, style: { backgroundColor: "#FFFFFF" } }, receiptBody(t, brand, FILE_FONT));
