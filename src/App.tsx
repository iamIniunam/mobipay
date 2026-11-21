import { useEffect, useRef, useState } from "react";
import type { CSSProperties, SyntheticEvent } from "react";
import { brandSlug, brands } from "./receipt/brands";
import { inCurrency, sampleTransactions } from "./receipt/sample";
import { STATUS_STYLE } from "./receipt/theme";
import type { Currency, TransactionStatus } from "./receipt/types";

type Output = "email" | "web" | "pdf" | "png";
const OUTPUT_LABELS: Record<Output, string> = { email: "Email", web: "Web", pdf: "PDF", png: "PNG" };
const OUTPUTS = Object.keys(OUTPUT_LABELS) as Output[];
const STATUSES = Object.keys(sampleTransactions) as TransactionStatus[];
const CURRENCIES: Currency[] = ["GHS", "NGN", "USD"];
const REPO = "https://github.com/iamIniunam/mobipay";
const BASE = import.meta.env.BASE_URL;
const withInter = (html: string) =>
  html.replace("</head>", `<link rel="stylesheet" href="${BASE}fonts/inter.css"></head>`);

// Observe the body rather than the iframe viewport, which changes as we fit it.
function ReceiptFrame({ html }: { html: string }) {
  const cleanup = useRef<(() => void) | undefined>(undefined);
  useEffect(() => () => cleanup.current?.(), []);

  function fitFrame(e: SyntheticEvent<HTMLIFrameElement>) {
    cleanup.current?.();
    const frame = e.currentTarget;
    const doc = frame.contentDocument;
    const receipt = doc?.getElementById("receipt-body");
    if (!doc || !receipt) return;
    let active = true;
    const fit = () => {
      if (active) frame.style.height = `${Math.ceil(receipt.getBoundingClientRect().bottom + (doc.defaultView?.scrollY ?? 0))}px`;
    };
    const observer = new ResizeObserver(fit);
    observer.observe(receipt);
    cleanup.current = () => { active = false; observer.disconnect(); };
    fit();
    void doc.fonts.ready.then(fit);
  }

  return <iframe title="Receipt" srcDoc={html} onLoad={fitFrame} />;
}

function LoadingPreview() {
  return <div className="preview-message" role="status"><span className="spinner" aria-hidden="true" />Loading receipt…</div>;
}

function PreviewError({ retry }: { retry: () => void }) {
  return (
    <div className="preview-message" role="alert">
      <strong>We couldn’t load this preview.</strong>
      <span>Try again, or use the download link above.</span>
      <button className="action" type="button" onClick={retry}>Retry preview</button>
    </div>
  );
}

function FilePreview({ output, src, alt }: { output: "pdf" | "png"; src: string; alt: string }) {
  const [attempt, setAttempt] = useState(0);
  const [loadedSrc, setLoadedSrc] = useState("");
  const [failedSrc, setFailedSrc] = useState("");
  const resourceSrc = attempt ? `${src}?retry=${attempt}` : src;
  const ready = loadedSrc === resourceSrc;
  const failed = failedSrc === resourceSrc;
  const events = { onLoad: () => setLoadedSrc(resourceSrc), onError: () => setFailedSrc(resourceSrc) };
  return (
    <div className="file-preview" aria-busy={!ready && !failed}>
      {!ready && !failed && <LoadingPreview />}
      {failed ? <PreviewError retry={() => setAttempt((n) => n + 1)} /> : output === "pdf" ? (
        <iframe className={`pdf${ready ? "" : " is-loading"}`} title="Receipt PDF" src={resourceSrc} {...events} />
      ) : (
        <img className={ready ? undefined : "is-loading"} alt={alt} src={resourceSrc} {...events} />
      )}
    </div>
  );
}

