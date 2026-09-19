# FINTRA website build pack

Five pages plus a scroll driven background video. This file is the index; every page has its own document next to this one.

| File | Covers |
|---|---|
| `00-START-HERE.md` | scope, stack, repo layout, global gates, open questions |
| `01-DESIGN-SYSTEM.md` | palette, type, spacing, components, motion, video spec, copy rules |
| `02-HOME.md` | home page |
| `03-DEPARTMENTS.md` | departments page and the expanding profile cards |
| `04-PORTFOLIO.md` | PSX portfolio tracking page and the admin buy/sell panel |
| `05-GB-APPLICATION.md` | General Body application page |
| `06-RESEARCH.md` | research publishing page |
| `07-COMPETITIONS.md` | competitions page (confirm it is a page, see the last file) |
| `demo/` | one runnable demo per page, sharing `site.css` and `site.js`; `serve-range.py` serves them with range support |

## The two rules that override everything

1. Everyone touching this build knows the project in and out. No shipping a section you cannot explain line by line, no copying a component you do not understand.
2. It has to read as a professional website made by people, not as generated output. Minimal, a lot of negative space, no decoration for decoration's sake.

If a design decision cannot be justified in one sentence, it is decoration. Cut it.

## Scope

| Page | Route | Job of the page | Content owner |
|---|---|---|---|
| Home | `/` | Say what FINTRA is, what it does, what it stands for, in one screen | Society |
| Departments | `/departments` | Show every department, its people, its job descriptions | Society |
| Portfolio | `/portfolio` | Track a virtual PSX portfolio; admin buys and sells | Society + build team |
| GB Application | `/apply` | Collect General Body applications | Society |
| Research | `/research` | Publish research write ups | Society (admin upload) |

## Stack

Hosting is Cloudflare, so use Cloudflare end to end rather than adding services.

| Layer | Choice | Why |
|---|---|---|
| Pages | Cloudflare Pages, plain HTML/CSS/JS, no framework | The existing draft is already plain HTML/CSS/JS and it deploys as is. No build step means any team member can open a file and read it. |
| Dynamic endpoints | Cloudflare Pages Functions (Workers) | Needed for three things only: PSX prices, form submission, research upload. |
| Database | Cloudflare D1 (SQLite) | Positions, trades, applications, research metadata. One file schema. |
| Files | Cloudflare R2 | Research PDFs, the background video, event photography. |
| Admin auth | Cloudflare Access on `/admin/*` | Email based access for the EC list. Do not build a login screen. |
| Scheduling | Cloudflare Cron Trigger on the Worker | Pull PSX prices on a schedule. |

### The one architectural constraint that decides everything

PSX sends no CORS header, so browser JavaScript on another origin cannot read `dps.psx.com.pk`. Verified: the drafting tool `tools/fetch_tape.py` already documents this.

Consequence, and it is not optional:

- Prices are pulled by a Worker or an offline script, never by page JavaScript.
- Browsers read prices only from FINTRA's own origin, and every price block carries an `as_of` timestamp.
- The admin buy/sell panel prices a trade from that stored snapshot, not from a live in browser fetch.

Live prices can be added later if we ever pay for a market data API. Until then, snapshot is the design, not a workaround hidden in the code.

## Repo layout

```
public/
  index.html                 home
  departments/index.html
  portfolio/index.html
  apply/index.html
  research/index.html
  admin/                     behind Cloudflare Access
  assets/css/site.css        the only stylesheet, tokens in :root
  assets/js/                 one file per behaviour, no bundler
  assets/media/              poster.jpg, hero.mp4, logo.svg
  assets/media/people/       square 800x800 roster portraits, one per member
  data/                      generated snapshots (do not hand edit)
functions/
  api/prices.js              PSX pull, writes to D1
  api/apply.js               application submit
  api/research.js            research upload
schema.sql                   five tables
tools/                       snapshot and encode scripts
docs/                        this pack
```

Keep it this flat. A folder per concern, not per file.

## Global gates, checked before any page is called done

