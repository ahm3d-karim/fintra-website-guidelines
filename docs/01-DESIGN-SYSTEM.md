# Design system

One stylesheet, tokens in `:root`, no framework. If a value here is not a token, it does not belong in a component.

## Palette

Two colours: paper, and one red. The red is sampled from FINTRA's own mark on LinkedIn rather than invented: the deep reds in it average `#C02B20`, the cleanest samples run to `#D81C0C`, and `#C2211B` is the midpoint. It holds 5.7:1 on paper.

Paper and the greys are neutrals, so they are not a third colour. Light, not dark: a society site is read in daylight on a phone, and dark would have been an unearned default.

| Token | Value | Use |
|---|---|---|
| `--field` | `#FFFFFF` | Page background |
| `--band` | `#F7F4F0` | Warm neutral: notice fills, table row hover |
| `--ink` | `#14110F` | Headings and body. 18.8:1 on paper |
| `--muted` | `#6B6560` | Secondary text, captions, table meta. 5.78:1 on paper, and 4.60:1 over the darkest strip of the clip behind the hero |
| `--red` | `#C2211B` | The one colour: primary buttons, focus ring, active nav underline, links, the rule under every section heading, losses. Nothing else |
| `--line` | `rgba(20,17,15,0.12)` | Hairline borders. 1px, never a shadow |
| `--line-strong` | `#8A8480` | Borders that carry meaning: inputs, secondary buttons, focusable edges. Measured 3.66:1 on paper, which is what the 3:1 rule actually governs |
| `--hero-wash` | `rgba(255,255,255,0.72)` | The layer between the clip and the hero copy |
| `--scrim` | `rgba(255,255,255,0.92)` | The layer between the clip and any section carrying copy |
| `--up` | `--ink` | Gains read in ink, losses in red. Two colours, and it happens to be the finance convention |

The clip is desaturated and multiplied into the paper (`filter: grayscale(1)`, `mix-blend-mode: multiply`). Reason: a colour clip on a paper page puts a third and fourth colour on screen and breaks the palette, and multiply lets the paper read through the dark parts of the frame instead of pasting a rectangle over it.

Wash alphas are measured off rendered pixels, not picked:

| Layer | Darkest 1 percent of the measured strip | `--muted` on it | `--red` on it | `--ink` on it |
|---|---|---|---|---|
| Hero, 0.72 wash | `rgb(230,230,230)` | 4.60 | 4.77 | 15.07 |
| Reading section, 0.92 scrim | `rgb(246,246,246)` | 5.32 | 5.51 | 17.40 |
| Nav at the top, 0.82 wash | `rgb(213,213,213)` | 3.91 | 4.06 | 12.81 |

The nav is the one case that does not clear 4.5:1 for muted, which is why the bar's links are `--ink` while it is transparent and only return to `--muted` once it goes solid over paper.

Rules:

- Two colours. An element that wants a third is a bug, not a taste call.
- `--up` and `--down` are data, not mood. They appear on numbers and nowhere else.
- No gradients, no glow, no blur, no drop shadows. Depth comes from a hairline. The single exception is the white wash behind the transparent nav, and it exists to hold contrast over the clip, not to decorate.
- Radius: 2px on inputs and buttons, 0 on cards and tables. Nothing is pill shaped.
- Contrast is verified against rendered pixels of the actual composite, never estimated by eye. Body at least 4.5:1, large text at least 3:1, focus ring at least 3:1. The 3:1 non text rule applies to boundaries that carry meaning: input borders, secondary buttons, focus rings, chart strokes. A hairline between two sections is exempt, because WCAG scopes non text contrast to elements whose boundary is information.

## Type

Two families, both self hosted in `assets/fonts` as woff2, subset to Latin. The demo ships the system stack (no network request, first paint lands immediately); self hosting is a build step, not a design decision.

| Role | Family | Notes |
|---|---|---|
| Text | One grotesque (Inter, or the closest face FINTRA already uses) | Weights 400 and 500 only |
| Numbers | One mono (IBM Plex Mono, Berkeley Mono if licensed) | `font-variant-numeric: tabular-nums`, always. A board aligns digits in columns and proportional digits break that alignment in every table |

