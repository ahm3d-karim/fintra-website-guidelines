// render-departments.js: builds the departments page from window.FINTRA_DEPARTMENTS.
// Page specific, so it is not in site.js. Load order is data file, then this, then site.js, which
// wires the cards and the entrance reveal once the cards exist.
//
// Why the page is built from a file rather than typed as markup: adding a department or a person has
// to be a data edit. If a new department needed new markup, the model would be wrong
// (03-DEPARTMENTS.md, acceptance criterion 6).
(() => {
  const root = document.getElementById('roster');
  if (!root) return;

  const data = window.FINTRA_DEPARTMENTS;
  // ?empty=1 is the state before the roster lands: every department keeps its description and shows
  // the pending line instead of a grid. Same idea as ?closed=1 on the application page.
  const empty = new URLSearchParams(location.search).has('empty');
  const PENDING = 'Roster for the 2026 to 2027 term is being finalised.';
  const NODATA = 'The roster file did not load, so no departments are shown. data/departments.js has to load before this script.';

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;   // textContent throughout: data never becomes markup
    return n;
  };

  // Two letters off the name: "Full name" becomes "FN". A member with a photo still gets one, because
  // it is the fallback when the file is missing, and the tile keeps its box either way.
  const monogram = name => String(name || '').trim().split(/\s+/).slice(0, 2)
    .map(w => w[0] || '').join('').toUpperCase() || '?';

  // The delay rides in --d inside the transition shorthand, capped at three steps, so a card row
  // does not cascade down the whole grid. See 01-DESIGN-SYSTEM.md.
  const rise = (node, step) => {
    node.classList.add('rise');
    if (step) node.classList.add('d' + Math.min(step, 3));
    return node;
  };

  const person = (m, i) => {
    const card = rise(el('details', 'card'), i);
    const top = el('summary', 'card__top');
    const tile = el('span', 'tile', monogram(m.name));
    tile.setAttribute('aria-hidden', 'true');

    if (m.photo) {                            // square repo file, never an upload path
      const img = el('img');
      img.src = m.photo;
      img.alt = '';                           // the name is the next thing in the card
      img.width = 56;
      img.height = 56;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.addEventListener('error', () => img.remove());   // monogram stays visible underneath
      tile.textContent = '';
      tile.append(img);
    }

    const box = el('div');
    const h3 = el('h3', null, m.name);
    if (m.role) h3.append(el('span', 'card__role', m.role));
    box.append(h3);
    if (m.year) box.append(el('p', 'card__year', m.year));
    if (m.remit) box.append(el('p', 'card__remit', m.remit));   // one line, truncated by CSS
    top.append(tile, box);
    card.append(top);

    // Every block is conditional: a missing field renders nothing, never an empty quote mark, an
    // empty list or the word undefined (acceptance criteria 5).
    const body = el('div', 'card__body');
    if (m.profile) body.append(el('p', null, m.profile));
    if (m.quote) body.append(el('p', 'card__quote', m.quote));
    if (Array.isArray(m.credentials) && m.credentials.length) {
      const ul = el('ul', 'card__creds');
      m.credentials.forEach(c => ul.append(el('li', null, c)));
      body.append(ul);
    }
    if (m.jd) body.append(el('p', null, m.jd));
    if (m.work && m.work.label) {
      const line = el('p', null, m.work.label + ' \u00b7 ');
      line.style.margin = '0';
      line.style.color = 'var(--muted)';
      if (m.work.url) {
        const a = el('a', null, 'Open');
        a.href = m.work.url;
        line.append(a);
      } else {
        line.append(el('span', 'mono', 'link pending'));   // a pending label, never a dead anchor
      }
      body.append(line);
    }
    if (!body.childElementCount) body.append(el('p', null, PENDING));
    card.append(body);
    return card;
  };

  const department = (d, di) => {
    const members = empty ? [] : (Array.isArray(d.members) ? d.members.filter(Boolean) : []);
    const block = el('div', 'dept');
    // One rectangle per department: header strip, then the description and the directors inside it.
    const box = el('div', 'dept__box');

    const head = rise(el('div', 'dept__head'), di);
    head.append(el('h2', null, d.name));

    const roles = new Set(members.map(m => m.role).filter(Boolean));
    const meta = !members.length ? 'Roster pending'
      : roles.size === 1 ? members.length + ' ' + [...roles][0].toLowerCase() + 's'
        : members.length + ' people';
    head.append(el('p', 'dept__meta', [meta, d.since ? 'since ' + d.since : ''].filter(Boolean).join(' \u00b7 ')));
    box.append(head);

    const body = el('div', 'dept__body');
    if (d.jd) body.append(rise(el('p', 'prose', d.jd), 1));

    if (members.length) {
      const grid = el('div', 'grid grid--people');
      members.forEach((m, i) => grid.append(person(m, i)));
      body.append(grid);
    } else {
      body.append(rise(el('p', 'prose', PENDING), 1));
    }

    box.append(body);
    block.append(box);
    return block;
  };

  if (!Array.isArray(data) || !data.length) {
    root.append(el('p', 'prose', NODATA));
    return;
  }

  data.forEach((d, i) => { if (d && d.name) root.append(department(d, i)); });
})();
