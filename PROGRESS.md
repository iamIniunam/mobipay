# MobiPay progress (update after each session)

## Goal
Hyper Elements Template Challenge, deadline Nov 29 2026 23:59 UTC. One mobile money receipt rendered as email, web, PDF and PNG from one Transaction. Wording changes by status (successful, pending, failed, reversed). Brand and currency (GHS/NGN/USD) configurable.

## Decisions
- Out of scope: KYC, statements, Flutter, extra languages.
- Submission: public GitHub repo + README (preview image/GIF, how Hyper Elements is used, setup steps), posted in GitHub Discussions under Challenge Submissions. Editable until the deadline. Repo starred.
- Rendering runs in Node scripts. The Vite React app (src/) will become the demo page.
- Check the template gallery for existing receipts. Our edge is status-aware wording + mobile money context + four outputs.

## Verified facts
- Package: @hyper-elements/react (React >= 18).
- render() for Email/Page roots returns {html, text}.
- renderPdf from "@hyper-elements/react/pdf" (Document root).
- renderImage from "@hyper-elements/react/image" (Canvas root, PNG or SVG, Canvas takes width/height).
- PDF/image need fonts passed in as TTF/OTF/WOFF (not WOFF2). Installed @react-pdf/renderer, satori, @resvg/resvg-js.
- Fonts: fonts/Inter_18pt-{Regular,SemiBold,Bold}.ttf (weights 400/600/700).
- Working test scripts: render-test.mjs (email + page), outputs-test.mjs (PDF + PNG with Inter).
- Components used so far: Email, Page, Document, Canvas, Column, Heading, Text.
- Windows: use Git Bash, or npm.cmd in PowerShell.

## Todo
- [ ] Ask prize payout question in GitHub Discussions Q&A (based in Ghana)
- [x] ₵ and ₦ render in PNG and PDF (Nov 20)

## Milestones
- [x] M1 setup + all four outputs render (Nov 20)
- [x] M2 Transaction type + receipt body (successful) → email/web/PDF/PNG (Nov 20)
- [x] M3 four statuses (Nov 20): STATUS_COPY in src/receipt/status.ts, `reason` field, out/<status>/ renders
- [ ] M4 brand/currency config + demo page
- [ ] M5 README, screenshots, submit (aim Nov 25–28)

## Code map (src/receipt/ is shared by the Node scripts and the Vite demo)
- types.ts: Transaction, TransactionStatus, Currency
- sample.ts: sampleTransaction, sampleTransactions (one per status)
- format.ts: formatMoney (symbol map ₵ ₦ $, amounts in minor units), formatDate
- status.ts: STATUS_COPY (heading, color, amountLabel, showCharges, summary(t), nextStep)
- body.ts: receiptBody(t, fontFamily), the shared Column tree
- outputs.ts: emailReceipt / pageReceipt / pdfReceipt / imageReceipt, plain functions returning the root element (Canvas 600x760)
- scripts/render-receipt.ts: run `npx tsx scripts/render-receipt.ts`, writes out/<status>/{receipt-email.html,.txt, receipt-page.html, receipt.pdf, receipt.png}

## Conventions
- No JSX in src/receipt: use createElement as h(...), like the working scripts.
- Root elements come from plain functions, called as emailReceipt(t), not as <Component />.
- Money is stored in minor units (integers). Fonts: email/web "Inter, Arial, Helvetica, sans-serif"; PDF/PNG "Inter" (registered files).
- tsx does not type-check: use `npx tsc -p tsconfig.app.json --noEmit`.
- I'm a Flutter dev new to React/JS: explain step by step with Dart analogies.

## Next: M4a
Brand type (name, accent color, support contact, footer line) read by the body header/footer; sample NGN and USD transactions; one made-up second brand. Then M4b: Vite demo page with status, currency and brand switchers.