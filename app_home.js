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
}

document.getElementById('sbNav').addEventListener('click', (e)=>{
  const btn = e.target.closest('.sb-item');
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
  const total = totalPiezas();
  mainEl.innerHTML = `
    <section class="home-hero wrap">
      <div class="hh-kicker"><span class="dot"></span>Trabajo de grado · Institución Universitaria Pascual Bravo</div>
      <h1>Diseño gráfico potenciado con inteligencia artificial en Henkia.</h1>
      <p class="hh-dek">Un registro del trabajo realizado durante mi práctica profesional: usar Claude para llevar procesos de comunicación de la compañía un paso más allá de lo que sus herramientas originales permitían.</p>
      <p class="hh-body">Este archivo reúne el boletín interno, el material de liderazgo, el portal de consulta permanente, la producción audiovisual de reconocimiento y la guía de bienvenida — cada uno con su origen, su proceso y su resultado disponibles para revisión directa.</p>
      <div class="hh-row">
        <button class="btn btn-fill" onclick="navigate('obras')">Ver el catálogo →</button>
        <button class="btn btn-line" onclick="navigate('manual')">Ver el manual técnico</button>
      </div>

      <div class="colofon">
        <div class="colofon-grid">
          <div><div class="cf-n">6</div><div class="cf-l">Frentes de trabajo</div></div>
          <div><div class="cf-n">ARUS → Henkia</div><div class="cf-l">Marzo – Agosto 2026</div></div>
          <div><div class="cf-n">6 meses</div><div class="cf-l">Duración de la práctica</div></div>
          <div><div class="cf-n">Pascual Bravo</div><div class="cf-l">Diseño Gráfico</div></div>
        </div>
      </div>
    </section>

    <section class="home-intro">
      <div class="wrap intro-grid">
        <div class="intro-label">Sobre el<br>enfoque</div>
        <div class="intro-text reveal">
          <p>El Boletín 3 en Uno, el Kit del Líder, los micrositios del portal BUK, ARUS [Rec]onoce y la Guía de Onboarding ya eran piezas de comunicación <strong>en uso activo</strong> dentro de la compañía, con un formato y un criterio editorial propios.</p>
          <p>Lo que documenta este archivo es cómo, con Claude como herramienta de generación de código, cada una de esas piezas se llevó <strong>un paso más allá</strong> de lo que su formato original permitía — sin alterar el criterio editorial ya definido por los equipos responsables de cada contenido.</p>
          <p><a href="#" onclick="navigate('obras'); return false;">Ver el catálogo completo, pieza por pieza →</a></p>
        </div>
      </div>
    </section>

    <section class="cat-preview">
      <div class="wrap">
        <div class="cp-head">
          <div class="cp-title">Los frentes de trabajo</div>
        </div>
        <div class="cat-list">
          ${CATALOG.map((g,i) => `
            <div class="cat-row reveal" onclick="navigate('obras'); setTimeout(()=>scrollToGroup('${g.id}'), 80);">
              <div class="cr-num">${String(i+1).padStart(2,'0')}</div>
              <div>
                <div class="cr-title">${g.title}</div>
                <div class="cr-tag">${g.pieces.length} ${g.pieces.length === 1 ? 'entrada' : 'entradas'} documentadas</div>
              </div>
              <div class="cr-arrow">→</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
