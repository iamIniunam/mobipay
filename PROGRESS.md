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
- [ ] Verify the ₵ and ₦ symbols render in PNG and PDF

## Milestones
- [x] M1 setup + all four outputs render (Nov 20)
- [ ] M2 Transaction type + one receipt component (successful) → email/web/PDF/PNG
- [ ] M3 four statuses
- [ ] M4 brand/currency config + demo page
- [ ] M5 README, screenshots, submit (aim Nov 25–28)