Scale, desktop, fluid via `clamp()`:

| Step | Size | Line height | Tracking | Use |
|---|---|---|---|---|
| Display | `clamp(40px, 8vw, 104px)` | 0.95 | `-0.025em` | Home hero line, uppercase |
| Page title | `clamp(30px, 5vw, 64px)` | 1.02 | `-0.02em` | One per page |
| Section title | `clamp(22px, 2.6vw, 36px)` | 1.15 | `-0.015em` | Section headings, uppercase |
| Body | 16px | 1.6 | 0 | Prose |
| Small | 14px | 1.5 | 0 | Table cells, captions |
| Micro | 12px | 1.4 | `0.06em`, uppercase | Labels, `as_of` stamps, table headers |

Weight 500 for headings, 400 for everything else. No 700, no 900, no italic headlines.

Type is the loudest thing on the page, and the display step is where the confidence sits. Two measured references disagree and both are right: Apple's MacBook Air hero headline is 28px on a 625px viewport, while Initiate Consulting's is 102.4px on 1264, which is 8.1vw at 0.92 line height and `-0.025em` tracking. This pack takes the Initiate register for the display step and leaves prose at 16px. A 16px paragraph under a 100px headline is the whole effect; the same paragraph under a small headline is just small.

## Space and rhythm

Negative space is the design. Numbers to hold to:

| Token | Value |
|---|---|
| Base unit | 8px |
| Section padding, desktop | `clamp(88px, 11vw, 160px)` top and bottom |
| Section padding, mobile | 64px |
| Gap between a heading and the block it introduces | 24px |
| Gap between blocks in one section | 56px desktop, 32px mobile |
| Prose column | 640px maximum, nothing wider |
| Page gutter | `clamp(24px, 8.5vw, 108px)` left and right, with the content anchored inside it rather than centred |
| Content column | 966px maximum, which is 77 percent of a 1250px viewport |
| Header height | 56px of padding box, transparent, sitting on the hero rather than above it |
| Card padding | 28px desktop, 20px mobile |
| Card gap | 24px |

Two measured references. Linear: 128px of section padding top and bottom on a 1364px container with a 64px headline. Initiate Consulting: 96px of section padding, a 108px left inset on a 1249px viewport, a 966px content column, and eight viewport tall sections across a 7489px page. What they share is the register: one idea per screenful, then a lot of air, with the column anchored left in a wide inset instead of centred.

Each page uses at most four distinct section compositions. Repeating one composition four times is a table, and a table should be a table.

## Components

Build only these. A new pattern has to replace one of them, not join them.

**Page header.** Title, one line of plain description, optional meta row. No breadcrumbs, no eyebrow label, no badge.

**Panel.** `--panel` background, 1px `--line` border, 0 radius, 28px padding. Sitting over the background clip, use `--veil` instead of `--panel` so the clip reads through the card.

**Data block.** The number, its label, its direction colour if it is a price, and an `as_of` line in micro type. Rule: a number with no timestamp is a lie on a market page.

**Row table.** For lists with unequal detail: events, research posts, positions. Real `<table>` on desktop with 1px row lines, stacked definition list on mobile. No card grid of identical tiles.

**Hover expand profile card.** Departments page, spec in `03-DEPARTMENTS.md`.

**Portrait.** Square 1:1 box, `aspect-ratio: 1`, `object-fit: cover`, initials monogram underneath so a missing or failed image degrades in place. `alt=""` whenever the name is adjacent text. Spec in `03-DEPARTMENTS.md`.

**Field.** Label above input, 1px border, 2px radius, 44px minimum height, error text below in `--down`. Native controls where they exist: `<input type="date">`, `<select>`.

**Button.** Two variants only. Primary: `--accent` fill, field coloured label. Secondary: transparent, 1px `--line` border. 44px minimum height, 16px horizontal padding. No third variant, no ghost button, no icon button without a text label.

**Empty and error state.** One sentence saying what is missing or what failed, plus the action that fixes it. No illustration, no emoji, no mascot.

## Motion

Default is none apart from the entrance below. Hover and focus transitions at 120ms, `ease-out`, on colour and border only. No parallax on content, no marquee, no motion tied to scroll position other than the clip.

