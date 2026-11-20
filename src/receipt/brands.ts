import type { Brand } from "./types";

export const mobipayBrand: Brand = {
    name: "MobiPay",
    accentColor: "#0B6E4F",
    supportContact: "help@mobipay.example",
    footerLine: "MobiPay · Mobile money made simple",
};

export const palmwireBrand: Brand = {
    name: "Palmwire Money",
    accentColor: "#C2410C",
    supportContact: "support@palmwire.example",
    footerLine: "Palmwire Money · Send. Save. Smile.",
};

export const brands: Brand[] = [mobipayBrand, palmwireBrand];

export const brandSlug = (b: Brand) => b.name.toLowerCase().replace(/\s+/g, "-");