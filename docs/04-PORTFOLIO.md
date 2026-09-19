# Page 3: Portfolio

Route `/portfolio`, admin at `/admin/`. Files `public/portfolio/index.html` and `public/admin/*`.

**Job of the page:** show how a virtual PSX portfolio is doing, honestly and with timestamps, and let the EC buy and sell inside it.

**Who reads it:** the public, to see that the society actually trades a book. The EC, in the admin panel, to run it.

## The constraint that shapes the whole page

PSX sends no CORS header, so no page on `fintra.*` can read `dps.psx.com.pk` directly. Verified against the live endpoints while writing this pack:

| Endpoint | Returns | Use here |
|---|---|---|
| `/timeseries/int/KSE100` | 15 second intraday index points | Not needed on this page |
| `/timeseries/eod/KSE100` | Daily KSE-100 history, newest first | The benchmark series for the performance chart |
| `/market-watch` | 495 instrument rows with price, change, volume | The price for every tradeable symbol |

So prices flow one way: a Worker pulls them, stores them, and the browser reads them from FINTRA's own origin.

```
Cloudflare Cron (every 15 min during session hours, 09:30 to 15:30 PKT, Mon to Fri)
  -> Worker fetches dps.psx.com.pk/market-watch and /timeseries/eod/KSE100
  -> writes the snapshot to KV under one key: latest, with as_of and built_at
  -> once per session close, appends one row to value_history (portfolio value, KSE-100 level)
Browser -> GET /api/prices (same origin) -> KV snapshot
```

Two failure rules, both non negotiable:

- The generator fails loudly. A failed pull never overwrites the last good snapshot with zeros.
- Every number rendered carries its `as_of`. If the snapshot is older than 24 hours the page says `Last snapshot <date>, PSX may be closed` and the admin trade ticket refuses to price a trade.

## Tradeable universe

`market-watch` returns 495 instruments. Trading all of them is not a feature, it is a data quality problem. Keep an allowlist of about 40 symbols in `tools/universe.json`, each with its sector, reviewed by the EC once a term.

Verified present on PSX at the time of writing: oil and gas names `OGDC`, `PPL`, `PSO`, `POL`, `APL`, `ATRL`, `PRL`, `NRL`, `PPL`, and ETFs `MZNPETF`, `NBPGETF`, `NITGETF`, `UBLPETF`, `ACIETF`, `JSGBETF`.

The brief mentions buying oil, gold and international stocks. That cannot be taken literally:

- Oil is fine: those are ordinary PSX symbols.
- Gold is not listed on PSX. There is no gold instrument in the 495 row market-watch table. If gold exposure matters, use the precious metals or commodity linked instruments only if the EC names one that actually trades, otherwise drop gold from the product instead of simulating it badly.
- International stocks are not tradable on PSX either. The nearest honest version is a note that the portfolio tracks PSX instruments only.

Open question 6 exists because of this. Decide the universe before writing the buy/sell panel.

## Data model

Five tables, plus KV for the live snapshot. Positions and cash are derived from the trade ledger on every read, never stored, so they cannot drift out of sync with the trades. If the ledger ever passes a few thousand rows, cache the derived totals in a table rebuilt nightly.

```sql
CREATE TABLE members (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT UNIQUE,
  active_from TEXT NOT NULL DEFAULT (date('now'))
);

CREATE TABLE trades (
  id INTEGER PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES members(id),
  side TEXT NOT NULL CHECK (side IN ('BUY','SELL')),
  symbol TEXT NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0),
  price REAL NOT NULL CHECK (price > 0),
  price_as_of TEXT NOT NULL,          -- the snapshot stamp the trade was priced on
  traded_at TEXT NOT NULL DEFAULT (datetime('now')),
  note TEXT
);

CREATE TABLE value_history (
  trade_date TEXT PRIMARY KEY,
  portfolio_value REAL NOT NULL,
  kse100 REAL NOT NULL,
  as_of TEXT NOT NULL
);

CREATE TABLE applications (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT,
  year TEXT NOT NULL, department TEXT NOT NULL,
  answers TEXT NOT NULL,              -- JSON blob of the long answers
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE TABLE research (
  slug TEXT PRIMARY KEY, title TEXT NOT NULL, author TEXT NOT NULL,
  published_on TEXT NOT NULL, summary TEXT NOT NULL,
  file_key TEXT NOT NULL,             -- R2 object key
  status TEXT NOT NULL DEFAULT 'draft'
);
```