1. No console errors in a real browser, no horizontal overflow at 390px, 768px and 1440px.
2. Every number on the page carries its source and its `as_of` date.
3. Every interactive element is reachable and operable by keyboard, including the department card expansion.
4. Contrast checked with a checker, not by eye. Body text at least 4.5:1 against its actual background.
5. `prefers-reduced-motion: reduce` stops the video scrub and all entrance motion, and the page still reads.
5b. With JavaScript disabled, and after a deep link to a mid page section or one hard flick to the bottom, every block is fully visible. Entrance motion is never allowed to be the reason content is missing.
6. A skip to content link is the first focusable element on every page, visible on focus, and it lands on `<main>`.
7. The video never blocks first paint: poster image first, video after.
7. Every image has `alt` text that says something. Icon only controls have an accessible name.
8. No placeholder copy ships. Missing content is a visible `[needs content]` box, not invented text.

## Open questions, answer before build starts

| # | Question | Why it blocks |
|---|---|---|
| 1 | Logo file (SVG preferred) | The red is settled: sampled from FINTRA's own mark (`#C02B20` average across the deep reds, cleanest samples `#D81C0C`, shipped as `#C2211B`). The vector mark is still owed, and the demo uses the wordmark as text |
| 2 | ~~Founding year~~ 2016 | Resolved from the society's LinkedIn company page, which lists Founded 2016 |
| 3 | Full department list and each one's JD text | The departments page is content driven, the copy is yours |
| 4 | Roster: name, role, department, quote, credentials, work link, per person | The expanding card has nothing to expand without it |
| 4b | One square 800x800 photo per person, same framing and background for everyone, plus separate consent to publish the photo | The roster page is a people page, and mixed framing is what makes it look amateur |
| 5 | GB application fields and the deadline | Apply page, first section |
| 6 | Which symbols the virtual portfolio may trade | Universe has to be fixed before the buy/sell panel is written |
| 7 | Where the video comes from and who approves it (Gemini, Higgsfield, or shot footage) | The home page hero is built around it |
| 8 | Who may publish research, and whether posts need approval before going live | Decides if research upload is one step or two |
| 9 | A real sponsorship contact address | Currently only a LinkedIn link exists |

## Reference material used in this pack

Everything in this section was read from live pages as markup and computed styles, not judged from a screenshot.

| Reference | Measured | What to take from it |
|---|---|---|
| linear.app | body `#08090A`, ink `#F7F8F8`, h1 64px/64px at -1.408px tracking (about -0.022em), weight 510, section padding 128px top and bottom, container 1364px, Inter Variable plus a mono | A dark field done properly: one loud element, enormous section rhythm, a mono for numbers |
| stripe.com/payments | h1 32px/700, content container 1080px, section padding 32px/48px | Restraint at the top: the headline is not the biggest thing on the page |
| apple.com/macbook-air | h1 28px/32px, weight 600, tracking +0.196px, 13 sections down one page, every video muted with `preload="none"` | Hero type can be small and still be confident. Video must never load eagerly |
| initiate.lums.edu.pk | h1 102.4px uppercase at -0.025em and 0.92 line height, section titles 56px, prose DM Sans 16/1.62, field `#150A24`, content column 966px inside a 108px inset on a 1249px viewport, cards `rgba(26,11,43,0.72)` with a 3px radius, 7 nav items and a skip link, 8 viewport tall sections over a 7489px page | The display register, the left anchored column, and a translucent card so the clip reads through content. Analysis and what was rejected is in `01-DESIGN-SYSTEM.md` |
| Abhishek Ghosh, video scrubbing on the web: https://www.ghosh.dev/posts/playing-with-video-scrubbing-animations-on-the-web | `currentTime` scrubbing stutters at high resolution because the decoder seeks to the nearest keyframe and decodes forward | Read before promising smooth scrub. The fix is encode side, see `01-DESIGN-SYSTEM.md` |
| Scrollsequence, video scroll guide: https://scrollsequence.com/video-scroll | Image sequences are the most reliable way to run a scrub forwards and backwards frame accurately; WebGL is the most flexible and the most work | Fallback ladder if video scrubbing proves unreliable on target devices |
| Apple scroll video breakdown: https://www.youtube.com/watch?v=L1eu737bu70 | The MacBook Air effect is a pre rendered video whose playback is driven by scroll position, not a WebGL scene | Confirms the plain approach is legitimate |

Copy rules for the site itself are in `01-DESIGN-SYSTEM.md`. They are short and they are not negotiable.
