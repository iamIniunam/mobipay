# MobiPay

One mobile money receipt, rendered as an **email, web page, PDF and PNG** from a single `Transaction`. Built with Hyper Elements for the Hyper Elements Template Challenge.

**Live demo: https://iaminiunam.github.io/mobipay/**

![MobiPay demo: the same receipt across statuses, brands and output formats](docs/preview.gif)

## What it does

- **One transaction, four outputs.** Email (HTML and plain text), web page, PDF and PNG all come from the same receipt definition.
- **Wording follows the status.** Successful, pending, failed and reversed each get their own summary line and next-step callout. Failed and reversed receipts show a reason and mute the amount. Fee and total appear on successful payments only.
- **Mobile money context.** Network (MTN MoMo, OPay), recipient number, amounts stored in minor units and shown as ₵ (GHS), ₦ (NGN) or $ (USD).
- **Brandable.** A `Brand` is a name, an accent colour, a support contact and a footer line. Two samples are included: MobiPay and the fictional Palmwire Money.

## Screenshots

<img src="docs/hero.png" alt="The demo page" width="480">

The four statuses (MobiPay, GHS):

![Successful, pending, failed and reversed receipts](docs/statuses.png)

Another brand and currency (MobiPay in USD, Palmwire Money in NGN):

![MobiPay USD pending and Palmwire Money NGN reversed](docs/variants.png)

## How Hyper Elements is used

The receipt body is written once, in `src/receipt/body.ts`, as a function of the transaction, the brand and a font family. It is built from Hyper Elements components (`Column`, `Row`, `Heading`, `Text`). Each output wraps that same body in a different root component, and a renderer turns it into a file:

| Output | Root component | Renderer | Result |
| --- | --- | --- | --- |
| Email | `Email` (600 px) | `render()` from `@hyper-elements/react` | `{ html, text }` |
| Web page | `Page` | `render()` | `{ html, text }` |
| PDF | `Document` | `renderPdf()` from `@hyper-elements/react/pdf` | PDF bytes |
| PNG | `Canvas` (640 px wide) | `renderImage()` from `@hyper-elements/react/image` | PNG bytes |

```ts
// src/receipt/outputs.ts
export const emailReceipt = (t: Transaction, brand: Brand = mobipayBrand) =>
  h(Email, { width: 600 }, receiptBody(t, brand, WEB_FONT));

export const pdfReceipt = (t: Transaction, brand: Brand = mobipayBrand) =>
  h(Document, null, receiptBody(t, brand, FILE_FONT));
```

```ts
// scripts/render-receipt.ts
const email = await render(emailReceipt(t, brand));
const { pdf } = await renderPdf(pdfReceipt(t, brand), { fonts });
const { image } = await renderImage(imageReceipt(t, brand), { fonts, strict: true });
```

`render()` also runs in the browser, which is how the demo draws the email and web receipts live. The PDF and PNG renderers need Node, so those files are pre-rendered by `scripts/render-receipt.ts` and committed in `public/previews/` (2 brands × 3 currencies × 4 statuses = 24 receipts).

Things worth knowing if you build on this:

- Style props that work in every output (email HTML, PDF, PNG): `backgroundColor`, `height`, `borderRadius` and `padding` on `Column`; percentage widths on `Row` and `Column`; `textAlign` on `Text`.
- Some props are silently ignored: `alignSelf`, `textDecoration`, and the colour and thickness props on `Divider`. Hairline rules here are thin `Column`s with a background colour.
- A `Canvas` is transparent unless you give it `style={{ backgroundColor }}`, so the PNG sets white explicitly.
- `renderImage(..., { strict: true })` throws, with the pixel amount, when content would be cut off. That is how the PNG height is tuned.
- PDF and PNG fonts must be TTF, OTF or WOFF files (not WOFF2) passed to the renderer. Email and web use the font stack `Inter, Arial, Helvetica, sans-serif`.

## Project structure

```
src/
  App.tsx              demo page: output tabs, status / currency / brand selects
  index.css            demo page styles
  receipt/
    types.ts           Transaction, TransactionStatus, Currency, Brand
    brands.ts          the two sample brands
    sample.ts          one sample transaction per status, plus currency conversion
    format.ts          money and date formatting
    status.ts          per-status wording
    theme.ts           colours and status styles
    body.ts            the receipt, built from Hyper Elements components
    outputs.ts         emailReceipt, pageReceipt, pdfReceipt, imageReceipt
scripts/
  render-receipt.ts    renders PDF and PNG (and email/web files) into public/previews
public/previews/       pre-rendered receipts, one folder per brand / currency / status
fonts/                 Inter TTFs used by the PDF and PNG renderers
```

## Run it locally

You need Node 22 and npm. On Windows, use Git Bash (or `npm.cmd` in PowerShell).

```bash
git clone https://github.com/iamIniunam/mobipay.git
cd mobipay
npm ci
npm run dev
```

Open the URL Vite prints (`http://localhost:5173/mobipay/`).

Other scripts: `npm run build`, `npm run preview` and `npm run lint`.

To regenerate every PDF, PNG and email/web file:

```bash
rm -rf public/previews && npx tsx scripts/render-receipt.ts
```

## Make it your own

- **New brand:** add a `Brand` to `src/receipt/brands.ts` and include it in `brands`.
- **New currency:** extend `Currency` in `types.ts`, then add its symbol in `format.ts` and sample amounts in `sample.ts`.
- **New wording:** edit `STATUS_COPY` in `status.ts`.

Then regenerate the previews with the command above.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. The site lives under `/mobipay/`, so `vite.config.ts` sets `base: '/mobipay/'` and the demo reads preview files through `import.meta.env.BASE_URL`. If you fork under another name, change `base`.

## Notes

- Brands, people, phone numbers and email addresses are fictional.
- Inter is not embedded in the email HTML, so email clients without Inter fall back to Arial. The demo page links Inter into its preview frame.
- Inter is licensed under the SIL Open Font License 1.1.