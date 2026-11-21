# MobiPay progress (update after each session)

## Goal
Hyper Elements Template Challenge, deadline Nov 29 2026 23:59 UTC. One mobile money receipt rendered as email, web, PDF and PNG from one Transaction. Wording changes by status (successful, pending, failed, reversed). Brand and currency (GHS/NGN/USD) configurable.

## Decisions
- Out of scope: KYC, statements, Flutter, extra languages.
- Submission: public GitHub repo + README (preview image/GIF, how Hyper Elements is used, setup steps), posted in GitHub Discussions under Challenge Submissions. Editable until the deadline. Repo starred.
- Rendering runs in Node scripts. The Vite React app (src/) is the demo page.
- Check the template gallery for existing receipts. Our edge is status-aware wording + mobile money context + four outputs.
- Nov 20: receipt design frozen: flat white, 6px brand top bar, status chip, tinted next-step callout, muted amount on failed/reversed, hairline table with heavy rule above Total.
- Demo: email/web render live in the browser; PDF/PNG are pre-rendered files in public/previews, committed to the repo.

## Verified facts
- Package: @hyper-elements/react (React >= 18).
- render() for Email/Page roots returns {html, text}. It also works in the browser (Vite).
- renderPdf from "@hyper-elements/react/pdf" (Document root).
- renderImage from "@hyper-elements/react/image" (Canvas root, PNG or SVG, Canvas takes width/height).
- PDF/image need fonts passed in as TTF/OTF/WOFF (not WOFF2). Installed @react-pdf/renderer, satori, @resvg/resvg-js.
- Fonts: fonts/Inter_18pt-{Regular,SemiBold,Bold}.ttf (weights 400/600/700).
- Working test scripts: render-test.mjs (email + page), outputs-test.mjs (PDF + PNG with Inter).
- Components used so far: Email, Page, Document, Canvas, Column, Row, Heading, Text.
- Exports checked Nov 20: Row, Divider, Section, Grid, Table/TableRow/TableCell, Button, Link, Image, Span, List/ListItem, Social, Svg + shapes, PageHeader/PageFooter, defineTheme/extendTheme/token.
- Style props that work (PNG, email HTML, PDF): Column backgroundColor/height/borderRadius/padding, Row + Column width "40%"/"60%", Text textAlign. Rules are thin Columns.
- Do NOT work: alignSelf, Divider color/thickness props, textDecoration (silently ignored).
- renderImage strict mode throws image/overflow with the px amount if content is cut.
- Windows: use Git Bash, or npm.cmd in PowerShell.

## Todo
- [ ] Ask prize payout question in GitHub Discussions Q&A (based in Ghana)
- [ ] Style the demo page (clean, no AI slop)
- [x] ₵ and ₦ render in PNG and PDF (Nov 20)

## Milestones
- [x] M1 setup + all four outputs render (Nov 20)
- [x] M2 Transaction type + receipt body (successful) → email/web/PDF/PNG (Nov 20)
- [x] M3 four statuses (Nov 20): STATUS_COPY in src/receipt/status.ts, `reason` field
- [x] M4a brand/currency config (Nov 20): Brand type, 2 brands, GHS/NGN/USD, all combos render
- [x] UI redesign (Nov 20)
- [ ] M4b Vite demo page (switchers + output tabs done; styling pending)
- [ ] M5 README, screenshots, submit (aim Nov 25–28)

## Code map (src/receipt/ is shared by the Node scripts and the Vite demo)
- types.ts: Transaction, TransactionStatus, Currency, Brand (name, accentColor, supportContact, footerLine)
- brands.ts: mobipayBrand, palmwireBrand (made-up), brands[], brandSlug(b)
- sample.ts: sampleTransaction, sampleTransactions (one per status), CURRENCY_PATCH, inCurrency(t, currency)
- format.ts: formatMoney (symbol map ₵ ₦ $, amounts in minor units), formatDate
- status.ts: STATUS_COPY (heading, showCharges, summary(t) without the amount, nextStep); heading is kept for email subject/page title, not drawn in the body
- theme.ts: INK, MUTED, RULE, STATUS_STYLE (label, ink, tint, mutedAmount), chipWidth
- body.ts: groupsOf(t) rows, receiptHeight(t) PNG height estimate, receiptBody(t, brand, fontFamily)
- outputs.ts: emailReceipt (600) / pageReceipt (640) / pdfReceipt / imageReceipt (600 x receiptHeight(t)), each (t, brand = mobipayBrand), plain functions returning the root element
- scripts/render-receipt.ts: `rm -rf public/previews && npx tsx scripts/render-receipt.ts` writes public/previews/<brand-slug>/<currency>/<status>/{receipt-email.html,.txt, receipt-page.html, receipt.pdf, receipt.png} (24 receipts)
- src/App.tsx: demo page; status, currency and brand selects; email/web rendered live with render(), PDF/PNG shown from public/previews

## Conventions
- No JSX in src/receipt: use createElement as h(...), like the working scripts. (src/App.tsx may use JSX.)
- Root elements come from plain functions, called as emailReceipt(t, brand), not as <Component />. Brand is optional (defaults to mobipayBrand).
- Money is stored in minor units (integers). Fonts: email/web "Inter, Arial, Helvetica, sans-serif"; PDF/PNG "Inter" (registered files).
- Status color is for the status only; brand accent is for brand chrome only.
- tsx does not type-check: use `npx tsc -p tsconfig.app.json --noEmit`.
- I'm a Flutter dev new to React/JS: explain step by step with Dart analogies. Keep answers compact.

## Now
Repo cleaned. Next: style the demo page (replace Vite CSS), BASE_URL fix + deploy, README, submit.