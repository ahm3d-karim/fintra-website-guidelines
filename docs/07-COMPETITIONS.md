# Page 6: Competitions (confirm before building)

The brief lists five pages and mentions competitions with a link to results. This document assumes a sixth page. Confirm it before anyone builds it: if competitions only need a home page row and results living inside research, delete this file.

Route `/competitions`. One file.

**Job of the page:** show what FINTRA runs, who won, and what is coming next, so a reader can tell the society does real events and a sponsor can see the scale.

**Who reads it:** prospective members, participants checking results, sponsors sizing the audience.

## Sections

1. **Header.** `Competitions`, one line of description, and the count of events run with the years covered.
2. **Upcoming.** If exactly one event is scheduled, give it its own block: name, date, venue, format, eligibility, and one action (register or a link to the registration form). If nothing is scheduled, this whole block is absent rather than showing "stay tuned". A site that always says "more coming soon" reads as a site nobody maintains.
3. **Past events.** A row table, newest first: event name, date, participants, teams, universities, and a `Results` link. These are the figures the society already tracks for posters. Each row expands, or links to `/competitions/<slug>`, showing the top three results, the format, and two or three photographs.

Known event names from FINTRA's own posts: Bulls & Bears, Phoenix, Stock Pitch Competition, Capital Market Simulation, K-Trade class, and Orientation and GBM. Use the society's own naming, including the spelling and capitalisation they use.

4. **Photographs.** Two or three per event, real ones, at least 1600px wide, with `alt` text naming the event and the year. No stock imagery, no AI generated placeholder imagery, no gradient overlays on people's faces. An event with no usable photograph shows none, and the row still reads fine.

## Rules

- Past events convert to text rows, not permanent card grids. An archive of identical cards ages badly and says nothing.
- No `coming soon`, no `TBA` blocks, no placeholder logos of sponsors that have not signed.
- Results are factual: name, team, university, placement. Do not soften a result into "top performers".
- Every photograph's alt text states what is in the frame. "Students at a trading simulation, 2025" beats "event photo".

## Content needed

1. Confirmation that this is a page at all.
2. The event list with dates, formats and the figures already on their posters.
3. Results per past event, or a decision to publish only the top three.
4. Photographs with permission to publish, named and dated.

## Acceptance criteria

1. Every row's figures match the society's own records. Any number that cannot be sourced is cut.
2. With no upcoming event, no empty or placeholder block renders.
3. Images are at least 1600px wide, under 300KB each after compression, served as WebP with a JPEG fallback, and never stretched by the layout.
4. Photographs have real alt text, checked by reading the served HTML.
5. At 390px the tables stack and every photograph keeps its aspect ratio with no layout shift when it loads.
