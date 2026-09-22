// render-departments-v2.js: the ledger index variant of the departments page.
// Load order is data/departments.js, then render-departments.js (which only exports the shared
// card helpers on this page, since there is no #roster here), then this, then site.js, which wires
// the person cards and collects the .rise rows once they exist.
//
// The shape: one ruled row per department (number, name, one clamped line of what it owns, head
// count). Opening a row shows the description and the directors, built with the same person card
// the box layout uses, so a new department or person is still a data edit (03-DEPARTMENTS.md,
// acceptance criterion 6).
(() => {
  const root = document.getElementById('index');
  if (!root) return;

  const NODATA = 'The roster file did not load, so no departments are shown. data/departments.js has to load before this script.';
  const PENDING = 'Roster for the 2026 to 2027 term is being finalised.';

  if (!window.FINTRA_DEPT) {
    const p = document.createElement('p');
    p.className = 'prose';
    p.textContent = NODATA;
    root.append(p);
    return;
  }
  const { el, rise, person } = window.FINTRA_DEPT;

  const data = window.FINTRA_DEPARTMENTS;
  const empty = new URLSearchParams(location.search).has('empty');   // mirrors ?empty=1 on the box page

  if (!Array.isArray(data) || !data.length) {
    root.append(el('p', 'prose', NODATA));
    return;
  }

  const ledger = el('div', 'ledger');
  let n = 0;
  data.forEach(d => {
    if (!d || !d.name) return;
    n++;

    const members = empty ? [] : (Array.isArray(d.members) ? d.members.filter(Boolean) : []);
    // ponytail: row exclusivity rides on <details name>; browsers without it (Safari < 17,
    // Chrome < 120) allow more than one row open, which is the old page's behaviour anyway.
    // Upgrade path: a toggle listener that closes siblings, if that ever matters.
    const row = rise(el('details', 'row dept'), n);
    row.setAttribute('name', 'dept');
    row.id = 'dept-' + n;

    const sum = el('summary', 'row__sum');
    sum.append(el('span', 'row__no mono', String(n).padStart(2, '0')));
    sum.append(el('h2', null, d.name));
    if (d.jd) sum.append(el('p', 'row__owns', d.jd));   // clamped to one line by CSS, absent if there is no jd

    const roles = new Set(members.map(m => m.role).filter(Boolean));
    const meta = !members.length ? 'Roster pending'
      : roles.size === 1 ? members.length + ' ' + [...roles][0].toLowerCase() + 's'
        : members.length + ' people';
    sum.append(el('p', 'row__meta mono', meta));
    row.append(sum);

    const body = el('div', 'dept__body');
    if (d.jd) body.append(el('p', 'prose', d.jd));
    if (members.length) {
      const grid = el('div', 'grid grid--people');
      members.forEach((m, i) => grid.append(person(m, i)));
      body.append(grid);
    } else {
      body.append(el('p', 'prose', PENDING));
    }
    row.append(body);
    ledger.append(row);
  });
  root.append(ledger);

  // Deep link: #dept-3 opens that row (the name attribute closes the others). Any other fragment
  // (the skip link's #main, say) is not a details element, so it is left alone.
  const fromHash = () => {
    const t = document.getElementById(location.hash.slice(1));
    if (t instanceof HTMLDetailsElement) t.open = true;
  };
  addEventListener('hashchange', fromHash);
  fromHash();
})();
