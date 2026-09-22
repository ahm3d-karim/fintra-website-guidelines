# Page 2: Departments

Route `/departments`. One file, `public/departments/index.html`.

**Job of the page:** show every department, what it is responsible for, and who runs it, with the full profile one gesture away.

**Who reads it:** applicants choosing where to apply, members checking who to contact, EC reviewing its own roster.

## Content model

One data file, `public/assets/data/departments.js`, exported as `window.FINTRA_DEPARTMENTS`. No CMS, no database, no admin screen for this page. It is edited by the person who maintains the site and that is fine while the roster changes once a year.

```js
window.FINTRA_DEPARTMENTS = [
  {
    name: "Marketing & Outreach",
    jd: "One paragraph, what this department owns and what it is judged on.",
    head: { name: "", role: "Director" },
    members: [
      {
        name: "Full name",
        role: "Assistant Director",
        year: "BSc Economics, 2028",
        quote: "One sentence in their own voice. Max 25 words.",
        credentials: ["Anything checkable: past roles, competitions, certifications"],
        work: { label: "Work done", url: "https://" }
      }
    ]
  }
]
```

Rules for the data: every field is required except `work`. If a person has no quote, the card shows the rest and no empty quote mark. Never invent credentials or quotes for a member, and never publish a phone number, a personal email or a residential address.

Known departments from the brief: `EC` and `Marketing & Outreach`. The full list is open question 3. Every additional department is another entry, not another page.

## Layout

For each department, in the order the society ranks them:

1. Department name as a section title, 20px, plus one line of meta on the right: number of people, and the year it was formed if known.
2. The JD paragraph in the 640px prose column.
3. A grid of profile cards: 3 columns at 1200px, 2 at 768px, 1 below. 24px gap.

`EC` runs first and its cards may use one step larger name type, since the reader is usually looking for a name to contact. That is the only visual difference between EC and the rest.

## The profile card

Collapsed, 220px tall, three lines:

```
Name                    role
Year line
One line, what they own    ->   reads: JD of their remit, truncated to one line
```

Expanded, in place, no overlay and no modal:

```
Name                    role
Year line
Quote, set in 18px, italic free
Credentials, as a short list of checkable lines
Work done -> link
```

Interaction, and this is where hover-only designs fail:

- Pointer devices (`hover: hover` and `pointer: fine`): the card expands on hover into a keyboard reachable state.
- Touch and keyboard: the card is a `<details>` element, so tapping the summary or pressing Enter expands it for free, with no JavaScript.
- Only one card in a department is open at a time: opening one closes its sibling.

Implementation shape, about fifteen lines of JavaScript: the markup is a `<details class="card">`, the script adds `open` on `mouseenter` and removes it on `mouseleave` only when `matchMedia('(hover: hover) and (pointer: fine)')` matches, so touch never fights it.

Expansion is height and opacity only, 160ms, `ease-out`. No 3D tilt, no scale, no shadow lift, no cursor following spotlight.

## Motion

Card expansion 160ms, hover colour transitions 120ms, and the shared `.rise` stagger on the department blocks (contract in `01-DESIGN-SYSTEM.md`). Cards stagger as grid siblings one step each, capped at `d3`, so a row does not cascade across the whole grid. The expansion itself is never staggered.

## States

- A department with no members yet: the grid is replaced by one line, `Roster for the 2026 to 2027 term is being finalised.`
- A member with no work link: the line is absent, not a dead anchor.
- Keyboard focus lands on each card summary in reading order and the focus ring is visible against the panel.
- Reduced motion: expansion is instant with no transition. Content is identical.

## Content needed

1. The full department list, in the society's own order, with one paragraph JD each.
2. For every person: full name, role, year line, quote in their own words, checkable credentials, and a work link if one exists.
3. A decision on whether EC pages use the larger name type.
4. Consent that names, roles and quotes are published. Anyone who has not confirmed is left out of the file rather than listed as a placeholder.

## Acceptance criteria

1. Tabbing through the page opens each card with Enter and closes it with Enter, and the expanded content is announced, not just shown.
2. On a phone, a tap expands the card and the expanded card is fully visible without the page jumping.
3. On a desktop pointer, hovering expands and moving away collapses, and a card expanded by keyboard stays open until it is closed.
4. At 390px the grid is one column with 20px side padding, and names never overflow their line.
5. No card shows an empty quote block, an empty credentials list, or `undefined`.
6. Adding a sixth department requires editing only the data file. If it needs a code change, the model is wrong.

## Built

Four files, two of them shared:

```
departments.html          shell: page head, title, lede, the roster container, the footer
data/departments.js       window.FINTRA_DEPARTMENTS, the roster
render-departments.js     builds every department and every card from the roster
site.css, site.js         shared with the other six pages: site.css gains the departments blocks,
                          site.js gains one click rule (nothing else has .dept cards)
```

Load order is the data file, then the renderer, then `site.js`, which wires the cards and collects the `.rise` blocks once they exist. Nothing is typed as markup, so criterion 6 holds: a department, a person or a quote is a data edit.

Hover, click and tap do different amounts of work. On a fine pointer, hover expands the card in place and shows the profile and the quote, each clamped to three lines, because at 174px the full body is a 721px tower in a 134px column. The click that follows pins the card, and a pinned card is the one that spans the row and shows the credentials and the job description. On a coarse pointer there is no hover step: the native toggle shows everything at once. The hover state deliberately does not span the row, because a card that moves down a row leaves the pointer, closes, snaps back under it and opens again, and that loop never settles. `site.js` takes one change for the same reason: the first click pins a card open and the second closes it, since the click meant to open a hover-opened card used to close it instead.

