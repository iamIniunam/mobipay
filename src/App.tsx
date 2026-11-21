import { useEffect, useState } from "react";
import type { CSSProperties, SyntheticEvent } from "react";
import { render } from "@hyper-elements/react";
import { brandSlug, brands } from "./receipt/brands";
import { emailReceipt, pageReceipt } from "./receipt/outputs";
import { inCurrency, sampleTransactions } from "./receipt/sample";
import { STATUS_STYLE } from "./receipt/theme";
import type { Currency, TransactionStatus } from "./receipt/types";

type Output = "email" | "web" | "pdf" | "png";
const OUTPUT_LABELS: Record<Output, string> = { email: "Email", web: "Web", pdf: "PDF", png: "PNG" };
const OUTPUTS = Object.keys(OUTPUT_LABELS) as Output[];
const STATUSES = Object.keys(sampleTransactions) as TransactionStatus[];
const CURRENCIES: Currency[] = ["GHS", "NGN", "USD"];

// "/" in dev, "/mobipay/" in the production build (set in vite.config.ts).
const BASE = import.meta.env.BASE_URL;

// The receipt renders inside an iframe, which doesn't inherit our stylesheet: link Inter into it.
const withInter = (html: string) =>
  html.replace("</head>", `<link rel="stylesheet" href="${BASE}fonts/inter.css"></head>`);

// Grow the iframe to the receipt's height, so the page scrolls instead of the frame.
function fitFrame(e: SyntheticEvent<HTMLIFrameElement>) {
  const frame = e.currentTarget;
  const doc = frame.contentDocument;
  if (!doc) return;
  const fit = () => {
    frame.style.height = "0px"; // shrink first, or scrollHeight can't go below the old height
    frame.style.height = `${doc.documentElement.scrollHeight}px`;
  };
  fit();
  doc.fonts.ready.then(fit); // Inter arrives late and can change line wraps
}

export default function App() {
  const [status, setStatus] = useState<TransactionStatus>("successful");
  const [currency, setCurrency] = useState<Currency>("GHS");
  const [brandName, setBrandName] = useState(brands[0].name);
  const [output, setOutput] = useState<Output>("web");
  const [html, setHtml] = useState("");

  const brand = brands.find((b) => b.name === brandName) ?? brands[0];
  const live = output === "email" || output === "web";
  const base = `${BASE}previews/${brandSlug(brand)}/${currency}/${status}`;

  useEffect(() => {
    let cancelled = false;
    if (live) {
      const t = inCurrency(sampleTransactions[status], currency);
      const root = output === "email" ? emailReceipt(t, brand) : pageReceipt(t, brand);
      render(root).then((r) => {
        if (!cancelled) setHtml(withInter(r.html));
      });
    }
    return () => {
      cancelled = true;
    };
  }, [status, currency, brand, output, live]);

  return (
    <main className="page" style={{ "--brand": brand.accentColor } as CSSProperties}>
      <div className="column">
        <header className="intro">
          <h1>MobiPay</h1>
          <p>One transaction, four formats: email, web, PDF and PNG.</p>
        </header>

        <div className="toolbar">
          <div className="segmented" role="group" aria-label="Output format">
            {OUTPUTS.map((o) => (
              <button key={o} type="button" aria-pressed={o === output} onClick={() => setOutput(o)}>
                {OUTPUT_LABELS[o]}
              </button>
            ))}
          </div>
          <div className="selects">
            <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as TransactionStatus)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_STYLE[s].label}
                </option>
              ))}
            </select>
            <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select aria-label="Brand" value={brandName} onChange={(e) => setBrandName(e.target.value)}>
              {brands.map((b) => (
                <option key={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="sheet">
          {live && <iframe title="Receipt" srcDoc={html} onLoad={fitFrame} />}
          {output === "pdf" && <iframe className="pdf" title="Receipt PDF" src={`${base}/receipt.pdf`} />}
          {output === "png" && (
            <img alt={`${brand.name} receipt, ${status}`} src={`${base}/receipt.png`} />
          )}
        </div>
      </div>
    </main>
  );
}