export default function App() {
  const [status, setStatus] = useState<TransactionStatus>("successful");
  const [currency, setCurrency] = useState<Currency>("GHS");
  const [brandName, setBrandName] = useState(brands[0].name);
  const [output, setOutput] = useState<Output>("web");
  const [attempt, setAttempt] = useState(0);
  const [rendered, setRendered] = useState({ key: "", html: "", failed: false });
  const brand = brands.find((b) => b.name === brandName) ?? brands[0];
  const live = output === "email" || output === "web";
  const slug = brandSlug(brand);
  const base = `${BASE}previews/${slug}/${currency}/${status}`;
  const renderKey = `${base}/${output}/${attempt}`;
  const ready = rendered.key === renderKey;
  const filename = `${slug}-${currency.toLowerCase()}-${status}`;
  const file = output === "email" ? "receipt-email.html" : output === "web" ? "receipt-page.html" : `receipt.${output}`;

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    async function draw() {
      try {
        const [{ render }, { emailReceipt, pageReceipt }] = await Promise.all([
          import("@hyper-elements/react"), import("./receipt/outputs"),
        ]);
        const transaction = inCurrency(sampleTransactions[status], currency);
        const result = await render(output === "email" ? emailReceipt(transaction, brand) : pageReceipt(transaction, brand));
        if (!cancelled) setRendered({ key: renderKey, html: withInter(result.html), failed: false });
      } catch (error) {
        console.error("Receipt preview failed", error);
        if (!cancelled) setRendered({ key: renderKey, html: "", failed: true });
      }
    }
    void draw();
    return () => { cancelled = true; };
  }, [brand, currency, live, output, renderKey, status]);

  return (
    <main className="page" style={{ "--brand": brand.accentColor } as CSSProperties}>
      <div className="column">
        <header className="intro">
          <div className="intro-top">
            <h1>MobiPay<span className="title-dot" aria-hidden="true">.</span></h1>
            <nav className="project-links" aria-label="Project">
              <a href={REPO} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={`${REPO}#readme`} target="_blank" rel="noreferrer">README ↗</a>
            </nav>
          </div>
          <p>One mobile money receipt. Four ways to keep it.</p>
        </header>

        <section className="controls" aria-label="Receipt options">
          <div className="field">
            <span className="field-label" id="format-label">Format</span>
            <div className="segmented" role="group" aria-labelledby="format-label">
              {OUTPUTS.map((o) => (
                <button key={o} type="button" aria-pressed={o === output} onClick={() => setOutput(o)}>{OUTPUT_LABELS[o]}</button>
              ))}
            </div>
          </div>
          <div className="selects">
            <label className="field"><span className="field-label">Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as TransactionStatus)}>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_STYLE[s].label}</option>)}
              </select>
            </label>
            <label className="field"><span className="field-label">Currency</span>
              <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="field brand-field"><span className="field-label">Brand</span>
              <select value={brandName} onChange={(e) => setBrandName(e.target.value)}>
                {brands.map((b) => <option key={b.name}>{b.name}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="preview" aria-label="Receipt preview">
          <div className="preview-toolbar">
            <div><h2>{OUTPUT_LABELS[output]} receipt</h2><span className="preview-origin">{live ? "Rendered live" : "Pre-generated file"}</span></div>
            <div className="download-actions" aria-label="Downloads">
              <a className="action primary" href={`${base}/${file}`} download={`${filename}${output === "email" ? "-email" : ""}.${live ? "html" : output}`}>
                Download {live ? "HTML" : OUTPUT_LABELS[output]} <span aria-hidden="true">↓</span>
              </a>
              {output === "email" && <a className="action" href={`${base}/receipt-email.txt`} download={`${filename}-email.txt`}>Plain text ↓</a>}
            </div>
          </div>
          {output === "pdf" && (
            <p className="pdf-fallback">PDF viewer unavailable or blank? <a href={`${base}/receipt.pdf`} target="_blank" rel="noreferrer">Open the PDF in a new tab ↗</a></p>
          )}
          <div className="sheet" aria-busy={live && !ready}>
            {live ? !ready ? <LoadingPreview /> : rendered.failed ? <PreviewError retry={() => setAttempt((n) => n + 1)} /> : <ReceiptFrame html={rendered.html} /> : (
              <FilePreview key={`${base}/${output}`} output={output} src={`${base}/${file}`} alt={`${brand.name} ${currency} receipt, ${status}`} />
            )}
          </div>
        </section>

        <footer className="demo-footer">
          <p>Built with <a href="https://hyperelements.dev/" target="_blank" rel="noreferrer">Hyper Elements</a>. One shared receipt body renders email, web, PDF and PNG.</p>
          <p>Email and web previews render live. Downloads, PDFs and PNGs are generated from the same sample data in Node.</p>
          <p>Fictional people and brands. This demo does not process payments.</p>
        </footer>
      </div>
    </main>
  );
}
