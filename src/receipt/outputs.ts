import { createElement as h } from "react";
import { Canvas, Document, Email, Page } from "@hyper-elements/react";
import { receiptBody } from "./body";
import type { Transaction } from "./types";

// Email/web: if Inter isn't installed, fall back instead of showing a serif font.
const WEB_FONT = "Inter, Arial, Helvetica, sans-serif";
// PDF/PNG use the font files we pass in, so the name must match exactly.
const FILE_FONT = "Inter";

export const emailReceipt = (t: Transaction) =>
    h(Email, { width: 600 }, receiptBody(t, WEB_FONT));

export const pageReceipt = (t: Transaction) =>
    h(Page, { width: 960 }, receiptBody(t, WEB_FONT));

export const pdfReceipt = (t: Transaction) =>
    h(Document, null, receiptBody(t, FILE_FONT));

export const imageReceipt = (t: Transaction) =>
    h(Canvas, { width: 600, height: 760 }, receiptBody(t, FILE_FONT));