The background video, which is driven by scroll position, is a deliberate device and not a licence for motion elsewhere.

### The one entrance motion

A one shot staggered rise per block: 12px up, `opacity` 0 to 1, 500ms `ease-out`, 60ms between siblings, capped at three steps. It never re-runs, never reverses on scroll up, and never tracks scroll position.

```css
.js .rise { opacity:0; transform: translateY(12px); }
.js .rise.in { opacity:1; transform:none;
               transition: opacity .5s ease-out var(--d,0s), transform .5s ease-out var(--d,0s); }
.rise.d1 { --d:.06s } .rise.d2 { --d:.12s } .rise.d3 { --d:.18s }
@media (prefers-reduced-motion: reduce) { .js .rise { opacity:1; transform:none; } }
```

```js
// assets/js/reveal.js
const pending = [...document.querySelectorAll('.rise')];
let raf = 0;
const pass = () => {
  raf = 0;
  for (let i = pending.length - 1; i >= 0; i--) {
    if (pending[i].getBoundingClientRect().top < innerHeight * 0.9) {
      pending[i].classList.add('in');
      pending.splice(i, 1);
    }
  }
  if (!pending.length) removeEventListener('scroll', onScroll);
};
const onScroll = () => { if (!raf) raf = requestAnimationFrame(pass); };
addEventListener('scroll', onScroll, { passive: true });
pass();
```

Three rules keep it from fighting the clip:

1. `.js` is set by one inline script in `<head>`. Without it nothing is ever hidden, so a JS failure leaves the page readable instead of blank. Never put the hidden state on `.rise` alone.
2. Only `opacity` and `transform` animate, each element is revealed once and then dropped from the list. Those two properties composite without layout, and the clip behind them is decoding on every scroll frame, so nothing else gets added to that budget.
2b. `IntersectionObserver` is the obvious tool and it is the wrong one here. It reports changes in intersection state, so a single jump that carries an element from below the viewport to above it produces no callback at all, and that element stays at `opacity: 0` for the rest of the session. A deep link, a scrollbar drag, a restored scroll position or one hard flick on a phone all do this. The reveal instead filters a shrinking list of pending elements on the scroll frame, and the listener removes itself once the list is empty, so the cost ends when the page is revealed. The same jump cannot lose an element, because the check is "is it on screen or above it" rather than "did its state change".
3. Three steps, 180ms of stagger at most. Deeper staging turns a six block page into a 1.5 second entrance, which reads as theatre next to a video that is already moving.

Applies to: page titles, section titles, paragraph blocks, cards, table rows. One `.rise` per element, then `d1` to `d3` on the siblings following it.

## Reference: initiate.lums.edu.pk, measured

Read element by element rather than looked at, on a 1249px viewport.

| What it does | Measured |
|---|---|
| Palette | Field `#150A24`, footer `#0B0518`, ink `#F6EFF8` (white tinted toward the brand hue, not neutral), accent `#5A0A74` |
| Display type | Archivo Black, uppercase, 102.4px at `-0.025em`, line height 0.92 |
| Section titles | 56px at `-0.015em`, uppercase |
| Prose | DM Sans 16px, line height 1.62 |
| Accent faces | EB Garamond for card titles, a script face once per page for the tagline |
| Layout | 108px left inset on 1249, content column 966px (77 percent), sections 100vh minimum with 96px padding, home page 7489px tall across 8 sections |
| Card | 261px wide, 38px padding, `rgba(26,11,43,0.72)` panel so the background reads through it, 1px `rgba(227,210,233,0.16)` border, 3px radius |
| Nav | Seven items in a transparent header that sits on the hero, plus a skip link |
| Assets | 14 images, 12 of them lazy loaded, 1 video, 4 inline SVGs, no iframes |

Taken: the display scale, the left anchored column inside a wide inset, the translucent panel so the clip reads through content, the skip link, and micro type for eyebrow labels. Their card veil was re measured against our own layer stack: a veil anywhere from 0.45 to 0.86 still holds 7.1:1 for `--muted`, so ours sits at 0.60 and costs nothing.

Not taken: the violet palette, and five font families served from one Google Fonts request (this pack self hosts two, plus at most one accent face).

