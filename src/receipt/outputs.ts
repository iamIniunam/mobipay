import { createElement as h } from "react";
import { Canvas, Document, Email, Page } from "@hyper-elements/react";
import { receiptBody, receiptHeight } from "./body";
import type { Brand, Transaction } from "./types";
import { mobipayBrand } from "./brands";

// Email/web: if Inter isn't installed, fall back instead of showing a serif font.
const WEB_FONT = "Inter, Arial, Helvetica, sans-serif";
// PDF/PNG use the font files we pass in, so the name must match exactly.
const FILE_FONT = "Inter";

export const emailReceipt = (t: Transaction, brand: Brand = mobipayBrand) =>
    h(Email, { width: 600 }, receiptBody(t, brand, WEB_FONT));

export const pageReceipt = (t: Transaction, brand: Brand = mobipayBrand) =>
    h(Page, { width: 960 }, receiptBody(t, brand, WEB_FONT));

export const pdfReceipt = (t: Transaction, brand: Brand = mobipayBrand) =>
    h(Document, null, receiptBody(t, brand, FILE_FONT));

export const imageReceipt = (t: Transaction, brand: Brand = mobipayBrand) =>
    h(Canvas, { width: 640, height: receiptHeight(t), style: { backgroundColor: "#FFFFFF" } }, receiptBody(t, brand, FILE_FONT));