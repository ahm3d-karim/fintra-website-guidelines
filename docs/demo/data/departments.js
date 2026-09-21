// FINTRA departments page data. Loaded before render-departments.js, which builds the page.
//
// Editing this file is the only change needed to publish a roster: a new department, a new person or
// a new quote is an entry here, never new markup (03-DEPARTMENTS.md, acceptance criterion 6).
//
// Fields, per department:  name, jd (one paragraph: what it owns and what it is judged on),
//                          since (year formed, if known, omitted otherwise), members.
// Fields, per member:      name, role, year, remit (one line: what they own), profile, quote,
//                          credentials (list of checkable lines), jd, and work, which is optional.
// work:                    { label: "Work done", url: "https://..." } renders a link.
//                          { label: "Work done", pending: true } renders the label with a visible
//                          "link pending" marker. Omit the key and the line is absent.
// photo:                   assets/media/people/<name-slug>.webp, 1:1, 800x800, WebP q78, under
//                          120KB, alt="". Omit it and the card shows the initials monogram instead,
//                          which is also the fallback if the file is missing.
// placeholder:             true on an entry whose text has not been supplied yet. The page shows a
//                          visible notice while any entry carries it, so placeholder copy can never
//                          read as final. Every field is required except work and photo.
// Nothing personal is published here: no phone numbers, no personal email, no addresses, and nobody
// appears without consent.

