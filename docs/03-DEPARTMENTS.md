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
