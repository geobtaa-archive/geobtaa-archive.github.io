import React, { useMemo, useState } from "react";

// Types
type Author = { first?: string; middle?: string; last?: string };

// Helpers ---------------------------------------------------------------
function toInitials(given?: string) {
  if (!given) return "";
  return given
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + ".")
    .join(" ");
}
function normalizeDOIorURL(input?: string) {
  if (!input) return "";
  const s = input.trim();
  return s.startsWith("10.") ? `https://doi.org/${s}` : s;
}
function sentenceCase(str?: string) {
  if (!str) return "";
  const s = str.trim();
  if (s.toUpperCase() === s || s.toLowerCase() === s) {
    const [first, ...rest] = s.split(" ");
    return [
      first.charAt(0).toUpperCase() + first.slice(1).toLowerCase(),
      ...rest.map((w) => w.toLowerCase()),
    ].join(" ");
  }
  return s;
}
function apaAuthor(a: Author) {
  const last = (a.last || "").trim();
  const first = (a.first || "").trim();
  const middle = (a.middle || "").trim();
  const initials = [first, middle].filter(Boolean).map(toInitials).join(" ");
  return last ? `${last}, ${initials}`.trim().replace(/,\s*$/, "") : "";
}
function mlaAuthor(a: Author) {
  const last = (a.last || "").trim();
  const first = (a.first || "").trim();
  const middle = (a.middle || "").trim();
  const given = [first, middle].filter(Boolean).join(" ");
  return last ? `${last}, ${given}`.trim().replace(/,\s*$/, "") : "";
}
function joinAuthors(list: string[], conjWord: string) {
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} ${conjWord} ${list[1]}`;
  return list.slice(0, -1).join(", ") + `, ${conjWord} ` + list[list.length - 1];
}

// Builders --------------------------------------------------------------
function buildAPA(payload: {
  authors: Author[];
  title?: string;
  year?: string;
  version?: string;
  publisher?: string;
  pid?: string;
}) {
  const names = payload.authors.map(apaAuthor).filter(Boolean);
  const authorsStr = joinAuthors(names, "&"); // APA always uses &
  const yr = payload.year ? `(${payload.year}). ` : "";
  const ver = payload.version ? ` (Version ${payload.version})` : "";
  const titlePart = payload.title
    ? `<i>${sentenceCase(payload.title)}</i>${ver} [Data set]. `
    : "";
  const pub = payload.publisher ? `${payload.publisher}. ` : "";
  const link = payload.pid ? normalizeDOIorURL(payload.pid) : "";
  return `${authorsStr}${authorsStr ? ". " : ""}${yr}${titlePart}${pub}${link}`.trim();
}

function buildMLA(payload: {
  authors: Author[];
  title?: string;
  year?: string;
  version?: string;
  publisher?: string;
  pid?: string;
}) {
  let names = payload.authors.map(mlaAuthor).filter(Boolean);
  if (names.length > 2) {
    names = [names[0] + ", et al."];
  } else if (names.length === 2) {
    names = [joinAuthors(names, "and")]; // MLA uses "and" for two authors
  }
  const namesStr = names.join("");
  const ver = payload.version ? `, Version ${payload.version}` : "";
  const titlePart = payload.title ? `<i>${payload.title}</i>${ver}` : "";
  const pub = payload.publisher ? `, ${payload.publisher}` : "";
  const yr = payload.year ? `, ${payload.year}` : "";
  const link = payload.pid ? `, ${normalizeDOIorURL(payload.pid)}` : "";
  return `${namesStr}${namesStr ? ". " : ""}${titlePart}${pub}${yr}${link}.`.replace(/\.?\.$/, ".");
}

export default function DataCitation() {
  const [authors, setAuthors] = useState<Author[]>([{ first: "", middle: "", last: "" }]);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [version, setVersion] = useState("");
  const [publisher, setPublisher] = useState("");
  const [pid, setPid] = useState("");
  const [style, setStyle] = useState<"apa" | "mla">("apa");
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    const payload = { authors, title, year, version, publisher, pid };
    return style === "mla" ? buildMLA(payload) : buildAPA(payload);
  }, [authors, title, year, version, publisher, pid, style]);

  function updateAuthor(idx: number, key: keyof Author, value: string) {
    setAuthors((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  }
  function addAuthor() { setAuthors((prev) => [...prev, { first: "", middle: "", last: "" }]); }
  function removeAuthor(idx: number) { setAuthors((prev) => prev.filter((_, i) => i !== idx)); }
  function clearAuthors() { setAuthors([]); }

  function copyPlainText() {
  const text = html.replace(/<[^>]+>/g, "");
  const doCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        el.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (_) {
      // optional: console.error(_);
    }
  };
  doCopy();
}

  return (
    <div className="dcg-wrap not-content">
      <div className="dcg-grid">
        <section className="dcg-card">
          <h3>Input</h3>

          <div className="dcg-authors">
            <label>Author(s)</label>
                {authors.map((a, i) => (
                  <div className="dcg-author" key={i}>
                    <div className="dcg-author-col">
                      <label>Last</label>
                      <input
                        value={a.last || ""}
                        onChange={(e) => updateAuthor(i, "last", e.target.value)}
                      />
                      {authors.length > 1 && (
                        <button
                          className="dcg-remove"
                          type="button"
                          onClick={() => removeAuthor(i)}
                          aria-label={`Remove author ${i + 1}`}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div>
                      <label>First</label>
                      <input
                        value={a.first || ""}
                        onChange={(e) => updateAuthor(i, "first", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Middle</label>
                      <input
                        value={a.middle || ""}
                        onChange={(e) => updateAuthor(i, "middle", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

            <div className="dcg-toolbar">
              <button className="dcg-btn secondary" type="button" onClick={addAuthor}>+ Add author</button>
            </div>
          </div>

          <label>Dataset title</label>
          <input placeholder="e.g., Urban Tree Canopy, Minneapolis" value={title} onChange={(e) => setTitle(e.target.value)} />

          <div className="dcg-row">
            <div>
              <label>Year of publication</label>
              <input type="number" inputMode="numeric" placeholder="YYYY" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
            <div>
              <label>Version <span className="dcg-muted">(optional)</span></label>
              <input placeholder="e.g., 2.1 or 2025-08" value={version} onChange={(e) => setVersion(e.target.value)} />
            </div>
          </div>

          <div className="dcg-row">
            <div>
              <label>Data publisher</label>
              <input placeholder="e.g., City of Minneapolis" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
            </div>
            <div>
              <label>Persistent identifier or URL</label>
              <input type="url" placeholder="https://doi.org/10.xxxx/xxxxx" value={pid} onChange={(e) => setPid(e.target.value)} />
            </div>
          </div>

          <div className="dcg-row single">
            <div>
              <label>Citation style</label>
              <select value={style} onChange={(e) => setStyle(e.target.value as "apa" | "mla")}>
                <option value="apa">APA</option>
                <option value="mla">MLA</option>
              </select>
            </div>
          </div>

          {/* <p className="dcg-muted">
            APA: authors as <em>Last, F. M.</em> ("&" before the final author); italic title + <em>[Data set]</em>; optional version; DOI/URL.
            MLA: authors as <em>Last, First</em>; italic title; version after title; publisher, year, DOI/URL; “et al.” for 3+ authors.
          </p> */}
        </section>

        <section className="dcg-card">
          <h3>Output <span className="dcg-fmt">{style.toUpperCase()}</span></h3>
          <div className="dcg-output" dangerouslySetInnerHTML={{ __html: html || "Fill the form to see a preview." }} />
          <div className="dcg-copybar">
            <button className={"dcg-btn secondary" + (copied ? " is-copied" : "")} type="button" onClick={copyPlainText} disabled={copied} aria-live="polite">{copied ? "Copied!" : "Copy citation"}</button>
          </div>
        </section>
      </div>

      {/* Styles (scoped with .dcg-wrap to avoid clobbering Starlight UI) */}
      <style>{`
        .dcg-wrap { --card: var(--sl-color-bg); --ink: var(--sl-color-text); --border: var(--sl-color-hairline); --accent: var(--sl-color-primary); }
        .dcg-wrap * { box-sizing: border-box; }

        .dcg-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 1rem; }
        @media (max-width: 960px) { .dcg-grid { grid-template-columns: 1fr; } }

        .dcg-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; }
        .dcg-card h3 { margin: 0 0 .75rem; font-size: 1rem; }

        .dcg-wrap input,
        .dcg-wrap select {
          width: 100%;
          margin: 0;
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: .55rem .65rem;
          font: inherit;
          color: var(--ink);
          background: var(--sl-color-bg);
          height: 2.5rem;
          line-height: 2.5rem;
        }
        .dcg-wrap input:focus,
        .dcg-wrap select:focus { outline: 2px solid color-mix(in oklab, var(--accent) 40%, transparent); outline-offset: 2px; }

        .dcg-row, .dcg-row-3 { display: grid; gap: .75rem; align-items: start; }
        .dcg-row   { grid-template-columns: 1fr 1fr; }
        .dcg-row-3 { grid-template-columns: 1fr 1fr 1fr; }

        .dcg-row > div,
        .dcg-row-3 > div { display: grid; grid-template-rows: auto auto; row-gap: .35rem; align-items: start; align-self: start; }

        .dcg-wrap label { margin: 0 !important; font-weight: 600; font-size: .9rem; display: block; line-height: 1.2; }
        .dcg-row > div > label,
        .dcg-row-3 > div > label { min-height: 2.4em; }

        .dcg-muted { font-weight: 400; }

        .dcg-authors { display: flex; flex-direction: column; gap: .5rem; }

        /* Author row: three columns */
        .dcg-author {
          display: grid;
          grid-template-columns: 1.1fr 1fr 1fr;
          gap: .5rem;
          align-items: start;      /* ✅ top-align all columns */
        }

        /* All author columns: label above input */
        .dcg-author > div {
          display: grid;
          grid-template-rows: auto auto;  /* label, input */
          row-gap: .3rem;
          align-items: start;
        }

        /* The LEFT (Last) column has an extra row for the tiny Remove link */
        .dcg-author-col {
          grid-template-rows: auto auto auto;
        }

        .dcg-author > div > label {
          margin: 0;
          min-height: 1.2em;       /* bump to 1.4–1.6em if you get frequent wrap */
          line-height: 1.2;
        }

        .dcg-remove {
          appearance: none;
          border: none;
          background: transparent;
          color: var(--sl-color-text-accent);
          font-size: .8rem;
          padding: 0;
          width: fit-content;
          cursor: pointer;
          text-decoration: underline;
        }
        .dcg-remove:hover { text-decoration: none; }
        .dcg-remove:focus {
          outline: 2px solid color-mix(in oklab, var(--accent) 40%, transparent);
          outline-offset: 2px;
        }


        .dcg-toolbar { display: flex; gap: .5rem; flex-wrap: wrap; margin: .35rem 0 .5rem; }

        .dcg-btn {
          appearance: none;
          border: 1px solid var(--border); /* thin border */
          background: var(--accent);
          color: var(--sl-color-text-invert);
          border-radius: 999px;
          padding: .5rem .9rem;
          margin-bottom: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color .15s ease, color .15s ease, border-color .15s ease, transform .02s ease;
        }
        .dcg-btn.secondary { background: transparent; color: var(--accent); border-color: var(--accent); }
        .dcg-btn:hover { border-color: var(--accent); }
        .dcg-btn:active { transform: translateY(1px); }
        .dcg-btn[disabled] { opacity: .75; cursor: default; }
        .dcg-btn.is-copied { background: color-mix(in oklab, var(--accent) 18%, white); color: var(--accent); border-color: var(--accent); }
        .dcg-btn.secondary:hover { background: color-mix(in oklab, var(--accent) 12%, transparent); }
        .dcg-btn.ghost { background: transparent; font-size: 12px; font-weight: normal; color: var(--ink); border-color: var(--border); }
        .dcg-actions { display: flex; align-items: end; gap: .5rem; }

        .dcg-output { min-height: 140px; padding: .75rem; border-radius: 8px; border: 1px dashed var(--border); background: color-mix(in oklab, var(--sl-color-bg) 90%, black 10%); color: var(--sl-color-text); }
        .dcg-output i { font-style: italic; }
        .dcg-copybar { display: flex; gap: .5rem; margin-top: .75rem; }
        .dcg-fmt { float: right; font-size: .8rem; opacity: .7; }


        /* --- Field spacing (add at the END of the <style> block) --- */

/* 1) Reset label margins inside the tool */
.dcg-wrap label {
  margin: 0;
}

/* 2) Small gap between any label and the control that immediately follows it */
.dcg-wrap label + input,
.dcg-wrap label + select {
  // margin-top: 0rem;
}

/* 3) Room ABOVE each row of fields */
.dcg-row,
.dcg-row-3 {
  margin-top: 1.5rem;
}

/* 4) Keep columns inside rows tidy and top-aligned */
.dcg-row > div,
.dcg-row-3 > div {
  display: grid;
  grid-template-rows: auto auto;  /* label, control */
  row-gap: 0.3rem;                /* label ↔ control gap */
  align-items: start;
  align-self: start;
}

/* 5) Optional: tighten label block height so it doesn't reserve extra space */
.dcg-row > div > label,
.dcg-row-3 > div > label {
  min-height: 1.2em;   /* bump to 1.4–1.6em if you have frequent 2-line labels */
}

/* If the single “Dataset title” field still feels tight, uncomment this one-off:
.dcg-card > label + input { margin-bottom: 0.5rem; }
*/

      `}</style>
    </div>
  );
}
