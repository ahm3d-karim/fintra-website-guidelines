# FINTRA website build pack

Everything needed to build the FINTRA (LUMS Finance Society) website: one document per page, a
shared design system, and a runnable demo of every page so nobody is guessing what "done" looks like.

Two colours, one red. Paper and a single sampled red (`#C2211B`, taken from the society's own mark).
No second accent, no gradients used as decoration, no shadows.

## Run the demo

```bash
python docs/demo/serve-range.py 8392
# then open http://127.0.0.1:8392/
```

Range support is not optional: without `Accept-Ranges: bytes` the browser never marks the video
seekable and `currentTime` assignments silently do nothing, so the scroll-scrubbed clip sits on its
first frame with no error in the console. `python -m http.server` does not send ranges; this does.
Cloudflare, nginx and S3 all do, so this only bites locally.

Pages: `index.html`, `departments.html`, `portfolio.html`, `apply.html`, `research.html`,
`post.html`, `admin.html`. All of them share `site.css` (tokens and components) and `site.js`
(behaviour). Nothing in `site.js` is page specific, and every page must keep working with both files
untouched.

## What is in here

```
docs/00-START-HERE.md      scope, stack, repo layout, global gates, open questions
docs/01-DESIGN-SYSTEM.md   palette, type, spacing, motion, the clip, the header, copy rules
docs/02-HOME.md            home page
docs/03-DEPARTMENTS.md     departments and the expanding profile cards
docs/04-PORTFOLIO.md       PSX portfolio page and the admin desk
docs/05-GB-APPLICATION.md  General Body application
docs/06-RESEARCH.md        research archive and article pages
docs/07-COMPETITIONS.md    competitions (provisional, confirm it is a page)
docs/demo/                 one runnable demo per page, plus the clip and the dev server
tools/fetch_tape.py        the PSX snapshot fetcher the portfolio page is built on
```

Read `docs/00-START-HERE.md` first, then `docs/01-DESIGN-SYSTEM.md`. The page documents assume both.

## Rules that apply to every page

- **Two colours.** Paper plus `#C2211B`. Neutrals (white, `#F7F4F0`, ink, greys) are not a third
  colour. An element that wants a colour of its own is a bug, not a taste call.
- **Tokens, not values.** Colours, spacing, radii and type come from `:root` in `site.css`. If a
  value is not a token it does not belong in a component.
- **Centred section heads.** Every section opens centred, and every centred `h2` carries the same
  56px red rule under it. That rule is the identity motif: it is the one gesture repeated across
  the site, so do not add a second one.
- **One motion language.** A single staggered entrance reveal (`.rise`, `.d1` to `.d3`) and the
  scroll-scrubbed clip. Nothing pulses, floats or loops, and no element moves on its own.
- **Contrast is measured, never eyeballed.** Body 4.5:1 minimum, large text 3:1, focusable edges
  3:1. The wash alphas in `01-DESIGN-SYSTEM.md` are the values that passed.
- **Copy states facts.** No invented numbers, no fabricated testimonials, no placeholder that reads
  as final. Where content is not decided yet, the section says so or is left out.
- **No work division language anywhere.** The documents describe what each page must do. They never
  assign pages to people.
- **Every page states its own limits.** The footer of each demo names what is a placeholder and
  which states are shown elsewhere. Keep doing that.

## How to build each page

Each section below is the whole job: what the page is for, what to read, what to copy from, what
must be exact, and how to know it is done. The demo is the reference implementation; the document is
the contract. Where they disagree, the document wins and the demo is the bug.

### Home, `/` — `docs/02-HOME.md`, from `docs/demo/index.html`

Say what FINTRA is, what it does and what it stands for, inside the first screen.

- The background clip is fixed for the **whole document**: `.bg { position: fixed; inset: 0 }`,
  `main { position: relative; z-index: 1 }`, and progress is `scrollY / (scrollHeight - innerHeight)`.
  It is not one section's background and it is not a sticky element.
- Copy scrolls normally **over** it. The hero is transparent; every section carrying copy is opaque.
- The clip is desaturated and multiplied into the paper (`filter: grayscale(1)`,
  `mix-blend-mode: multiply`) so it can never introduce a colour. Keep both.
- The hero wash is `rgba(255,255,255,.72)`. That number is measured: at `.62` muted body text falls
  to 4.23:1 over the darkest strip of the clip.
- Adding the clip to other pages is the `.bg` block plus the scrub block in `site.js`, and nothing
  else.

### Departments, `/departments` — `docs/03-DEPARTMENTS.md`, from `docs/demo/departments.html`

Show every department, its people, and each person's job description.

- Cards use `<details>`/`<summary>`, so keyboard and touch work with no script. The script only adds
  hover expansion on fine pointers and keeps one card per department open.
- The expansion animates the real height with `::details-content` and `interpolate-size`; a browser
  without that pair opens instantly, which is correct behaviour, not a fallback bug.
- Card fields: name, role, year, remit, then personal profile, quote, credentials, job description.
- Photographs are repo files, never an upload path: 1:1, 800x800, WebP q78, under 120KB at
  `assets/media/people/<name-slug>.webp`, `alt=""`, with an initials monogram as the fallback. No
  generated portraits, ever.

### Portfolio, `/portfolio` and `/admin/` — `docs/04-PORTFOLIO.md`, from `docs/demo/portfolio.html` and `docs/demo/admin.html`

Track a virtual PSX book and let the EC file trades.

- Positions and cash are derived from the trade ledger on every read. They are never stored, so they
  can never drift from the ledger that the public page prints.
- PSX sends no CORS headers, so every exchange call goes through a Worker in `functions/api/`. The
  snapshot is the source of prices; when it is stale, the page says so.
- The chart is two series and no more: the FINTRA book in red, KSE-100 in ink. Fewer than five
  sessions of history replaces the chart with one sentence, never an empty axis.
- The admin ticket previews the order and states the exact blocked reason (off allowlist, not enough
  cash, not enough shares, stale snapshot) before submit is possible.
- Tables carry an empty state, a stale state and an error state. A table with only the happy path is
  unfinished.

### GB Application, `/apply` — `docs/05-GB-APPLICATION.md`, from `docs/demo/apply.html`

Collect General Body applications, once a year, without losing anyone's answers.

- One centred card, 560px, on the LRS application skeleton: red kicker, centred heading and lede,
  hairline divider with a red tick, fields left-aligned because centred labels over inputs are
  unreadable, then two uppercase buttons.
- Browser validation is a convenience, never the control: the same rules run again on the Worker.
- A rejection never costs the applicant their text. The 100 character minimum on "why this
  department" is real and is enforced in the demo.
- The honeypot field stays off-screen with `tabindex="-1"` and `aria-hidden="true"`.
- After the deadline the form is **absent from the DOM**, and the closed card takes its place
  (`apply.html?closed=1` in the demo). The duplicate email notice and the server error state are
  specced in the document and are not modelled in the demo.

### Research, `/research` and `/research/<slug>` — `docs/06-RESEARCH.md`, from `docs/demo/research.html` and `docs/demo/post.html`

Publish write-ups that a reader can cite.

- The archive is a table with size, author, desk tag and a direct PDF link. Filters are real
  links, not buttons that do nothing.
- Article pages carry a key figures table with a source line per row, the PDF, and a citation line
  in a fixed format. The sample PDF in the demo is a 1.1KB placeholder with a text layer so the
  links return 200; real uploads go to R2 through `functions/api/research.js`.
- An empty filter result says so in one sentence.

### Competitions, `/competitions` — `docs/07-COMPETITIONS.md`

Provisional. Confirm it is a page before building it; the document lists what it would need.

### Adding a page

Copy the closest demo file, keep `site.css` and `site.js` untouched, then add the nav link to
**every** page by hand. There is no template engine here, and a nav item that exists on one page and
not the others is the most common defect in this kind of build.

## How to check the work

```bash
python docs/demo/serve-range.py 8392
```

Then, in the browser console on the page you changed:

```js
// the scrub spans the whole document, start to end
addEventListener('scroll', () => {
  const v = document.querySelector('[data-scrub]');
  console.log(Math.round(scrollY), v.currentTime.toFixed(2));
});
// 0 -> 0.00, bottom -> duration - 0.05, and the fixed layer stays at top 0 the whole way

// the reveal never hides content: one hard jump to the bottom, then count what is still invisible
scrollTo(0, document.documentElement.scrollHeight);
[...document.querySelectorAll('.rise')].filter(e => getComputedStyle(e).opacity < 1).length;  // 0

// no horizontal overflow at any width
document.documentElement.scrollWidth - innerWidth;  // <= 0
```

Contrast over the clip cannot be read from computed styles. Serve the page, screenshot it, and scan a
glyph-free strip of the render (the pack's own numbers were taken this way, at the darkest 1 percent
of the strip).

## Still open

These are content, not code. Build around them and leave the space honest:

1. Logo file (SVG preferred). The red is settled; the vector mark is owed, so the demo uses the
   wordmark as text.
2. Full department list and each department's job description text.
3. Roster data for the people on the departments page, and their photographs.
4. The General Body field list and the application deadline.
5. The tradeable universe for the portfolio allowlist, and who approves research before it publishes.
6. Whether a competitions page exists at all.
