# Page 1: Home

Route `/`. One file, `public/index.html`.

**Job of the page:** in one screenful, say what FINTRA is, what it does and what it stands for, and give the reader the one action they came for.

**Who reads it:** a first year deciding whether to apply, a recruiter or sponsor checking whether the society is real, a member showing the site to family.

## Sections, in order

### 1. Hero with the scroll driven video

One fixed layer covers the viewport for the entire document, not for this section: the clip opens on the first screen and reaches its final frame as the reader hits the bottom of the page. Home is the only page that carries it. The opacity, the encode and the script are in `01-DESIGN-SYSTEM.md`.

Readability is structural, not a matter of taste: every section on this page that carries body copy sits under `--scrim`, so the clip stays visible behind the text without the text sitting on raw footage. The alpha is measured in `01-DESIGN-SYSTEM.md`, and the lever if the clip should read louder is the body text colour, not the alpha. Only the hero and one mid-page statement band drop the scrim, and neither holds body copy.

Content over it, nothing else:

- Wordmark (text if no SVG exists yet).
- One line, the society's own words: `Pakistan's largest student-run finance club.` Taken from FINTRA's public bio. Do not rewrite it into something longer.
- One primary action. `Apply for GB` when applications are open, `See departments` when they are not. One action, not two buttons side by side.
- A 12px scroll hint is allowed once: the word `Scroll`. No bouncing arrow icon.

The video spec, encode commands and fallback ladder are in `01-DESIGN-SYSTEM.md`. The poster frame paints first and the page never waits for the clip.

### 2. What FINTRA is

Two columns on desktop, stacked on mobile. Left: a section title and one prose paragraph of 40 to 70 words, from the society's own description. Right: a definition list of four facts with real values, for example founded year (2016, from the society's LinkedIn page), campuses or chapters, membership count, and the number of events run to date.

No mission statement paragraph written in abstractions. If a fact is not known, the row is a visible `[needs content]` box, not a guess.

### 3. What it does

The society's actual work, three to five items, each one line of title plus one line of plain description, each linking to the page that proves it:

| Item | Links to |
|---|---|
| Competitions and market simulations | `/competitions` |
| Research and market write ups | `/research` |
| Virtual PSX portfolio | `/portfolio` |
| Departments and teams | `/departments` |

This is the only place on the site where links to the other four pages are collected. Keep it a row table, not a card grid.

### 4. What it stands for

Three short statements maximum, in plain words, one sentence each. This section is where generated sites go wrong: no "our core values are integrity, excellence and innovation" triptych with three identical icons. Write what the society actually does differently, and if there is nothing specific to say, cut the section rather than fill it.

### 5. Numbers

One row, up to four figures, only with verified numbers: GB members, events held, participants reached, universities represented. Numbers in the mono with tabular figures. No counters that animate on scroll.

Leave the row out entirely until the numbers come from the society. A row of `[needs content]` boxes looks worse than no row.

### 6. Market strip

Optional and already built: `data/kse100.js` from `tools/fetch_tape.py`, rendered by `js/tape.js`. Keep it if it survives the redesign, because it is the one element that is unmistakably a finance society and it is real data.

If kept: it is a strip, not a hero. Micro type, `Pakistan Stock Exchange, dps.psx.com.pk` and the snapshot time in PKT beside it, and the page shows the no-data notice rather than stale numbers when the snapshot is missing.

### 7. Footer

Wordmark, one line about the society, social links with text labels, a contact address (open question 9), and `Designed and built by the FINTRA web team` with the year. No newsletter form, no "coming soon", no sponsored-by logo wall.

## Components used

Page header is not used here. Panel for the numbers row, row table for "what it does", data block for the market strip.

## Motion on this page

The video scrub, the 120ms hover and focus transitions, the shared `.rise` stagger on the hero and on each section block (contract in `01-DESIGN-SYSTEM.md`), and one optional `Scroll` hint. No parallax, no animated counters. The hero is one step, not three: a hero that stages itself in while the clip is already moving reads as slow.

## States

- Video not loaded: poster frame, page fully readable.
- Reduced motion: poster frame, static.
- Under 768px: poster frame, no scrub.
- Market snapshot missing: no-data notice in place of the strip, rest of the page unaffected.
- Applications closed: the hero action changes to `See departments`, no dead button.

## Content needed

1. The society description in its own words, 40 to 70 words.
2. Four facts for the definition list, with sources.
3. The three to five work items and where each links.
3b. Photographs for the home page, if any are used, with the same framing and consent rules as the roster.
4. The three value statements, or a decision to cut the section.
5. Verified numbers, or a decision to omit the row.
6. Video clip plus poster frame, or a decision to ship a photograph instead.
7. The `Scroll` hint: keep or cut.

## Acceptance criteria

1. Opening the page shows the wordmark and the main line before any video byte arrives. Verify by throttling to slow 3G and watching first paint.
2. Scrubbing forwards and backwards moves the clip and never flashes black. Verify by scrolling down and back up slowly on a real device, not only in a desktop browser.
3. `prefers-reduced-motion: reduce` in devtools shows the poster frame, no video element playing.
4. At 390px width there is no horizontal scrollbar and no video data is requested.
5. Hero text passes 4.5:1 against the darkest and lightest frame of the video, measured on the composited screenshot, not on the token.
6. Keyboard tab order from the top: wordmark, hero action, then sections in document order. Focus is always visible.
7. Every claim on the page has a source or is cut.
8. The video layer covers the whole document: its `getBoundingClientRect().top` reads 0 at the top, in the middle and at the bottom of the page. Verify by measuring, not by eye.
9. The clip reaches its final frame at the bottom of the page and returns to its first frame at the top. Verify by comparing `currentTime` against `scrollY / (scrollHeight - innerHeight)` at five positions, scrolling down and back up.
10. Body text still passes 4.5:1 over the brightest frame of the clip. Verify on pixels taken from the served page, not by eye and not from the alpha's arithmetic.
11. The clip is visible behind the reading sections, not only behind the hero. Verify by comparing a section's background pixel against a flat `--field` patch at the same scroll position: they differ, and by roughly the transmission amount.
12. Hero and statement band are the only sections without the scrim, and neither holds body copy.
13. Space bar, Page Down, a wheel, a trackpad and a scrollbar drag all move the page normally, and the scrollbar thumb length is the same whether or not the video loaded.