Taken but narrowed: their staggered reveals. They are generous there because nothing else on that page moves. Ours runs a clip behind the whole document, so ours is a one shot 12px rise, 60ms apart, capped at three steps rather than per element as it arrives. Contract is under Motion above.

One line in a script face for the tagline is the cheapest human note on that site. Allowed once per page, never for a heading, never for body copy.

### The scroll driven video

The brief for Gemini or Higgsfield, and the reason each line exists:

| Spec | Value | Why |
|---|---|---|
| Length | 12 to 16 seconds | The clip is stretched over the whole document. At six to eight screens that is two to three seconds of clip per screen, so a short clip runs out of movement halfway down. |
| Resolution | 1920x1080, 24 or 30 fps | Higher resolution makes seeking stutter, measured. This is enough for a background at 40 percent opacity. |
| Camera | One slow continuous move: a dolly in, a slow push across a desk, or a rising shot | Scrubbing runs the clip backwards. A clip with a story or a cut looks broken in reverse. |
| Cuts | None | Same reason. |
| Audio | None. Strip it at encode. | It cannot autoplay with sound, and it is a background. |
| Text and logos | None in frame | Text in the video fights the page headline and cannot be kept sharp while seeking |
| Brightness | First and last frames at similar luminance | The loop back to the top must not flash |
| Content | Trading floor, market board, paper and pen on a dark desk, city skyline at night. Anything that reads as finance without being literal finance clip art | Proposal. The subject is yours to pick |

Encode twice from the source. Both commands were run on this machine and the keyframe counts are from `ffprobe`, not from the manual:

```bash
# H.264, dense keyframes so seeking does not stutter
ffmpeg -i source.mp4 -an -c:v libx264 -crf 23 -preset slow \
  -g 8 -keyint_min 8 -sc_threshold 0 -pix_fmt yuv420p \
  -movflags +faststart assets/media/hero.mp4

# VP9 for browsers that prefer it
ffmpeg -i source.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 35 -g 8 -row-mt 1 \
  assets/media/hero.webm
```

Measured on a 4 second 30fps test clip: the dense setting produced 15 keyframes against 1 for a default encode, at 90,126 bytes against 29,038. Dense keyframes cost roughly three times the bytes, and that is the trade: seeking is fast because the decoder never has to decode far from a keyframe. Real sizes for a 12 second clip are in the table under How long the clip should be. Never buy bytes back by dropping the dense flags: raise `-crf`, drop to 720p, or shorten the clip.

Also export a poster frame, `assets/media/hero-poster.jpg`, from the middle of the clip and compress it to about 120KB. It is what paints before the video and what stands in when motion is off.

Implementation, one file, no library, and nothing to size. The video is a single fixed layer behind the whole document, and the page content is normal flow above it. There is no range element, no sticky, no negative margins and no per-section wiring: add a section anywhere and the clip covers it.

```css
.bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; }        /* the whole page, not one section */
.bg video { width: 100%; height: 100%; object-fit: cover; opacity: .42; display: block; }
main { position: relative; z-index: 1; }                                /* normal flow, above the video */
main section { background: var(--scrim); }                               /* clip stays visible, text stays readable */
main section.hero, main section.band { background: transparent; }        /* clip at full strength: no body copy here */
```

```js
// assets/js/scrub.js: playback driven by scroll position
const v = document.querySelector('[data-scrub]');
if (v && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let target = 0, t = 0, raf = 0, queued = false;
  const progress = () => {                        // 0 at the top of the document, 1 at the bottom
    const max = document.documentElement.scrollHeight - innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  };
  // ease the seek over roughly 150ms so one wheel notch reads as a fast glide, not a cut
  const tick = () => {
    t += (target - t) * 0.18;
    if (Math.abs(target - t) < 0.01) t = target;
    if (v.readyState >= 2) v.currentTime = t;
    raf = Math.abs(target - t) > 0.01 ? requestAnimationFrame(tick) : 0;
  };
  const paint = () => {
    queued = false;
    if (v.readyState >= 2 && v.duration) {
      target = progress() * (v.duration - 0.05);
      if (!raf) { t = v.currentTime; raf = requestAnimationFrame(tick); }
    }
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(paint); } }, { passive: true });
  addEventListener('resize', paint);              // a resize changes the page height, so it changes the mapping
  v.addEventListener('loadeddata', paint);
  paint();
}
```

