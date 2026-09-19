// site.js — shared behaviour for the FINTRA demo pages. Nothing here is page specific.
// The .js class that arms the reveal CSS is set by one inline line in each page head, so the
// first paint already knows whether to hide .rise. Nothing here depends on it.

// Entrance reveal. Pending list filtered on the scroll frame, not IntersectionObserver:
// one jump that carries a block from below the viewport to above it produces no IO callback
// and that block would stay at opacity 0 for the session. See 01-DESIGN-SYSTEM.md.
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

// Header. Transparent over the top of the page, solid once content moves under it. --hdr is the
// measured height, so main's offset is right on a wrapped two line mobile nav too.
const hdr = document.querySelector('header.site');
const sizeHdr = () => document.documentElement.style.setProperty('--hdr', hdr.offsetHeight + 'px');
const onHdr = () => hdr.classList.toggle('solid', scrollY > 24);
addEventListener('scroll', onHdr, { passive: true });
addEventListener('resize', sizeHdr);
sizeHdr(); onHdr();

// ?closed=1 is the state after the deadline: the form is gone, the card stays. See 05-GB-APPLICATION.md.
const closed = document.getElementById('closed');
if (closed && location.search.indexOf('closed=1') > -1) {
  document.getElementById('formcard').hidden = true;
  closed.hidden = false;
}

// Department cards. <details> gives keyboard and touch for free; the script only adds the
// pointer affordance and keeps one card per department open. See 03-DEPARTMENTS.md.
const fine = matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.dept').forEach(dept => {
  const cards = [...dept.querySelectorAll('details.card')];
  cards.forEach(card => {
    card.addEventListener('toggle', () => {
      if (card.open) cards.forEach(o => { if (o !== card) o.open = false; });
    });
    if (fine.matches) {
      card.addEventListener('mouseenter', () => { if (!card.dataset.pinned) card.open = true; });
      card.addEventListener('mouseleave', () => { if (!card.dataset.pinned) card.open = false; });
      card.querySelector('summary').addEventListener('click', () => {
        card.dataset.pinned = card.open ? '' : '1';   // click fires before the native toggle
      });
    }
  });
});

// Live character counts: <textarea data-count="600" data-min="100">
document.querySelectorAll('[data-count]').forEach(el => {
  const out = el.parentElement.querySelector('.count');
  const min = +(el.dataset.min || 0), max = +el.dataset.count;
  const draw = () => {
    out.textContent = el.value.length + ' / ' + max + (el.value.length < min ? ' minimum ' + min : '');
  };
  el.addEventListener('input', draw); draw();
});

// Demo only: there is no endpoint behind this form. It shows the in place confirmation of
// 05-GB-APPLICATION.md and one real field rule, without pretending to file anything.
const form = document.querySelector('form[data-demo="apply"]');
document.querySelectorAll('form[data-demo]').forEach(f => {   // demo forms never navigate
  if (f !== form) f.addEventListener('submit', e => e.preventDefault());
});
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const why = form.querySelector('#why');
    const field = why.closest('.field');
    const bad = why.value.trim().length < 100;
    field.classList.toggle('invalid', bad);
    field.querySelector('.err').hidden = !bad;
    if (bad) { why.focus(); return; }
    const panel = form.parentElement.querySelector('#received');
    form.hidden = true;
    panel.hidden = false;
    panel.querySelector('[data-ref]').textContent = 'DEMO-0001';
    panel.querySelector('[data-email]').textContent = form.email.value;
  });
}
