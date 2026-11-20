import { useEffect, useState } from "react";
import { render } from "@hyper-elements/react";
import { brandSlug, brands } from "./receipt/brands";
import { emailReceipt, pageReceipt } from "./receipt/outputs";
import { inCurrency, sampleTransactions } from "./receipt/sample";
import type { Currency, TransactionStatus } from "./receipt/types";

type Output = "email" | "web" | "pdf" | "png";
const OUTPUTS: Output[] = ["email", "web", "pdf", "png"];
const STATUSES = Object.keys(sampleTransactions) as TransactionStatus[];
const CURRENCIES: Currency[] = ["GHS", "NGN", "USD"];

export default function App() {
  const [status, setStatus] = useState<TransactionStatus>("successful");
  const [currency, setCurrency] = useState<Currency>("GHS");
  const [brandName, setBrandName] = useState(brands[0].name);
  const [output, setOutput] = useState<Output>("web");
  const [html, setHtml] = useState("");

  const brand = brands.find((b) => b.name === brandName) ?? brands[0];
  const live = output === "email" || output === "web";
  const base = `/previews/${brandSlug(brand)}/${currency}/${status}`;

  useEffect(() => {
    let cancelled = false;
    if (live) {
      const t = inCurrency(sampleTransactions[status], currency);
      const root = output === "email" ? emailReceipt(t, brand) : pageReceipt(t, brand);
      render(root).then((r) => {
        if (!cancelled) setHtml(r.html);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [status, currency, brand, output, live]);

  return (
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value as TransactionStatus)}>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
          {CURRENCIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={brandName} onChange={(e) => setBrandName(e.target.value)}>
          {brands.map((b) => (
            <option key={b.name}>{b.name}</option>
          ))}
        </select>
        {OUTPUTS.map((o) => (
          <button key={o} onClick={() => setOutput(o)} disabled={o === output}>
            {o}
          </button>
        ))}
      </div>
      {live && <iframe title="Receipt" srcDoc={html} style={{ width: 720, height: 900, border: 0 }} />}
      {output === "pdf" && (
        <iframe title="Receipt PDF" src={`${base}/receipt.pdf`} style={{ width: 720, height: 900, border: 0 }} />
      )}
      {output === "png" && <img alt="Receipt PNG" src={`${base}/receipt.png`} style={{ maxWidth: 600 }} />}
    </div>
  );
}