Markup it expects, and this is all of it: a `div.bg` holding the video with `muted playsinline preload="metadata"` and `poster="/assets/media/hero-poster.jpg"`, then the page content inside one `<main>`. The fixed layer covers the viewport for the whole document, so the clip opens on the first screen and reaches its final frame as the reader hits the bottom of the page, with no section boundary to cross.

### The scrim, and where its alpha comes from

Sections carrying copy sit under the scrim, so the clip stays visible behind reading content without the text sitting on raw footage. The alpha is measured, not picked. Composite the scrim over the brightest pixel of the clip, then check both text colours against the result:

| Scrim alpha | Composited background | Body copy `--muted` | Headings `--ink` |
|---|---|---|---|
| 0.80 | `#3C3E10` | 4.49:1 fails | 10.16:1 |
| 0.85 | `#303211` | 5.33:1 | 12.06:1 |
| 0.86 | `#2E3011` | 5.48:1 | 12.40:1 |
| 0.90 | `#242712` | 6.17:1 | 13.96:1 |

Measured against the brightest pixel across five frames of a saturated test clip, `rgb(253,244,0)` at relative luminance 0.856, which is a harsher case than real footage. The floor is set by `--muted` body copy rather than by headings: muted fails 4.5:1 at 0.80 and clears it at 0.85, so the token is 0.86, a small margin above the floor. Headings would pass at 0.80, which is why the scrim looks heavier than the text needs.

If the clip should read louder behind copy, the lever is the text colour, not the alpha: body copy moves from `--muted` to `--ink` and the alpha can drop to 0.80. Do not lower the alpha while the body stays muted.

Verified on rendered pixels, not on the arithmetic: with the scrim at 0.86, a flat region of the clip (`rgb(114,19,12)`) composites to `rgb(26,17,19)` in a screenshot, which is what `0.14 x 114 + 0.86 x 12` predicts. The video is confirmed to reach sections that carry copy, not only the hero. Only the hero and a statement band drop the scrim, and neither holds body copy.

Net transmission in a copy section is the video's opacity times the scrim, so at 0.42 opacity and 0.86 scrim about 6 percent of the clip arrives. That reads as a faint tint behind prose, not as footage: measured, a `rgb(114,19,12)` region of the clip lands at `rgb(26,17,19)`. The clip is read as footage in the hero, in the statement band and between sections. If it should read as footage behind prose as well, the change is less copy, not a lower scrim, because a lower scrim is a lower contrast floor on that prose.

## How long the clip should be

The clip is stretched over the whole document, so its length alone sets the pace. Seconds per screen is `duration / screens`, and two to three seconds per screen feels deliberate rather than sluggish. The home page runs six to eight screens, so the brief is a 12 to 16 second clip. A five second clip on a long page is finished before the reader reaches the second section.

Measured on this machine: 12 seconds, 30fps, dense keyframes, synthetic test pattern.

| Encode | Size | Note |
|---|---|---|
| 1920x1080, crf 23, preset slow | 9.68 MB | The spec resolution, and heavier than a dimmed background needs to be |
| 1920x1080, crf 26 | 6.87 MB | 29 percent smaller, no visible difference behind an overlay |
| 1280x720, crf 23 | 4.95 MB | Recommended for a full page background, at half the bytes |

Recommendation: 720p for the fixed page background, because the clip is on screen the whole time and the reader sees it through a 42 percent overlay. Ship 1080p only if a section ever shows the clip at full opacity. Both are far inside the host's per file limit, so the reason to care is the reader's data, not the server's.

Pace measured in `docs/demo/index.html` with a 12 second clip on a 3.6 screen page: 0, 25, 50, 75 and 100 percent of the document put the clip at 0, 2.98, 5.97, 8.96 and 11.95 seconds, and one 120px wheel notch moves it about 0.64 seconds. A longer page with the same clip gives slower motion, which is the whole tuning knob. The eased seek stays regardless, because one trackpad flick can still cross several hundred pixels in a frame.

