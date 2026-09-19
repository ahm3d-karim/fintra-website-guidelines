# AGENT.md

Instructions for an AI agent working in this repository. Read this before touching anything, then
read `README.md` for the per-page job and `docs/01-DESIGN-SYSTEM.md` for the design contract.

## What this repository is

The build pack for the FINTRA (LUMS Finance Society) website: one document per page, a shared design
system, and a runnable demo page for every document. It is **guidelines plus reference
implementation**, not a starter template. There is no build step, no framework, no package manager
and no test runner, and adding one is a change to the project's shape that nobody asked for.

Source of truth, in order:

1. `docs/01-DESIGN-SYSTEM.md` for tokens, type, spacing, motion, the clip and the header.
2. `docs/0N-*.md` for the page in question: routes, data model, states, acceptance criteria.
3. `docs/demo/*.html` for what the page actually looks like. It is the reference implementation. When
   a demo and a document disagree, the document wins and the demo is the bug.
4. `docs/00-START-HERE.md` for scope, stack and the open questions list.

## Non-negotiables

- **Two colours.** Paper plus `#C2211B`. Neutrals do not count as a third colour. Any element
  wanting its own hue is a defect. The clip is desaturated and multiplied into the paper
  (`filter: grayscale(1)`, `mix-blend-mode: multiply`) precisely so it cannot introduce colour.
- **Tokens only.** Colours, spacing, radius and type come from `:root` in `docs/demo/site.css`. If a
  value is not a token, the component does not get to invent it.
- **Contrast is measured against rendered pixels, never estimated.** Body 4.5:1, large text 3:1,
  meaningful edges 3:1. Computed styles cannot see a video or a gradient behind text, so serve the
  page, screenshot it, and scan a glyph-free strip of the render.
- **No fabricated content.** No invented statistics, testimonials, names, prices or deadlines. A
  placeholder is written as a placeholder and labelled visibly. If content is undecided, the section
  either says so or does not exist yet.
- **No work-division language anywhere.** The documents say what a page must do. They never say who
  builds it. This applies to code comments, commit messages and anything you add.
- **Do not restructure the shell.** Every page shares `site.css` and `site.js`, and nothing in
  `site.js` is page specific. A fix that only works on one page is in the wrong place.

## Run it

```bash
python docs/demo/serve-range.py 8392     # then open http://127.0.0.1:8392/
```

`python -m http.server` is not a substitute: it sends no `Accept-Ranges`, so the video is never
seekable and `currentTime` assignments fail silently with no console error. The dev server also
sends `Cache-Control: no-store`; without it the browser heuristically reuses a page and you will
"verify" pre-edit markup. If you drive a browser over CDP, set `Network.setCacheDisabled` as well.

## Verify, do not assert

Run these against the page you changed before reporting anything.

```js
// 1. The clip spans the whole document and the layer is fixed for all of it
addEventListener('scroll', () => { const v = document.querySelector('[data-scrub]');
  console.log(Math.round(scrollY), v.currentTime.toFixed(2),
              Math.round(document.querySelector('.bg').getBoundingClientRect().top)); });
// 0 -> 0.00, bottom -> duration minus ~0.05, fixed layer top 0 at every step

// 2. The reveal can never hide content: one hard jump, then count what is still invisible
scrollTo(0, document.documentElement.scrollHeight);
[...document.querySelectorAll('.rise')].filter(e => getComputedStyle(e).opacity < 1).length;   // 0

// 3. Layout holds at 390px as well as desktop
document.documentElement.scrollWidth - innerWidth;    // <= 0 at both widths

// 4. Keyboard: tab through the page, every control takes a visible 2px red focus ring
```

Also check: no console errors, `?closed=1` on the application page, `?stale=1` on the admin page,
the form's minimum-length rule keeping the applicant's text on failure, and the empty state of any
table you touched. A UI that has only been looked at has not been verified.

## Pitfalls already paid for

- **`IntersectionObserver` entrance reveals can hide content permanently.** It reports intersection
  *changes*, so one jump from below the viewport to above it produces no callback and the block sits
  at `opacity: 0` for the session. The demo uses a pending list filtered on a `requestAnimationFrame`
  scroll pass. Do the same.
- **A stagger delay inside a `transition` shorthand gets reset.** `.in` setting `transition` resets
  `transition-delay` to `0s` and outranks a separate `transition-delay` rule. Carry the delay in a
  custom property (`--d`) inside the shorthand.
- **Animating `<details>` needs no measuring script**: `interpolate-size: allow-keywords` plus
  `::details-content` with `block-size: 0 -> auto` and `content-visibility` in `allow-discrete`.
  Sample the height across frames to check it: a rect read immediately after `click()` still shows
  the closed height, and a rect on an element inside a closed panel returns its stale size forever.
- **Reduced-motion `*{transition-duration:.01ms}` does not reach pseudo-elements.** Name them
  (`::before`, `::after`, `*::details-content`) or the animated panel keeps its transition for users
  who asked for none.
- **A second instance of the dev server used to be able to bind the same port and shadow the first**
  (stdlib `allow_reuse_address`), which reads as a server serving stale files. The flag is now off so
  a second start fails loudly. If a port is held, find the owner and kill it rather than starting
  another.
- **`.gitignore` patterns without a leading slash match at every depth.** `/index.html` is the root
  draft site; `index.html` would silently ignore `docs/demo/index.html`.

## Definition of done

Report a PASS/FAIL gate with evidence, not adjectives. All four blocks must pass before you call
anything finished:

1. **Hard gate**: no em dash in copy, no overflow or clipping at 390px and desktop, no unsourced
   statistics or fabricated people, every link and control has a real destination or a visible
   "pending" label, contrast measured and passing, keyboard operable with a visible focus ring, every
   state (empty, loading, error, stale) present, and everything exercised in a browser.
2. **Technique gate**: every non-obvious choice (the wash, the motif, the grayscale multiply, a
   mono face, an animation) has a written one-line reason in `docs/01-DESIGN-SYSTEM.md` or in the
   CSS comment above it. No decoration without a job.
3. **Liveliness**: one focal point per screen, whitespace structural, exactly one accent, the red
   rule as the single repeated motif, and motion that matches the declared dials.
4. **Craft**: palette is two colours plus neutrals, radius is 2px on controls and 0 elsewhere,
   CTAs name the action, and the result does not read as a clone of another product.

## Commits

Commit as `Ahmad Karim <28020258@lums.edu.pk>`. Keep messages plain and specific: what changed and
why, in the imperative, one line if it fits. Never a build or bot identity.
