// ============================================================
// ROUTER
// ============================================================
const mainEl = document.getElementById('mainContent');

function setActiveNav(view){
  document.querySelectorAll('.tn-link').forEach(btn=>{
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
}

document.getElementById('tnNav').addEventListener('click', (e)=>{
  const btn = e.target.closest('.tn-link');
  if(btn) navigate(btn.dataset.view);
});

function initReveal(){
  const els = document.querySelectorAll('.reveal:not(.is-visible), .reveal-scale:not(.is-visible)');
  if(!els.length) return;
  if(typeof IntersectionObserver === 'undefined'){
    els.forEach(el=>el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, {threshold:.15, rootMargin:"0px 0px -60px 0px"});
  els.forEach(el=>io.observe(el));
  setTimeout(()=>{ els.forEach(el=>el.classList.add('is-visible')); }, 2500);
}

function totalPiezas(){
  return CATALOG.reduce((sum,g)=>sum+g.pieces.length, 0);
}

// ============================================================
// VISTA: HOME
// ============================================================
function renderHome(){
  mainEl.innerHTML = `
    <section class="hero">
      <div class="hero-kicker">Trabajo de grado · Institución Universitaria Pascual Bravo</div>
      <h1>Diseño gráfico potenciado con inteligencia artificial en Henkia.</h1>
      <p class="hero-dek">Un registro del trabajo realizado durante mi práctica profesional: usar Claude para llevar procesos de comunicación de la compañía un paso más allá de lo que sus herramientas originales permitían.</p>
      <div class="hero-row">
        <button class="btn btn-fill" onclick="navigate('obras')">Ver el catálogo</button>
        <button class="btn btn-line" onclick="navigate('manual')">Manual técnico</button>
      </div>
    </section>

    <section class="stats-strip">
      <div class="stats-grid">
        <div><div class="stat-n">6</div><div class="stat-l">Frentes de trabajo</div></div>
        <div><div class="stat-n">ARUS → Henkia</div><div class="stat-l">Marzo – Agosto 2026</div></div>
        <div><div class="stat-n">6 meses</div><div class="stat-l">Duración de la práctica</div></div>
        <div><div class="stat-n">Pascual Bravo</div><div class="stat-l">Diseño Gráfico</div></div>
      </div>
    </section>

    <section class="intro-section reveal">
      <p>El Boletín 3 en Uno, el Kit del Líder, los micrositios del portal BUK, ARUS [Rec]onoce y la Guía de Onboarding ya eran piezas de comunicación en uso activo dentro de la compañía, con un formato y un criterio editorial propios.</p>
      <p>Lo que documenta este archivo es cómo, con Claude como herramienta de generación de código, cada una de esas piezas se llevó un paso más allá de lo que su formato original permitía — sin alterar el criterio editorial ya definido por los equipos responsables de cada contenido.</p>
      <a href="#" onclick="navigate('obras'); return false;">Ver el catálogo completo, pieza por pieza →</a>
    </section>

    <section class="frentes-section">
      <div class="frentes-title reveal">Los frentes de trabajo</div>
      <div class="frentes-grid">
        ${CATALOG.map((g,i) => `
          <div class="frente-card reveal" onclick="navigate('obras'); setTimeout(()=>scrollToGroup('${g.id}'), 80);">
            <div class="frente-num">${String(i+1).padStart(2,'0')}</div>
            <div class="frente-name">${g.title}</div>
            <div class="frente-count">${g.pieces.length} ${g.pieces.length === 1 ? 'entrada' : 'entradas'}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}
