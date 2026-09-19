# Page 5: Research

Route `/research` for the index, `/research/<slug>` for a post. Files `public/research/index.html` and `functions/api/research.js`.

**Job of the page:** publish the society's research write ups so they can be read and cited, with an upload path the EC can use without touching code.

**Who reads it:** students and members reading the work, sponsors judging whether the society produces anything real, the writers themselves when they send the link to an employer.

## Content model

Metadata in D1, files in R2, one row per post. `slug` is the primary key and it is also the file name: `research/<slug>.pdf`.

| Field | Rules |
|---|---|
| title | 20 to 120 characters, sentence case, no clickbait |
| author | `Name, role` for a solo piece, comma separated for a group piece |
| published_on | ISO date, the date the piece went live, not the date it was written |
| summary | 120 to 240 characters, states the finding, not the topic. "Pakistani cement margins compress as coal costs rise" beats "An analysis of the cement sector" |
| topic | one of a short fixed list, from the society. Not free text |
| file_key | R2 key, always `research/<slug>.pdf` |
| status | `draft` until published, and drafts are invisible to the public route |

Files: PDF, text selectable, under 20MB, metadata (title, author) set on the file itself so a downloaded copy is self describing. A phone photo of printed pages is a rejection, not a submission, because it cannot be searched or cited.

## The index page

Sections:

1. **Header.** `Research`, one line describing what gets published and by whom, then the count: `14 pieces, 2023 to 2026`. Numbers from the database, not typed into copy.
2. **Filters.** Plain text links in one row: `All`, the years present in the data, and the topics present in the data. Active filter has a gold rule under it if the accent allows, otherwise a 1px underline in `--accent`. No pills, no dropdowns, no tag clouds.
3. **The list.** A row table, newest first: date (12px, mono), title (18px, the only large text on the row), author and topic (14px muted), and a `PDF` link with its size. Row hover is a 1px line highlight, 120ms. Not cards, because pieces have unequal weight and a card grid implies they do not.
4. **Empty state.** `No pieces published yet.` plus one line telling the reader when the first drop is expected. Never an illustration.

Pagination at 20 rows, plain `Older` and `Newer` links, no infinite scroll. A research archive is something you want to be able to link and return to at a position.

## A post page

1. Title, then the meta line: author, date, topic, reading time is not needed for a PDF.
2. The summary paragraph in the 640px prose column.
3. The PDF: a `Read the paper` link that opens the file in the browser's own viewer in a new tab, and a `Download PDF (1.2 MB)` link. No embedded viewer library, no fake page turner. Native PDF rendering on mobile is better than anything we would write.
4. Optional: two or three key figures in a row table, if the piece has them and the author supplies them. Only real numbers from the paper.
5. A footer line: `FINTRA Research, <date>. Cite as: Author, "Title", FINTRA, <year>, fintra.lums.edu.pk/research/<slug>`. Giving people the citation line costs nothing and is the difference between work that circulates and work that does not.

## Upload, for the EC

Behind Cloudflare Access at `/admin/research`:

1. Choose a PDF. Validate on the Worker: content type, real file signature, size under 20MB, a text layer present (reject a pure scan with `This PDF has no text layer, so it cannot be cited or searched`).
2. Fill in title, author, date, summary, topic. Slug derives from the title and is editable, with a uniqueness check.
3. Save writes the object to R2 and inserts the row as `draft`.
4. Publish flips the status, and only then does `/research/<slug>` resolve for the public.

Two steps on purpose: upload and publication are different decisions and the second one is the one that should be slow.

## States

- Draft: visible in the admin list only, the public URL returns 404.
- Missing file: the row renders, the link is replaced by `File unavailable, contact the EC`. Never a dead link.
- PDF too large: rejected at upload with the size shown against the limit.
- Filter with no matches: `No pieces in this topic yet.` and a link back to `All`.

## Content needed

1. The topic list, fixed by the society.
2. Who may publish, and whether a second person approves before publish.
3. Existing write ups, with author, date and the final PDF.
4. The one line describing what gets published, in the society's own words.

## Acceptance criteria

1. Uploading a 25MB PDF is rejected server side, verified by posting directly to the endpoint, not only through the form.
2. Uploading a scanned PDF with no text layer is rejected with the stated message.
3. A draft is not reachable at its public URL. Verify with curl, unauthenticated, and expect 404.
4. Publishing flips the post to visible and the index count increments by exactly one.
5. Every row's PDF link returns 200 and the byte count in the label matches the served `Content-Length`.
6. The index shows 20 rows per page and the paging links are keyboard focusable with visible focus.
7. At 390px the table collapses to stacked rows and the date, title, author and PDF link all remain present.
