// ============================================================
// ROUTER
// ============================================================
const mainEl = document.getElementById('mainContent');

function setActiveNav(view){
  document.querySelectorAll('.sb-item').forEach(btn=>{
    btn.classList.toggle('is-on', btn.dataset.view === view);
  });
}

function navigate(view){
  setActiveNav(view);
  window.scrollTo({top:0, behavior:'instant'});
  if(view==='home') renderHome();
  if(view==='obras') renderObras();
  if(view==='manual') renderManual();
  if(view==='autor') renderAutor();
  requestAnimationFrame(initReveal);
  mainEl.classList.remove('view-anim');
  void mainEl.offsetWidth;
  mainEl.classList.add('view-anim');
}

document.getElementById('sbNav').addEventListener('click', (e)=>{
  const btn = e.target.closest('.sb-item');
  if(btn) navigate(btn.dataset.view);
});

function initReveal(){
  const els = document.querySelectorAll('.reveal:not(.is-visible), .reveal-scale:not(.is-visible)');
  if(els.length){
    if(typeof IntersectionObserver === 'undefined'){
      els.forEach(el=>el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); } });
      }, {threshold:.15, rootMargin:"0px 0px -60px 0px"});
      els.forEach(el=>io.observe(el));
      setTimeout(()=>{ els.forEach(el=>el.classList.add('is-visible')); }, 2500);
    }
  }
  initCounters();
}

function initCounters(){
  const counters = document.querySelectorAll('[data-count]:not(.is-counted)');
  if(!counters.length) return;
  const animateCounter = (el)=>{
    el.classList.add('is-counted');
    const target = parseInt(el.dataset.count, 10);
    const duration = 900;
    const start = performance.now();
    const tick = (now)=>{
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if(p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if(typeof IntersectionObserver === 'undefined'){
    counters.forEach(el=>animateCounter(el));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ animateCounter(e.target); io.unobserve(e.target); } });
  }, {threshold:.4});
  counters.forEach(el=>io.observe(el));
}

function totalPiezas(){
  return CATALOG.reduce((sum,g)=>sum+g.pieces.length, 0);
}

// ============================================================
// VISTA: HOME
// ============================================================
function renderHome(){
  const total = totalPiezas();
  mainEl.innerHTML = `
    <section class="home-hero brand-band wrap">
      <div class="hh-kicker"><span class="dot"></span>Trabajo de grado · Institución Universitaria Pascual Bravo</div>
      <h1>El trabajo, pieza por pieza.</h1>
      <p class="hh-dek">Seis proyectos de comunicación interna, cada uno con su versión original y su resultado en código — abiertos aquí para revisión directa.</p>
      <div class="hh-row">
        <button class="btn btn-fill" onclick="navigate('obras')">Ver el catálogo →</button>
        <button class="btn btn-line" onclick="navigate('manual')">Ver el manual técnico</button>
      </div>

      <div class="colofon">
        <div class="colofon-grid">
          <div><div class="cf-n"><span data-count="${CATALOG.length}">0</span></div><div class="cf-l">Proyectos</div></div>
          <div><div class="cf-n">ARUS → Henkia</div><div class="cf-l">Marzo – Agosto 2026</div></div>
          <div><div class="cf-n"><span data-count="6">0</span> meses</div><div class="cf-l">Duración de la práctica</div></div>
          <div><div class="cf-n">Pascual Bravo</div><div class="cf-l">Diseño Gráfico</div></div>
        </div>
      </div>
    </section>

    <section class="home-intro">
      <div class="wrap intro-grid">
        <div class="intro-label">Sobre el<br>enfoque</div>
        <div class="intro-text reveal">
          <p>El Boletín 3 en Uno, el Kit del Líder, los micrositios del portal BUK, Henkia [Rec]onoce, la Guía de Onboarding y el Editor de Citaciones ya eran piezas de comunicación <strong>en uso activo</strong>, con un formato y un criterio editorial propios. Con Claude como herramienta de generación de código, cada una se llevó <strong>un paso más allá</strong> — sin alterar el criterio editorial ya definido por los equipos responsables.</p>
          <p><a href="#" onclick="navigate('obras'); return false;">Ver el catálogo completo, pieza por pieza →</a></p>
        </div>
      </div>
    </section>

    <section class="cat-preview">
      <div class="wrap">
        <div class="cp-head">
          <div class="cp-title">Los proyectos</div>
        </div>
        <div class="cat-list">
          ${CATALOG.map((g,i) => `
            <div class="cat-row reveal" onclick="navigate('obras'); setTimeout(()=>scrollToGroup('${g.id}'), 80);">
              <div class="cr-num">${String(i+1).padStart(2,'0')}</div>
              <div>
                <div class="cr-title">${g.title}</div>
                <div class="cr-tag">${g.pieces.length} ${g.pieces.length === 1 ? 'pieza' : 'piezas'} documentadas</div>
              </div>
              <div class="cr-arrow">→</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
