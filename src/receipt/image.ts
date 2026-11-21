import { layoutImage, renderImage } from "@hyper-elements/react/image";
import type { ImageOptions } from "@hyper-elements/react/image";
import { imageReceipt } from "./outputs";
import type { Brand, Transaction } from "./types";

/** Node-only export: measure using the actual font metrics, then draw at that height. */
export async function renderReceiptImage(t: Transaction, brand: Brand, options: ImageOptions) {
    const layout = await layoutImage(imageReceipt(t, brand), { ...options, strict: true });
    const body = layout.nodes.find((node) => node.id === "receipt-body");
    if (!body) throw new Error("Receipt body was not measured");
    return renderImage(imageReceipt(t, brand, Math.ceil(body.y + body.height)), { ...options, strict: true });
}