window.FINTRA_DEPARTMENTS = [
  {
    "name": "Executive Council",
    "jd": "Owns the society's direction, its external relationships, and the budget. Judged on whether the calendar ships and the sponsors renew.",
    "members": [
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics, 2028",
        "remit": "Owns the council agenda",
        "profile": "Placeholder profile. One sentence on what this member did before taking the role.",
        "quote": "One sentence in their own voice, twenty five words at most, and no press release voice.",
        "credentials": [
          "Past role, checkable",
          "Competition or certification, checkable"
        ],
        "jd": "Chairs the council, sets the term's priorities and speaks for the society to sponsors, the university and other societies.",
        "placeholder": true,
        "work": {
          "label": "Work done",
          "pending": true
        }
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Accounting and Finance, 2028",
        "remit": "Owns the roster and the minutes",
        "profile": "Placeholder profile. The background line the roster file carries for this person.",
        "quote": "Quote in their own words. If there is no quote, this block is absent and the card shows the rest.",
        "credentials": [
          "Past role, checkable"
        ],
        "jd": "Keeps the roster, the minutes and the General Body intake, and is the point of contact for anyone applying.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics and Computer Science, 2029",
        "remit": "Owns the budget and the accounts",
        "profile": "Placeholder profile. One or two sentences in third person, facts only.",
        "quote": "The line that says why this department, written as they would say it rather than as the society would.",
        "credentials": [
          "Certification, checkable",
          "Past role, checkable"
        ],
        "jd": "Holds the budget, approves spend against it, and closes the term with accounts someone else can read.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Computer Science, 2029",
        "remit": "Owns the calendar and the event order",
        "profile": "Placeholder profile. Prior society roles, internships or coursework, kept checkable.",
        "quote": "One sentence they would actually say out loud, twenty five words at most.",
        "credentials": [
          "Past role, checkable",
          "Piece published, with the link"
        ],
        "jd": "Owns the calendar: which events run, in what order, and what each one needs from the departments.",
        "placeholder": true
      }
    ],
    "placeholder": true
  },
  {
    "name": "Human Resources",
    "jd": "Owns who joins and how they are looked after: recruitment, onboarding, and the internal record of the work every member does.",
    "members": [
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics, 2028",
        "remit": "Owns recruitment and the offer list",
        "profile": "Placeholder profile. The background line the roster file carries for this person.",
        "quote": "Quote in their own words. If there is no quote, this block is absent and the card shows the rest.",
        "credentials": [
          "Past role, checkable"
        ],
        "jd": "Runs the recruitment cycle: the call for applications, the shortlists, the interviews and the offer list.",
        "placeholder": true,
        "work": {
          "label": "Work done",
          "pending": true
        }
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Accounting and Finance, 2028",
        "remit": "Owns onboarding for new members",
        "profile": "Placeholder profile. One or two sentences in third person, facts only.",
        "quote": "The line that says why this department, written as they would say it rather than as the society would.",
        "credentials": [
          "Certification, checkable",
          "Past role, checkable"
        ],
        "jd": "Runs onboarding, so a new member knows their department, their remit and who to ask inside the first month.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics and Computer Science, 2029",
        "remit": "Owns the member record",
        "profile": "Placeholder profile. Prior society roles, internships or coursework, kept checkable.",
        "quote": "One sentence they would actually say out loud, twenty five words at most.",
        "credentials": [
          "Past role, checkable",
          "Piece published, with the link"
        ],
        "jd": "Keeps the member record: who is active, what they worked on, and the exit note when someone leaves.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Computer Science, 2029",
        "remit": "Owns how the departments talk",
        "profile": "Placeholder profile. What they study, and what they ran before this.",
        "quote": "A quote from the member, kept as written. No quote means no block here.",
        "credentials": [
          "Past role, checkable",
          "Competition or certification, checkable"
        ],
        "jd": "Keeps the departments talking to each other, and takes anything unresolved to the council.",
        "placeholder": true
      }
    ],
    "placeholder": true
  },
  {
    "name": "Marketing",
    "jd": "Owns how the society is seen: the sponsor deck, the campaigns and the accounts. Judged on reach that turns into applicants and sponsors rather than impressions.",
    "members": [
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics, 2028",
        "remit": "Owns the sponsor deck",
        "profile": "Placeholder profile. One or two sentences in third person, facts only.",
        "quote": "The line that says why this department, written as they would say it rather than as the society would.",
        "credentials": [
          "Certification, checkable",
          "Past role, checkable"
        ],
        "jd": "Owns the sponsor deck and the partnership pipeline, from the first email to the signed term.",
        "placeholder": true,
        "work": {
          "label": "Work done",
          "pending": true
        }
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Accounting and Finance, 2028",
        "remit": "Owns the campaign calendar",
        "profile": "Placeholder profile. Prior society roles, internships or coursework, kept checkable.",
        "quote": "One sentence they would actually say out loud, twenty five words at most.",
        "credentials": [
          "Past role, checkable",
          "Piece published, with the link"
        ],
        "jd": "Builds the campaign calendar and writes the copy each campaign launches with.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics and Computer Science, 2029",
        "remit": "Owns the social accounts",
        "profile": "Placeholder profile. What they study, and what they ran before this.",
        "quote": "A quote from the member, kept as written. No quote means no block here.",
        "credentials": [
          "Past role, checkable",
          "Competition or certification, checkable"
        ],
        "jd": "Runs the social accounts, and decides what goes out and when.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Computer Science, 2029",
        "remit": "Owns the brand assets",
        "profile": "Placeholder profile. Replaced by the member's own two lines when the roster is confirmed.",
        "quote": "Their own sentence about the work, not a summary of the role.",
        "credentials": [
          "Past role, checkable"
        ],
        "jd": "Keeps the brand assets and the poster templates, so this term's poster looks like the last one.",
        "placeholder": true
      }
    ],
    "placeholder": true
  },
  {
    "name": "Media",
    "jd": "Owns what the society looks like and sounds like: photography, edits, and the archive that all event coverage is cut from.",
    "members": [
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics, 2028",
        "remit": "Owns event photography",
        "profile": "Placeholder profile. Prior society roles, internships or coursework, kept checkable.",
        "quote": "One sentence they would actually say out loud, twenty five words at most.",
        "credentials": [
          "Past role, checkable",
          "Piece published, with the link"
        ],
        "jd": "Covers events: the shot list, the photography, and the handover of the files in the same week.",
        "placeholder": true,
        "work": {
          "label": "Work done",
          "pending": true
        }
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Accounting and Finance, 2028",
        "remit": "Owns video edits and consent",
        "profile": "Placeholder profile. What they study, and what they ran before this.",
        "quote": "A quote from the member, kept as written. No quote means no block here.",
        "credentials": [
          "Past role, checkable",
          "Competition or certification, checkable"
        ],
        "jd": "Edits the video, and keeps the list of who has agreed to appear in frame.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics and Computer Science, 2029",
        "remit": "Owns the media archive",
        "profile": "Placeholder profile. Replaced by the member's own two lines when the roster is confirmed.",
        "quote": "Their own sentence about the work, not a summary of the role.",
        "credentials": [
          "Past role, checkable"
        ],
        "jd": "Runs the media archive and the file naming, so anything shot can be found a year later.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Computer Science, 2029",
        "remit": "Owns the campaign graphics",
        "profile": "Placeholder profile. One sentence on what this member did before taking the role.",
        "quote": "One sentence in their own voice, twenty five words at most, and no press release voice.",
        "credentials": [
          "Certification, checkable",
          "Past role, checkable"
        ],
        "jd": "Produces the graphics that posters and campaigns are assembled from.",
        "placeholder": true
      }
    ],
    "placeholder": true
  },
  {
    "name": "Technology",
    "jd": "Owns the site, the data pipeline and the internal tools. Judged on whether the pages ship, and whether every number on them can be traced to a source.",
    "members": [
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics, 2028",
        "remit": "Owns the site build and the deploy",
        "profile": "Placeholder profile. What they study, and what they ran before this.",
        "quote": "A quote from the member, kept as written. No quote means no block here.",
        "credentials": [
          "Past role, checkable",
          "Competition or certification, checkable"
        ],
        "jd": "Builds and ships the site, and keeps the deploy working between terms.",
        "placeholder": true,
        "work": {
          "label": "Work done",
          "pending": true
        }
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Accounting and Finance, 2028",
        "remit": "Owns the market data pipeline",
        "profile": "Placeholder profile. Replaced by the member's own two lines when the roster is confirmed.",
        "quote": "Their own sentence about the work, not a summary of the role.",
        "credentials": [
          "Past role, checkable"
        ],
        "jd": "Runs the market data pipeline and the snapshot schedule behind the portfolio page.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics and Computer Science, 2029",
        "remit": "Owns the internal tools",
        "profile": "Placeholder profile. One sentence on what this member did before taking the role.",
        "quote": "One sentence in their own voice, twenty five words at most, and no press release voice.",
        "credentials": [
          "Certification, checkable",
          "Past role, checkable"
        ],
        "jd": "Maintains the internal tools the other departments work in.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Computer Science, 2029",
        "remit": "Owns review before release",
        "profile": "Placeholder profile. The background line the roster file carries for this person.",
        "quote": "Quote in their own words. If there is no quote, this block is absent and the card shows the rest.",
        "credentials": [
          "Past role, checkable",
          "Piece published, with the link"
        ],
        "jd": "Reads every change before it goes live, so nothing ships with a number that cannot be traced.",
        "placeholder": true
      }
    ],
    "placeholder": true
  },
  {
    "name": "Executions",
    "jd": "Owns turning a plan into something that runs on the day: the run sheet, the suppliers, the room and the crew.",
    "members": [
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics, 2028",
        "remit": "Owns the run sheet",
        "profile": "Placeholder profile. Replaced by the member's own two lines when the roster is confirmed.",
        "quote": "Their own sentence about the work, not a summary of the role.",
        "credentials": [
          "Past role, checkable"
        ],
        "jd": "Writes the run sheet for every session: who is where, at what time, and what has to happen first.",
        "placeholder": true,
        "work": {
          "label": "Work done",
          "pending": true
        }
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Accounting and Finance, 2028",
        "remit": "Owns suppliers and bookings",
        "profile": "Placeholder profile. One sentence on what this member did before taking the role.",
        "quote": "One sentence in their own voice, twenty five words at most, and no press release voice.",
        "credentials": [
          "Certification, checkable",
          "Past role, checkable"
        ],
        "jd": "Books suppliers and venues, and holds the terms of each booking.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics and Computer Science, 2029",
        "remit": "Owns the on the day crew",
        "profile": "Placeholder profile. The background line the roster file carries for this person.",
        "quote": "Quote in their own words. If there is no quote, this block is absent and the card shows the rest.",
        "credentials": [
          "Past role, checkable",
          "Piece published, with the link"
        ],
        "jd": "Runs the on the day crew and the rota, including the swaps when someone cannot make it.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Computer Science, 2029",
        "remit": "Owns the post event record",
        "profile": "Placeholder profile. One or two sentences in third person, facts only.",
        "quote": "The line that says why this department, written as they would say it rather than as the society would.",
        "credentials": [
          "Past role, checkable",
          "Competition or certification, checkable"
        ],
        "jd": "Closes each event with the record of what ran and who came.",
        "placeholder": true
      }
    ],
    "placeholder": true
  },
  {
    "name": "Research",
    "jd": "Owns the write ups the society publishes: the topic list, the analysis, and the standard a piece has to meet before it carries FINTRA's name.",
    "members": [
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics, 2028",
        "remit": "Owns the publication standard",
        "profile": "Placeholder profile. One sentence on what this member did before taking the role.",
        "quote": "One sentence in their own voice, twenty five words at most, and no press release voice.",
        "credentials": [
          "Certification, checkable",
          "Past role, checkable"
        ],
        "jd": "Holds the publication standard, and reads every piece before it goes out under the society's name.",
        "placeholder": true,
        "work": {
          "label": "Work done",
          "pending": true
        }
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Accounting and Finance, 2028",
        "remit": "Owns the equity research pipeline",
        "profile": "Placeholder profile. The background line the roster file carries for this person.",
        "quote": "Quote in their own words. If there is no quote, this block is absent and the card shows the rest.",
        "credentials": [
          "Past role, checkable",
          "Piece published, with the link"
        ],
        "jd": "Runs the equity research pipeline, from the coverage list to the published note.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics and Computer Science, 2029",
        "remit": "Owns the macro and market notes",
        "profile": "Placeholder profile. One or two sentences in third person, facts only.",
        "quote": "The line that says why this department, written as they would say it rather than as the society would.",
        "credentials": [
          "Past role, checkable",
          "Competition or certification, checkable"
        ],
        "jd": "Produces the macro and market notes that follow the semester's calendar.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Computer Science, 2029",
        "remit": "Owns the source list behind figures",
        "profile": "Placeholder profile. Prior society roles, internships or coursework, kept checkable.",
        "quote": "One sentence they would actually say out loud, twenty five words at most.",
        "credentials": [
          "Past role, checkable"
        ],
        "jd": "Keeps the source list behind every figure the society publishes.",
        "placeholder": true
      }
    ],
    "placeholder": true
  },
  {
    "name": "Social Responsibility Program",
    "jd": "Owns the society's financial literacy work off campus: which schools and groups the sessions reach, and what the people in the room take away.",
    "members": [
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics, 2028",
        "remit": "Owns the partner schools",
        "profile": "Placeholder profile. The background line the roster file carries for this person.",
        "quote": "Quote in their own words. If there is no quote, this block is absent and the card shows the rest.",
        "credentials": [
          "Past role, checkable",
          "Piece published, with the link"
        ],
        "jd": "Finds the partner schools and groups, and sets the session schedule with them.",
        "placeholder": true,
        "work": {
          "label": "Work done",
          "pending": true
        }
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Accounting and Finance, 2028",
        "remit": "Owns the literacy curriculum",
        "profile": "Placeholder profile. One or two sentences in third person, facts only.",
        "quote": "The line that says why this department, written as they would say it rather than as the society would.",
        "credentials": [
          "Past role, checkable",
          "Competition or certification, checkable"
        ],
        "jd": "Writes the curriculum for the financial literacy sessions, and keeps it teachable by anyone on the team.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics and Computer Science, 2029",
        "remit": "Owns the teaching roster",
        "profile": "Placeholder profile. Prior society roles, internships or coursework, kept checkable.",
        "quote": "One sentence they would actually say out loud, twenty five words at most.",
        "credentials": [
          "Past role, checkable"
        ],
        "jd": "Runs the volunteer roster, and makes sure every session has enough people who can teach it.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Computer Science, 2029",
        "remit": "Owns the record of sessions",
        "profile": "Placeholder profile. What they study, and what they ran before this.",
        "quote": "A quote from the member, kept as written. No quote means no block here.",
        "credentials": [
          "Certification, checkable",
          "Past role, checkable"
        ],
        "jd": "Keeps the record of sessions delivered and who attended, for the report at the end of the year.",
        "placeholder": true
      }
    ],
    "placeholder": true
  },
  {
    "name": "Events",
    "jd": "Owns the shape of the calendar: competitions, speaker sessions and simulations, from the format through to the registration list.",
    "members": [
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics, 2028",
        "remit": "Owns the competition formats",
        "profile": "Placeholder profile. One or two sentences in third person, facts only.",
        "quote": "The line that says why this department, written as they would say it rather than as the society would.",
        "credentials": [
          "Past role, checkable",
          "Competition or certification, checkable"
        ],
        "jd": "Designs the competition formats and writes the rulebooks competitors are judged against.",
        "placeholder": true,
        "work": {
          "label": "Work done",
          "pending": true
        }
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Accounting and Finance, 2028",
        "remit": "Owns speaker invites",
        "profile": "Placeholder profile. Prior society roles, internships or coursework, kept checkable.",
        "quote": "One sentence they would actually say out loud, twenty five words at most.",
        "credentials": [
          "Past role, checkable"
        ],
        "jd": "Invites speakers and sets the session schedule around their availability.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Economics and Computer Science, 2029",
        "remit": "Owns registration and waitlists",
        "profile": "Placeholder profile. What they study, and what they ran before this.",
        "quote": "A quote from the member, kept as written. No quote means no block here.",
        "credentials": [
          "Certification, checkable",
          "Past role, checkable"
        ],
        "jd": "Runs registration, the waitlist and confirmations, and answers the questions that come with them.",
        "placeholder": true
      },
      {
        "name": "Full name",
        "role": "Director",
        "year": "BSc Computer Science, 2029",
        "remit": "Owns the simulations",
        "profile": "Placeholder profile. Replaced by the member's own two lines when the roster is confirmed.",
        "quote": "Their own sentence about the work, not a summary of the role.",
        "credentials": [
          "Past role, checkable",
          "Piece published, with the link"
        ],
        "jd": "Runs the simulation and trading sessions, including the paper book the room trades.",
        "placeholder": true
      }
    ],
    "placeholder": true
  }
];
