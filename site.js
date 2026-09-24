/* ---- Hero képslider ---- */
(function heroSlider() {
  var slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  var current = 0;
  setInterval(function() {
    slides[current].classList.remove('blob-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('blob-active');
  }, 3500);
})();

// ============================================================
// Szeghalmi Tündérkert Óvoda és Bölcsőde – megosztott script
// ============================================================

/* ---- Hero intézmény-váltó ---- */


/* ---- Kapcsolat fülek ---- */
(function tabs(){
  const buttons = document.querySelectorAll('.tab-btn');
  if (!buttons.length) return;
  buttons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(b=> b.classList.toggle('is-active', b===btn));
      document.querySelectorAll('.tab-panel').forEach(p=> p.classList.toggle('is-active', p.id===target));
    });
  });
})();

/* ---- GYIK nyitogatás ---- */
(function faq(){
  document.querySelectorAll('.faq-q').forEach(q=>{
    q.addEventListener('click', ()=>{
      const item = q.closest('.faq-item');
      const open = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach(i=> i.classList.remove('is-open'));
      if (!open) item.classList.add('is-open');
      q.setAttribute('aria-expanded', String(!open));
    });
  });
})();


/* ---- Mobil menü ---- */
(function mobileNav(){
  const btn = document.getElementById('navToggle');
  const header = document.querySelector('.site-header');
  if (!btn || !header) return;

  function close(){
    header.classList.remove('nav-open');
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','Menü megnyitása');
  }

  btn.addEventListener('click', ()=>{
    const open = header.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
  });

  document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', ()=>{ if (window.innerWidth > 900) close(); });
})();