Member fields as built: `name`, `role`, `year`, `remit` (one line, truncated by CSS), `profile`, `quote`, `credentials`, `jd`, and the optional `work` and `photo`. A missing field renders nothing at all, so no card can show an empty quote mark, an empty list or `undefined`. `work` is a link, a label with a visible pending marker, or absent, in which case the line does not exist. `photo` is a square repo file; without it the card shows the initials monogram, which is also the fallback if the file fails.

`placeholder: true` marks an entry whose text is still a stand-in. There is no notice card on the page: a box between the title and the first department pushed the roster below the fold, so the footer carries the placeholder line instead. `?empty=1` renders every department with its description and the pending line instead of a row, the way `?closed=1` works on the application page. With JavaScript off the roster container carries one sentence saying the roster needs JavaScript; the rest of the page still reads.

### Layout as built, and where it differs from this document

One ruled rectangle per department: a header strip in `--band` with the 2px red rule under it (the same motif the section heads use), then the description, then the directors in a single row of compact cards. An opened card takes the whole row, because a 174px column leaves the detail text 134px wide, which turns one paragraph into a tower.

Measured at 390, 640, 768, 1024 and 1440: four cards across at 1440 and 1024, three at 768, two at 640, one at 390, no horizontal overflow at any of the five. The compact card is 174x225 collapsed at four across and 272x163 at one column. An opened card is 699x392 with a 449px text measure. On a 390px phone an opened card is 567px tall and its last 51px sit below the fold, with `scrollY` unchanged: the reader scrolls, the page does not jump.

1. **The card row.** This document asks for three columns at 1200px on a 24px gap. The row ships four across on the shell's 1px ruled grid, with `minmax(160px, 1fr)`, because the row is on one line by request.
2. **The 390px gutter.** This document asks for 20px. The design system's `--gutter` token is `clamp(24px, 8.5vw, 108px)`, which measures 33px at 390px. The token wins.
3. **The collapsed card height.** This document says 220px. The compact card is a 40px tile plus three lines inside 18px padding: 225px at four across, 163px at one column. The height comes off the type scale, not off a number.

Everything else here is what shipped: `<details>` cards, one card open per department, hover expansion on fine pointers only, the `::details-content` height animation, and the sibling stagger capped at `d3`.

## The roster as shipped

Nine departments in the society's order: Executive Council, Human Resources, Marketing, Media, Technology, Executions, Research, Social Responsibility Program, Events. Four placeholder directors each, so the page can be reviewed at full length before real data exists.

To publish it: replace the placeholder text in `data/departments.js` with confirmed names, quotes, credentials and role titles, drop the `placeholder` flags as the text becomes real, and add the square photos at `assets/media/people/<name-slug>.webp`. Nobody is listed without consent, and the department descriptions need sign off before their flags come off.

The list reached this page as `Social Responsibility Program and Events` and was read as two departments. If it is one department, deleting one block from the data file is the whole change.

## The ledger index variant (`departments-v2.html`)

`docs/demo/departments-v2.html` is the same page re-cut as a ruled index: one row per department carrying its number, name, one clamped line of the JD and the head count, with the description and the directors revealed by opening the row. Reason: the box stack makes a reader scroll nine equal blocks to compare departments, while the index puts all nine above the fold at 1440.

- Load order is `data/departments.js`, then `render-departments.js`, then `render-departments-v2.js`, then `site.js`. On this page the first renderer only exports `window.FINTRA_DEPT` (`el`, `rise`, `person`, `monogram`) and skips the box build, because the ledger container is `#index`, not `#roster`. The person card is the same builder, so criterion 6 still holds: a department or a person is a data edit.
- Each row is `<details class="row dept" name="dept" id="dept-N">`. The `name` attribute closes the other rows natively, so there is no exclusivity script. The `dept` class is what puts the person cards under `site.js`'s one-card-per-department wiring, and `.row.dept` resets the `margin-top: 56px` that class carries. Browsers without `<details name>` (Safari below 17, Chrome below 120) can hold more than one row open; that is the old page's behaviour anyway.
- No row opens by default (decided 2026-09-22). `#dept-3` opens that row from the fragment, and any other fragment, including the skip link's `#main`, is ignored.
- The row styles live in a `<style>` block in `departments-v2.html`, not in `site.css`, because `site.css` is shared by the other six demos.
- Same states as the box page: `?empty=1` for every roster pending, the noscript sentence with JavaScript off, no dead anchors, the initials monogram fallback.

Measured, this variant: no row open on load; opening row 5 closes row 3 (name attribute); Space toggles rows and person cards, Enter toggles rows; tab order from a pristine load is skip link, the five nav links, row 01, with the 2px red ring on each; zero console errors on a fresh target; overflow -15, -15 and 0 at 1440, 768 and 390, including after a hard flick to the bottom, with all 48 `.rise` elements revealed; summary tap target 76x324 at 390; under emulated reduced motion a below-fold row computes opacity 1. Contrast on rendered pixels: text core 13.97:1 on white, the red number 5.95:1 on white and on the band strip, muted 5.74:1 at 390.

Two measured observations, both pre-existing and not introduced by the variant:

1. Enter dispatched through CDP activates a row summary but produced no click event on a person-card summary, identically on this variant and on the shipped box page, while Space activates both. The disclosure is native `<details>` either way; the keyboard path worth trusting here is Tab plus Space.
2. At 390 the header nav sits flush to the viewport edge on every page (brand left edge 0, `Apply for GB` right edge 390): `header.site nav` sets `padding: 18px 0`, which beats `.wrap`'s horizontal gutter. The fix is one line in `site.css` (`padding-block: 18px`) and belongs to a shared-shell pass, since six other pages move with it.
