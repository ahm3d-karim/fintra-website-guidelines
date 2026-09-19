# Page 4: GB application

Route `/apply`. One file, `public/apply/index.html`, plus `functions/api/apply.js`.

**Job of the page:** collect General Body applications with no friction and no lost submissions, and stop cleanly the moment the deadline passes.

**Who reads it:** the roughly 100 members applying to join GB, the EC reviewing submissions in the admin panel.

## Sections, in order

### 1. Header

Title `General Body application` (bump the name to whatever the intake is officially called), one paragraph of 30 to 50 words stating what GB is, who may apply, and the commitment. Then a meta row: applications close date with the time in PKT, and `Applications for the 2026 to 2027 term` or the relevant term.

No countdown timer. Dates are calmer and the reader will not miss them.

### 2. The eligibility line

One sentence in plain words: the year groups or programmes that may apply, and whether prior experience is needed. If the answer is "anyone", say that. It saves two hundred people an email.

### 3. The form

One column, 640px, fields in this order. Every field has a visible label above it, not a placeholder as label.

| Field | Type | Rules |
|---|---|---|
| Full name | text | required, 2 to 60 characters |
| LUMS email | email | required, warn (do not block) if it is not a `@lums.edu.pk` address |
| Phone | tel | required, 10 to 14 digits after stripping spaces, dashes and a leading `+92` |
| Programme and year | text | required, one line, for example `BSc Economics, 2028` |
| First choice department | select | required, options come from `departments.js`, so the list never drifts from the departments page |
| Second choice department | select | required, and it cannot equal the first choice |
| Why this department | textarea | required, 100 to 600 characters, with a live character count |
| Relevant experience | textarea | optional, 600 characters, max 3 links inside the text |
| Anything else | textarea | optional, 300 characters |
| Consent | checkbox | required: that the answers may be reviewed by the EC, and that contact details are not published |

Validation runs twice: in the browser for the fast message, and on the Worker, because browser validation is a convenience and never a control. Server rejections render against the offending field with the submitted text preserved. Losing a 600 character answer to a failed validation is the one unforgivable bug on this page.

### 4. Submit

One primary button, `Submit application`. On success the form is replaced in place, not redirected to a new URL, by a confirmation panel: `Application received` , the email address it was filed under, the submission reference, and one line saying the EC will respond by <date>. No confetti, no animated tick.

### 5. Closed state

One constant, `APPLICATIONS_CLOSE`, on the Worker. Past that timestamp the form does not render at all: the page shows what GB is, the closing date that has passed, and a line for the next intake. A form that accepts a submission nobody will read is worse than no form.

## Submission handling

```
POST /api/apply
  -> Turnstile token verified server side (Cloudflare native, free, no third party account)
  -> honeypot field must be empty
  -> validation, then INSERT into applications (answers stored as one JSON blob)
  -> rate limit: 3 submissions per IP per hour, 1 per email address
  -> response: reference id, or field level errors
```

Notifications are not part of the first build. The EC reads submissions in the admin panel, where the same table exports to CSV. Adding an email per submission invites a mail provider, a template and a deliverability problem for a page that runs for two weeks a year.

Stored and not displayed: phone numbers and email addresses never appear on any public page, ever. Retention: submissions are exported at the end of the intake and deleted from D1 one month after the term starts, stated in one line in the consent text.

## States

- Before deadline: form, enabled.
- After deadline: closed panel, no form in the DOM.
- Submitting: button disabled with the label `Submitting`, no spinner animation beyond a plain grey state.
- Field error: message under the field, the field border goes `--down`, the first invalid field takes focus.
- Server down: one sentence `Something went wrong on our side. Your answers are still in the form, please try again.` The form retains everything.
- Duplicate email: `This email has already applied.` with the date of the first submission and an instruction to email the EC if it is a mistake.

## Content needed

1. Official name of the intake and the term it covers.
2. The close date and time, in PKT.
3. Eligibility wording, in the society's own words.
4. The exact consent and retention sentence, reviewed by whoever handles member data.
5. The response date promised in the confirmation panel.
6. Whether a second choice department is actually used in the process. If it is not, delete the field rather than collecting data nobody reads.

## Acceptance criteria

1. Submitting an empty form shows an error per required field and no request is made to `/api/apply`.
2. A submission with an invalid phone or a first and second choice that match is rejected server side, verified by posting directly to the endpoint with curl.
3. A valid submission inserts exactly one row and the confirmation shows the same reference the database holds. Verify by reading the row back.
4. Double submitting the same email is rejected with the duplicate message, and no second row exists.
5. Removing the `applications` write (or pointing the Worker at a bad binding) shows the server error state with the answers still in the form.
6. Tabbing through the form reaches every field in order and every control has an accessible name.
7. Past `APPLICATIONS_CLOSE`, the form is absent from the DOM, verified by grepping the served HTML.
8. The whole form is usable at 390px with no horizontal scroll and a 44px minimum tap target on the selects and the checkbox.