Money rules, enforced in code and stated on the page:

- Whole shares only. No fractional positions, no leverage, no shorting.
- A trade prices at the stored snapshot price, and stores that `as_of`. A trade can never be priced from a client supplied number.
- Trades are append only. A mistake is corrected by a reversing trade, never by an edit, and the ledger shows both.
- Cash is a starting balance minus buys plus sells. It lives in one constant, `START_CASH`, in the Worker config, not in the database.

The maths that has to be right, and it is about ten lines: weighted average cost per symbol, realised P/L on a sell against that average, unrealised P/L against the latest snapshot price, and total portfolio value including cash. This is the one piece of logic on the site that gets a test, see below.

## The public page

1. **Header.** `Portfolio`, the current total value, the change since the first trade, and `Prices: Pakistan Stock Exchange, dps.psx.com.pk, snapshot <time> PKT`.
2. **Summary row.** Four figures: total value, cash, invested, unrealised P/L. Mono, tabular figures, direction colours on the P/L only.
3. **Performance chart.** Portfolio value against KSE-100, both indexed to 100 at the first session in `value_history`. One line each, hairline grid, no area fill, no gradient. If there are fewer than five sessions, the chart is replaced by the sentence `Performance chart appears once the portfolio has five sessions of history.`
4. **Holdings table.** Symbol, name, qty, average cost, last, value, unrealised P/L, and percentage of the book. Real `<table>`, right aligned numbers in mono, hairline row lines. Sorted by value.
5. **Trades ledger.** Date, side, symbol, qty, price, and who traded it. Latest first, paginated at 25.
6. **Method note.** Four lines of prose: start date and starting balance, whole shares only, prices are PSX snapshots not live ticks, benchmark is KSE-100. This section is what separates a real tracker from a mock up.

No leaderboards, no "top performer" badges, no confetti, no gamification. It is a book, not a game.

## The admin panel

Behind Cloudflare Access on `/admin/*`, allowlisted to the EC emails. There is no login screen to build. Screens, in this order:

1. **Trade ticket.** Symbol from the allowlist (a `<datalist>`, not a 495 option select), side, qty, then a preview line: `40 × OGDC @ 218.45 = 8,738.00, cash after 41,262.00, snapshot 14:32 PKT`. Confirm is disabled when the snapshot is stale or cash would go negative.
2. **Book.** Current holdings plus cash, with the same numbers the public page shows.
3. **Ledger.** All trades, with a reverse action that creates the correcting entry.
4. **Applications.** The GB form submissions, filterable by status, with an export to CSV.
5. **Research.** Upload a PDF with title, author and date, which writes to R2 and inserts a `research` row in `draft`, plus a publish toggle.

No user management beyond the members table, no roles, no permissions matrix. The EC is the only writer.

## States

- Snapshot missing or stale: banner in micro type, trade ticket disabled with the reason stated, holdings still render from the last good snapshot with the stale stamp.
- Empty book: `No positions yet.` plus the cash figure.
- Zero trades in a symbol after a partial sell: the row disappears, it does not render as `0`.
- Chart with fewer than five sessions: the sentence above, not an empty axis.

## Content needed

1. Decision on the tradeable universe, and whether gold and non PSX exposure are dropped (open question 6).
2. Starting balance and start date for the book.
3. Which EC members may trade.
4. The exact emails for the Cloudflare Access allowlist.

## Acceptance criteria

1. `node tools/portfolio-check.mjs` passes. It is a plain assert script, no framework, covering weighted average cost across two buys, realised P/L on a partial sell, cash after a sequence of trades, and a rejection of a sell larger than the position. Numbers in, numbers out, and it is the thing that fails if the maths breaks.
2. No number renders without its `as_of` on the same block.
3. Pulling the market-watch fetch offline leaves the page rendering the last good snapshot with a stale label, never zeros or an empty table.
4. A trade cannot be submitted from the browser with a client supplied price. Verify by posting a price field to the endpoint and confirming it is ignored.
5. The public page makes no request to `dps.psx.com.pk`. Verify in the network tab.
6. `/admin/*` without the Access cookie returns a redirect, not content, for every admin path including direct API routes.