Readability is structural rather than a matter of taste: every section carrying copy sits under the scrim, so text never touches raw footage. The clip is read at full strength only in the hero and the statement band, and both carry display type at 20px or larger.

Runnable proof ships with this pack, one demo per page in `docs/demo/`: `index.html` (the whole page scrub), `departments.html`, `portfolio.html`, `apply.html`, `research.html`, `post.html`, `admin.html`. They share `site.css` (the tokens above, so a token change moves every page at once) and `site.js` (reveal, card expansion, counts). The clip built with the commands above ships as `hero.mp4` with its `hero-poster.jpg` (the `.webm` alternate is built by the same command and is not committed, see the repo README), and `serve-range.py` serves the directory with range support. Open it and scroll: the copy moves as normal text does, the clip follows the scroll, and the next section arrives before the reader runs out of page.

**The header.** One bar, two states, no other variant. At the top of the document it is fixed and transparent, with a `linear-gradient(180deg, rgba(255,255,255,.82), rgba(255,255,255,0))` wash behind it, and its links at `--ink`. Past 24px of scroll it takes `rgba(255,255,255,.94)`, a `--line` bottom border and its links return to `--muted` except the last one, which stays red because it is the action. Measured on rendered pixels over the clip: ink links on the wash hold 12.81:1 at the darkest 1 percent and muted would hold 3.91:1, which is why the transparent state does not use muted. A transparent header that fails contrast is a bug, not a style. The bar's own height is measured into `--hdr` and `main` is offset by it, so a nav that wraps to two lines on a phone pushes the first section down instead of covering it.

**The one thing that silently breaks it:** the server has to answer with `Accept-Ranges: bytes`. Serving the file from a server that ignores range requests (plain `python -m http.server` does) leaves the browser reporting the video as unseekable, and `currentTime` assignments then do nothing at all: no error, no movement, the clip just sits on its first frame. Cloudflare, nginx and S3 all send ranges, so this only bites while testing locally. If it does bite, `python docs/demo/serve-range.py 8391` is a range-capable server for the demo folder.

Before calling the hero done, check the encode as well:

```bash
ffprobe -loglevel error -select_streams v -show_entries frame=key_frame -of csv=p=0 hero.mp4 | grep -c '^1'
```

A dense encode reports a keyframe every 8 frames, so a twelve second 30fps clip returns 45. A return of 1 means the dense flags were dropped and the scrub will stutter. Also check that the served response carries `Accept-Ranges: bytes`.

Fallback ladder, in order. Stop at the first rung that holds:

1. Scroll driven `currentTime` on desktop browsers. Works, and it is fifteen lines.
2. Poster frame only, no video, on any viewport under 768px. Mobile Safari does not seek smoothly and the data cost is not worth it.
3. Canvas image sequence in the same fixed layer, 60 to 120 frames as WebP, painted from scroll position. Use this only if rung 1 visibly stutters on a real device. It is the most reliable reverse scrubbing method and the heaviest to ship.
4. A static photograph if the video is late. Never block the build on the video.

`prefers-reduced-motion: reduce` means the poster frame and nothing else. No autoplay, no scrub, no fade.

The video never loads eagerly: `preload="metadata"`, and the poster paints first. A background clip must not cost anyone the page.

## Copy rules

These apply to every page. They are the difference between a society site and generated filler.

- Sentence case headings. No title case headlines, no all caps sentences.
- No em dashes. Use a full stop and a new sentence, or brackets.
- Attribute every claim: a year, a name, a number, a source. "Ran six events with 800 participants" beats "impactful initiatives".
- Banned words: seamless, robust, elevate, unleash, empower, cutting edge, passionate about, in today's fast paced world, delve, not only but also.
- No three item lists that exist only because three items was the shape. Two is fine, six is fine.
- No emoji as illustration or bullet. If a visual mark is needed, use a hand drawn inline SVG or typography.
- Numbers in the mono, with tabular figures, with units.
- Market data always carries `Pakistan Stock Exchange, dps.psx.com.pk` and the snapshot time in PKT.
- Every image has `alt` text describing the content. Decorative images use `alt=""` and nothing else.
- Second person when speaking to a reader ("you can apply"), third person when describing the society ("FINTRA runs"). Do not mix inside one section.
